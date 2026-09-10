// Limitacion de intentos de autenticacion.
//
// El acceso administrativo es un unico usuario conocido, asi que sin limite la
// unica barrera frente a fuerza bruta es el coste de bcrypt. Se aplica solo al
// endpoint de login: el resto de rutas queda sin tocar.

import rateLimit from 'express-rate-limit';
import logger from '../lib/logger.js';

function aEntero(valor, porDefecto) {
    const numero = Number.parseInt(valor, 10);
    return Number.isFinite(numero) && numero > 0 ? numero : porDefecto;
}

// Configurables para poder ajustarlos por entorno sin tocar codigo.
const VENTANA_MS = aEntero(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
const MAXIMO = aEntero(process.env.LOGIN_RATE_LIMIT_MAX, 5);

export const loginRateLimiter = rateLimit({
    windowMs: VENTANA_MS,
    limit: MAXIMO,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Los intentos correctos no consumen cuota: el limite persigue el tanteo
    // repetido de credenciales, no el uso legitimo.
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        logger.warn('Limite de intentos de login superado', { ip: req.ip });
        res.status(429).json({ message: 'Demasiados intentos. Intenta de nuevo mas tarde.' });
    }
});

export default loginRateLimiter;
