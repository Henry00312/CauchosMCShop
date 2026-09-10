// Middleware que valida la firma del webhook antes de procesar el evento.
//
// Compatibilidad: si MERCADOPAGO_WEBHOOK_SECRET no esta configurado, la
// validacion queda desactivada y el flujo actual sigue funcionando igual que
// antes. Se avisa al arrancar y en cada notificacion recibida, porque ese estado
// deja el endpoint abierto a notificaciones falsificadas y solo deberia ser
// transitorio, hasta cargar el secreto del panel de Mercado Pago.

import { MERCADOPAGO_WEBHOOK_SECRET } from '../config.js';
import { esFirmaValida } from '../services/mercadopago/verifySignature.js';
import logger from '../lib/logger.js';

export function verificarFirmaMercadoPago(req, res, next) {
    if (!MERCADOPAGO_WEBHOOK_SECRET) {
        logger.warn(
            'Webhook recibido sin validar: MERCADOPAGO_WEBHOOK_SECRET no configurado'
        );
        return next();
    }

    const resultado = esFirmaValida({
        cabeceraFirma: req.headers['x-signature'],
        requestId: req.headers['x-request-id'],
        dataId: req.query['data.id'],
        secreto: MERCADOPAGO_WEBHOOK_SECRET
    });

    if (!resultado.valida) {
        logger.warn('Webhook rechazado por firma invalida', {
            motivo: resultado.motivo,
            ip: req.ip,
            dataId: req.query['data.id'],
            tipo: req.query.type
        });

        return res.status(401).json({ error: 'Firma invalida' });
    }

    next();
}

export default verificarFirmaMercadoPago;
