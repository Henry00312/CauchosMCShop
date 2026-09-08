import {Router} from 'express'
import {createOrder, receiveWebhook, Tiempo_Pedido, Tiempo_Pick} from '../controllers/payment.controller.js'
import {logIn, verifyToken} from '../controllers/login.controller.js'
import { get_Pedidos, update_Pedido, delete_Pedido } from '../controllers/pedidos.controller.js'
import { get_PaymentsReady, get_PaymentsPending, update_PaymentReady, update_PaymentPending, delete_PaymentReady, delete_PaymentPending } 
from '../controllers/payment.controller.js'
import {get_Costos, post_Costo, update_Costo, delete_Costo} from '../controllers/costos.controller.js'
import { contactMessage } from '../controllers/contact.controller.js'

//import path from 'path'


const router = Router()


router.post('/api/payment', createOrder);

router.post('/api/time', Tiempo_Pedido);
router.get('/api/pickTime', Tiempo_Pick);

router.post('/api/login', logIn);

//Crear Funciones

router.get('/api/pedidosXH', verifyToken, get_Pedidos);
router.get('/api/pagosMTH', verifyToken, get_PaymentsReady);
router.get('/api/pendientesD', verifyToken, get_PaymentsPending);

router.put('/api/pedidosXH', verifyToken, update_Pedido);
router.put('/api/pagosMTH', verifyToken, update_PaymentReady);//Verificar unset
router.put('/api/pendientesD', verifyToken, update_PaymentPending);//Verificar unset

router.delete('/api/pedidosXH', verifyToken, delete_Pedido);
router.delete('/api/pagosMTH', verifyToken, delete_PaymentReady);
router.delete('/api/pendientesD', verifyToken, delete_PaymentPending);

router.get('/api/costosDX', verifyToken, get_Costos);
router.put('/api/costosDX', verifyToken, update_Costo);//Verificar unset
router.post('/api/costosDX', verifyToken, post_Costo);
router.delete('/api/costosDX', verifyToken, delete_Costo);


router.post('/api/webhook', receiveWebhook);

router.post('/api/contacto', contactMessage);


/*
router.get('/', (req, res) => {
  const indexPath = path.join(path.resolve('src/presentacion'),'vistas', 'inicio.html');
  res.sendFile(indexPath);
});

router.get('/success', (req, res) => {
  const indexPath = path.join(path.resolve('src/presentacion'),'vistas', 'success.html');
  res.sendFile(indexPath);
});

router.get('/failure', (req, res) => {
  const indexPath = path.join(path.resolve('src/presentacion'),'vistas', 'failure.html');
  res.sendFile(indexPath);
});

router.get('/pending', (req, res) => {
  const indexPath = path.join(path.resolve('src/presentacion'),'vistas', 'pending.html');
  res.sendFile(indexPath);
});

router.get('/contacto', (req, res) => {
  const indexPath = path.join(path.resolve('src/presentacion'),'vistas', 'contact.html');
  res.sendFile(indexPath);
});
*/

export default router
