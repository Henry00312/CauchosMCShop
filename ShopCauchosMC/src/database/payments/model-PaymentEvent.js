import { Schema, model } from "mongoose";

// Registro de eventos recibidos de Mercado Pago, para garantizar que una misma
// notificacion no se procese dos veces.
//
// Mercado Pago reintenta las notificaciones hasta recibir un 2xx, y ademas
// notifica varias veces el mismo pago conforme cambia de estado
// (in_process -> approved). Por eso la clave de deduplicacion combina el
// identificador del pago con su estado: cada transicion se procesa una sola
// vez, pero un reenvio de la misma transicion se descarta.

const ESTADOS_PROCESAMIENTO = ['procesando', 'procesado', 'fallido'];

const paymentEventSchema = new Schema({
    // `${mpPaymentId}:${mpStatus}`. El indice unico es el mecanismo real de
    // exclusion: dos peticiones simultaneas compiten por insertarlo y solo una
    // puede ganar.
    eventKey: {
        type: String,
        required: true,
        unique: true
    },
    mpPaymentId: {
        type: Number,
        required: true,
        index: true
    },
    mpStatus: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ESTADOS_PROCESAMIENTO,
        default: 'procesando',
        index: true
    },
    // Numero de veces que se ha reclamado el evento. Un valor alto indica
    // fallos repetidos que merecen revision manual.
    intentos: {
        type: Number,
        default: 1
    },
    resultado: String,
    error: String,
    procesadoEn: Date
}, { timestamps: true });

export const ESTADOS = ESTADOS_PROCESAMIENTO;

// Nombre de coleccion explicito para no depender de la pluralizacion de Mongoose.
const PaymentEvent = model('PaymentEvent', paymentEventSchema, 'payment_events');

export default PaymentEvent;
