import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import paymentRoutes from './routes/payment.routes.js'
import {PORT} from './config.js'
import './database/database.js'
import RabbitMQ from './colas/conexionRabbit.js'
import logger from './lib/logger.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'


var corsOptions = {//origin: '*',
    origin: ['https://shopcauchosmc.com', 'https://dev.shopcauchosmc.com', 'http://localhost:8080'], // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
// Cabeceras de seguridad. crossOriginResourcePolicy se relaja a cross-origin
// porque el frontend se sirve desde otro origen en desarrollo; el valor por
// defecto (same-origin) romperia ese consumo.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));
app.use(cors(corsOptions));
app.use(morgan('dev', { stream: { write: mensaje => logger.info(mensaje.trim()) } }));
app.use(paymentRoutes);
//app.use(express.static('public'));//app.use(express.static(path.resolve('src/presentacion')));

// Deben ir despues de las rutas: primero el 404, luego el manejador de errores.
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT);

logger.info('Servidor iniciado', { puerto: PORT });

RabbitMQ.connect();
//docker-compose logs -f backend

//dir
//docker-compose build frontend
//docker-compose up -d

//GIT
/*
git add . && \
rm -rf cauchosmc/.git && \
git rm --cached -rf cauchosmc && \
rm -rf ShopCauchosMC/.git && \
git rm --cached -rf ShopCauchosMC && \
git add cauchosmc && \
git add ShopCauchosMC
git commit -m "2025"
git push -u origin main

git remote set-url origin https://github.com/usuario/repositorio2.git
git push -u origin main*/