import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;

export const HOST = process.env.HOST;

export const URI = process.env.MONGODB_URI;

export const MQURI = process.env.RABBITMQ_URI;

// --- Mercado Pago ---
// El modo determina la credencial usada en TODO el flujo. La creación de
// preferencias y la consulta de pagos del webhook deben compartir la misma
// cuenta: si no coinciden, el pago creado no es consultable y el pedido no
// llega a registrarse.
const MP_MODOS_VALIDOS = ['test', 'production'];

const mpModoConfigurado = (process.env.MP_MODE || '').trim().toLowerCase();

if (mpModoConfigurado && !MP_MODOS_VALIDOS.includes(mpModoConfigurado)) {
    throw new Error(
        `MP_MODE inválido: "${mpModoConfigurado}". Valores admitidos: ${MP_MODOS_VALIDOS.join(' | ')}`
    );
}

export const MP_MODE = mpModoConfigurado || 'test';

if (!mpModoConfigurado) {
    console.warn(
        '[config] MP_MODE no está definido; se asume "test". Defínelo explícitamente en el .env de cada entorno.'
    );
}

// Compatibilidad temporal: se conservan los nombres anteriores para no romper
// importaciones existentes. Retirar cuando ya nadie los consuma.
export const MERCADOPAGO_TOKEN = process.env.MERCADOPAGO_KEY;

export const MERCADOPAGO_TOKEN_TEST = process.env.MERCADOPAGO_KEY_TEST;

// Credencial efectiva. Es la única que debe usarse en código nuevo.
export const MERCADOPAGO_ACCESS_TOKEN =
    MP_MODE === 'production' ? MERCADOPAGO_TOKEN : MERCADOPAGO_TOKEN_TEST;

const MP_VARIABLE_ESPERADA =
    MP_MODE === 'production' ? 'MERCADOPAGO_KEY' : 'MERCADOPAGO_KEY_TEST';

if (!MERCADOPAGO_ACCESS_TOKEN || !MERCADOPAGO_ACCESS_TOKEN.trim()) {
    throw new Error(
        `Falta la credencial de Mercado Pago: MP_MODE="${MP_MODE}" requiere ${MP_VARIABLE_ESPERADA} en el entorno.`
    );
}

const MP_PREFIJO_ESPERADO = MP_MODE === 'production' ? 'APP_USR-' : 'TEST-';

if (!MERCADOPAGO_ACCESS_TOKEN.startsWith(MP_PREFIJO_ESPERADO)) {
    console.warn(
        `[config] ${MP_VARIABLE_ESPERADA} no empieza por "${MP_PREFIJO_ESPERADO}". ` +
        `Verifica que la credencial corresponda al modo "${MP_MODE}".`
    );
}

console.log(`[config] Mercado Pago en modo "${MP_MODE}" (credencial: ${MP_VARIABLE_ESPERADA})`);

export const SECRET_KEY = process.env.TOKEN_KEY;

export const OwAdm = process.env.OwA;

export const AMN = process.env.AM;

export const ENTMG = process.env.ENTMANG;
