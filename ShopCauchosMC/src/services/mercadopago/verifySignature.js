// Validacion de la firma HMAC de las notificaciones de Mercado Pago.
//
// Mercado Pago firma cada webhook con la clave secreta configurada en su panel.
// Envia dos cabeceras:
//   x-signature:  "ts=<marca de tiempo>,v1=<hash hexadecimal>"
//   x-request-id: identificador de la peticion
// El hash es un HMAC-SHA256 sobre un manifiesto construido con el id del
// recurso (parametro de consulta data.id), el x-request-id y la marca temporal.
//
// Sin esta comprobacion, cualquiera que conozca la URL puede inventar una
// notificacion y provocar el registro de pagos y pedidos.

import crypto from 'crypto';

// Convierte "ts=123,v1=abc" en { ts: "123", v1: "abc" }.
export function parsearCabeceraFirma(cabecera) {
    if (typeof cabecera !== 'string') return {};

    return cabecera.split(',').reduce((acumulado, parte) => {
        const separador = parte.indexOf('=');
        if (separador === -1) return acumulado;

        const clave = parte.slice(0, separador).trim();
        const valor = parte.slice(separador + 1).trim();
        if (clave) acumulado[clave] = valor;

        return acumulado;
    }, {});
}

// Plantilla de Mercado Pago: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
// Los componentes ausentes se omiten por completo, incluido su punto y coma.
// Los identificadores alfanumericos se normalizan a minusculas.
export function construirManifiesto({ dataId, requestId, ts }) {
    const partes = [];

    if (dataId !== undefined && dataId !== null && dataId !== '') {
        partes.push(`id:${String(dataId).toLowerCase()};`);
    }
    if (requestId) {
        partes.push(`request-id:${requestId};`);
    }
    if (ts) {
        partes.push(`ts:${ts};`);
    }

    return partes.join('');
}

// Comparacion en tiempo constante: evita filtrar informacion sobre el hash
// esperado a traves del tiempo de respuesta.
function sonIguales(a, b) {
    const bufferA = Buffer.from(a, 'utf8');
    const bufferB = Buffer.from(b, 'utf8');

    if (bufferA.length !== bufferB.length) return false;

    return crypto.timingSafeEqual(bufferA, bufferB);
}

export function esFirmaValida({ cabeceraFirma, requestId, dataId, secreto }) {
    if (!secreto) {
        return { valida: false, motivo: 'secreto no configurado' };
    }

    const { ts, v1 } = parsearCabeceraFirma(cabeceraFirma);

    if (!ts || !v1) {
        return { valida: false, motivo: 'cabecera x-signature ausente o mal formada' };
    }

    const manifiesto = construirManifiesto({ dataId, requestId, ts });

    const esperado = crypto
        .createHmac('sha256', secreto)
        .update(manifiesto)
        .digest('hex');

    return sonIguales(esperado, v1.toLowerCase())
        ? { valida: true }
        : { valida: false, motivo: 'firma no coincide' };
}
