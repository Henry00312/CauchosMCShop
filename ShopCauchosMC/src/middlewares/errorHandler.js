// Manejo centralizado de errores.
//
// Hasta ahora cada capa hacia console.log(error) y devolvia undefined, o bien
// dejaba escapar la excepcion. Este middleware da un unico punto de registro y
// una respuesta uniforme, sin filtrar detalles internos al cliente.

import logger from '../lib/logger.js';

// Express 4 no captura errores de handlers async: el rechazo se pierde y la
// peticion queda colgada. Envolver el handler encamina el error al middleware.
export function asyncHandler(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

// Rutas no reconocidas: responde 404 en JSON en lugar del HTML por defecto.
export function notFoundHandler(req, res) {
    logger.warn('Ruta no encontrada', { method: req.method, path: req.originalUrl });
    res.status(404).json({ error: 'Recurso no encontrado' });
}

// Debe registrarse el ultimo y declarar los cuatro parametros: asi es como
// Express distingue un middleware de error de uno normal.
export function errorHandler(err, req, res, next) {
    const estado = Number.isInteger(err?.status) ? err.status : 500;

    logger.error('Error no controlado en la peticion', {
        method: req.method,
        path: req.originalUrl,
        status: estado,
        error: err?.message,
        stack: err?.stack
    });

    // La respuesta ya empezo a enviarse: delegar en Express para que cierre la
    // conexion, en lugar de provocar ERR_HTTP_HEADERS_SENT.
    if (res.headersSent) {
        return next(err);
    }

    // Los mensajes internos solo se exponen en errores de cliente (4xx).
    const mensaje = estado < 500 && err?.message ? err.message : 'Error interno del servidor';

    res.status(estado).json({ error: mensaje });
}

export default errorHandler;
