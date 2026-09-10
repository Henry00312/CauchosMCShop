// Logger centralizado, sin dependencias externas.
//
// Sustituye progresivamente a los console.log dispersos. Emite una linea por
// evento con nivel, marca temporal ISO y contexto opcional en JSON, de modo que
// la salida sea legible en desarrollo y parseable por el recolector de logs del
// entorno de despliegue.
//
// LOG_LEVEL controla el umbral (error < warn < info < debug). Por defecto info.

const NIVELES = { error: 0, warn: 1, info: 2, debug: 3 };

const NIVEL_POR_DEFECTO = 'info';

const nivelConfigurado = (process.env.LOG_LEVEL || '').trim().toLowerCase();

const nivelActivo = Object.prototype.hasOwnProperty.call(NIVELES, nivelConfigurado)
    ? nivelConfigurado
    : NIVEL_POR_DEFECTO;

// Claves cuyo valor nunca debe acabar en los logs.
const CLAVES_SENSIBLES = [
    'password', 'pass', 'token', 'authorization', 'auth',
    'accesstoken', 'access_token', 'secret', 'key', 'jtgd'
];

function esSensible(clave) {
    const normalizada = String(clave).toLowerCase();
    return CLAVES_SENSIBLES.some(sensible => normalizada.includes(sensible));
}

// Copia el contexto ocultando valores sensibles. Profundidad acotada para no
// recorrer payloads grandes (por ejemplo, la respuesta cruda de Mercado Pago).
function sanear(valor, profundidad = 0) {
    if (valor === null || typeof valor !== 'object') return valor;
    if (profundidad >= 3) return '[objeto]';
    if (Array.isArray(valor)) return valor.slice(0, 20).map(v => sanear(v, profundidad + 1));

    const salida = {};
    for (const [clave, contenido] of Object.entries(valor)) {
        salida[clave] = esSensible(clave) ? '[oculto]' : sanear(contenido, profundidad + 1);
    }
    return salida;
}

function emitir(nivel, mensaje, contexto) {
    if (NIVELES[nivel] > NIVELES[nivelActivo]) return;

    const linea = `${new Date().toISOString()} [${nivel.toUpperCase()}] ${mensaje}`;
    const destino = nivel === 'error' ? console.error : nivel === 'warn' ? console.warn : console.log;

    if (contexto === undefined) {
        destino(linea);
        return;
    }

    // Un Error no serializa con JSON.stringify: se extrae lo util.
    const datos = contexto instanceof Error
        ? { error: contexto.message, stack: contexto.stack }
        : sanear(contexto);

    try {
        destino(`${linea} ${JSON.stringify(datos)}`);
    } catch {
        // Referencias circulares u objetos no serializables.
        destino(`${linea} [contexto no serializable]`);
    }
}

export const logger = {
    error: (mensaje, contexto) => emitir('error', mensaje, contexto),
    warn: (mensaje, contexto) => emitir('warn', mensaje, contexto),
    info: (mensaje, contexto) => emitir('info', mensaje, contexto),
    debug: (mensaje, contexto) => emitir('debug', mensaje, contexto),
    nivel: nivelActivo
};

export default logger;
