import PaymentEvent from './model-PaymentEvent.js';

// Tiempo tras el cual un evento que quedo en "procesando" se considera
// abandonado (por ejemplo, si el proceso murio a mitad) y puede reclamarse de
// nuevo. Sin esto, un fallo brusco bloquearia ese evento para siempre.
const MS_RECLAMO_ABANDONADO = Number.parseInt(
    process.env.PAYMENT_EVENT_STALE_MS, 10
) || 5 * 60 * 1000;

export function construirClaveEvento(mpPaymentId, mpStatus) {
    return `${mpPaymentId}:${mpStatus}`;
}

// Intenta tomar posesion exclusiva del evento.
//
// Devuelve { reclamado: true } solo si el llamador es quien debe procesarlo.
// La exclusion se apoya en dos operaciones atomicas de MongoDB: la insercion
// contra el indice unico, y el findOneAndUpdate condicionado por estado. No hay
// ventana entre comprobar y actuar, asi que es seguro ante concurrencia.
export async function reclamarEvento({ mpPaymentId, mpStatus }) {
    const eventKey = construirClaveEvento(mpPaymentId, mpStatus);

    try {
        const evento = await PaymentEvent.create({
            eventKey,
            mpPaymentId,
            mpStatus,
            estado: 'procesando'
        });

        return { reclamado: true, motivo: 'nuevo', evento };
    } catch (error) {
        // Cualquier error que no sea clave duplicada debe propagarse: significa
        // que no hemos podido registrar el evento y no sabemos su situacion.
        if (error?.code !== 11000) throw error;

        // Ya existia. Solo se vuelve a reclamar si el intento anterior fallo o
        // quedo abandonado; un evento ya procesado nunca se reprocesa.
        const limiteAbandono = new Date(Date.now() - MS_RECLAMO_ABANDONADO);

        const rescatado = await PaymentEvent.findOneAndUpdate(
            {
                eventKey,
                $or: [
                    { estado: 'fallido' },
                    { estado: 'procesando', updatedAt: { $lt: limiteAbandono } }
                ]
            },
            { $set: { estado: 'procesando' }, $inc: { intentos: 1 } },
            { new: true }
        );

        if (rescatado) {
            return { reclamado: true, motivo: 'reintento', evento: rescatado };
        }

        const existente = await PaymentEvent.findOne({ eventKey });

        return {
            reclamado: false,
            motivo: 'duplicado',
            estadoActual: existente?.estado,
            evento: existente
        };
    }
}

export async function marcarProcesado(eventKey, resultado) {
    return PaymentEvent.findOneAndUpdate(
        { eventKey },
        {
            $set: {
                estado: 'procesado',
                resultado: resultado || 'ok',
                error: null,
                procesadoEn: new Date()
            }
        },
        { new: true }
    );
}

export async function marcarFallido(eventKey, error) {
    return PaymentEvent.findOneAndUpdate(
        { eventKey },
        {
            $set: {
                estado: 'fallido',
                error: String(error?.message || error || 'error desconocido')
            }
        },
        { new: true }
    );
}

export async function buscarEvento(eventKey) {
    return PaymentEvent.findOne({ eventKey });
}
