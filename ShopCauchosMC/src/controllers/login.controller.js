import jwt from 'jsonwebtoken'
import { SECRET_KEY, OwAdm, ENTMG } from '../config.js'
import { compare } from '../services/handleBcrypt.js'


// Middleware para verificar el token en las rutas protegidas
export function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        if(req.user.correoIn !== OwAdm){
            return res.status(401).json({ message: 'Token inválido' });
        }
        next();
    });
}


export async function logIn(req, res) {
    try {
        const { correoIn, jtgd } = req.body;
        var token = null;
        if (OwAdm === correoIn) {
            const checkPass = await compare(jtgd, ENTMG)
            if (checkPass) {
                // Generar el token JWT
                token = jwt.sign({ correoIn }, SECRET_KEY, { expiresIn: '3h' });
            }
        }
        (token === null) ? res.status(401).json({ message: 'Credenciales incorrectas' }) : res.header('auth-token', token).json({ token, expiration: Date.now() + 3 * 60 * 60 * 1000 });
    } catch (error) {
        console.log(error);
    }
}



