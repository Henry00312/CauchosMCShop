import { MercadoPagoConfig, Payment} from "mercadopago"
import { MERCADOPAGO_ACCESS_TOKEN } from "../config.js"
import {AsignarIDSolicitudes} from '../services/IDSolicitudes.js'
import { publisher } from '../colas/publicer-Colas.js'
import { UltimaDatePedid, pickDateProg } from '../services/respuestas-solicitudes.js'
import { crearOrder } from '../services/create-order.js'
import { reclamarEvento, marcarProcesado, marcarFallido } from '../database/payments/payment-events.js'
import logger from '../lib/logger.js'

let timeOutIdDates;
let timeOutIdPickDates;
function stopTimeOutDates() {
    clearInterval(timeOutIdDates);
}
function stopTimeOutPickDates() {
    clearInterval(timeOutIdPickDates);
}

// Crear la preferencia es una operacion peticion/respuesta: el usuario espera
// la URL de pago. Pasaba por RabbitMQ y luego se sondeaba un array en memoria
// cada segundo, lo que anadia latencia sin ninguna contrapartida y dejaba la
// peticion colgada indefinidamente si la respuesta no llegaba. Ahora se llama
// al servicio directamente.
//
// El contrato de respuesta no cambia: sigue siendo { url }, que es lo que el
// consumidor de la cola devolvia antes.
export const createOrder = async (req, res) => {
    //console.log('Origen recibido:', req.headers.origin);
    try {
        const data = await crearOrder(req.body);

        if (!data?.url) {
            throw new Error('Mercado Pago no devolvio una URL de pago');
        }

        res.send(data);
    } catch (error) {
        logger.error('Fallo al crear la preferencia de pago', error);

        if (!res.headersSent) {
            // 502: el fallo proviene del servicio externo, no de la peticion.
            res.status(502).json({ error: 'No se pudo crear la preferencia de pago' });
        }
    }
};


export const receiveWebhook = async (req, res) => {
    
    const payment = req.query;
    /*console.log('Headers:', req.headers);
    console.log('Query:', req.query);*/
    /*const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Solicitud desde IP:', ip);*/
    //console.log(payment);

    try {
        if (payment.type === "payment") {

            const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });
            const capPay = new Payment(client);
            const data = await capPay.get({id: payment['data.id'] });

            // Mercado Pago reintenta hasta recibir un 2xx y notifica cada
            // cambio de estado del mismo pago. Se toma posesion exclusiva del
            // par (pago, estado) antes de encolar nada: si otra peticion ya lo
            // reclamo, esta se descarta sin reprocesar.
            const reclamo = await reclamarEvento({
                mpPaymentId: data.id,
                mpStatus: data.status
            });

            if (!reclamo.reclamado) {
                logger.info('Webhook duplicado descartado', {
                    mpPaymentId: data.id,
                    mpStatus: data.status,
                    estadoActual: reclamo.estadoActual
                });

                // 200 tambien para el duplicado: un error haria que Mercado Pago
                // siguiera reintentando una notificacion ya atendida.
                return res.sendStatus(200);
            }

            const claveEvento = reclamo.evento.eventKey;

            try {
                //const data = await mercadopago.payment.findById(payment['data.id']);
                // Store in database
                if (data.status === 'approved') {
                    await publisher("RegistrarPago", data);
                }
                else if (data.status === 'in_process') {
                    await publisher("RegistrarPending", data);
                }
                else if(data.status === 'cancelled'){
                    await publisher("CancelarPending", data.id);
                }

                await marcarProcesado(claveEvento, `encolado:${data.status}`);
            } catch (error) {
                // El evento queda como fallido, no como procesado, para que un
                // reintento posterior de Mercado Pago pueda volver a tomarlo.
                await marcarFallido(claveEvento, error);
                throw error;
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        // sendStatus() ya envia la respuesta; encadenar .json() lanzaba
        // ERR_HTTP_HEADERS_SENT y convertia cualquier fallo del webhook en una
        // excepcion no capturada. status() solo fija el codigo y deja enviar.
        return res.status(500).json({ error: error.message });
    }
}

export const Tiempo_Pedido = async (req, res) => {
     // ID SOLICITUD
     const ID_SOLICITUD = AsignarIDSolicitudes();
     // AGREGAR LA ID DE LA SOLICITUD
     const message = {contenidoRX: req.body, id_solicitud: ID_SOLICITUD};
     //ENCOLAR
     await publisher("UltimaFechaPedido", message);
     //ESPERANDO RESPUESTA
     var result = null;
     timeOutIdDates = setInterval(() => {
         result = UltimaDatePedid(ID_SOLICITUD);
         if (result !== null) {
            res.send(result);
            stopTimeOutDates();
         }
     }, 1000);

}

export const Tiempo_Pick = async (req, res) => {
    // ID SOLICITUD
     const ID_SOLICITUD = AsignarIDSolicitudes();
     // AGREGAR LA ID DE LA SOLICITUD
     const message = {contenidoRX: req.query, id_solicitud: ID_SOLICITUD};
     //ENCOLAR
     await publisher("FechaFin", message);
     //ESPERANDO RESPUESTA
     var result = null;
     timeOutIdPickDates = setInterval(() => {
         result = pickDateProg(ID_SOLICITUD);
         if (result !== null) {
            res.send(result);
            stopTimeOutPickDates();
         }
     }, 1000);
}

// Obtén la fecha en formato Local y luego formateada
//const fechaLocal = ultimoDocumento.Date_Fin_Prodcc.toLocaleString();
//var fechaFormateada = `${fechaLocal.slice(0, 17).replace('T', ' ')}`; // Formato "año/mes/día hora:minutos"

// Formato "año/mes/día"
//ini_Prod = ini_Prod.split('T')[0];


//Ready-payments controller

import { Payments, PaymentsMounth, PaymentDelete, PaymentUpdate } from '../services/ready-payments.js';

export const get_PaymentsReady = async (req, res) => {
    const payments = await Payments();
    res.send({ data: payments});
}

export const update_PaymentReady = async (req, res) => {
    const mess = await PaymentUpdate(req);
    res.send({ message: mess});
}

export const delete_PaymentReady = async (req, res) => {
    const mess = await PaymentDelete(req);
    res.send({ message: mess});
}
 
// PaymentsMounth ?

//Pending-payments controller

import {Pendings, PendingDelete, PendingUpdate} from '../services/pending-payments.js'

export const get_PaymentsPending = async (req, res) => {
    const pendings = await Pendings();
    res.send({ data: pendings});
}

export const update_PaymentPending = async (req, res) => {
    const mess = await PendingUpdate(req);
    res.send({ message: mess});
}

export const delete_PaymentPending = async (req, res) => {
    const mess = await PendingDelete(req.query.id);
    res.send({ message: mess});
}