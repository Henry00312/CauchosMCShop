/*import RabbitMQ from './conexionRabbit.js'
import { RegistrarPayment } from '../services/ready-payments.js'
import { InsertarPending } from '../services/pending-payments.js'
import { crearOrder } from '../services/create-order.js'
import { FechaUltPedido } from '../services/pedidos-gestion.js'

const channel = RabbitMQ.getChannel();

var resultadosOrders = [];
var resultadosUltimaDatePedido = [];




if (channel !== null) {

    try {
        channel.consume("Orders", async (message) => {

            console.log('Message Received ');
    
            const content = JSON.parse(message.content.toString());
    
            const preference = await crearOrder(content.contenidoRX);
    
            resultadosOrders.push({ contenido: preference, id_solicitud: content.id_solicitud });
    
            console.log('Message Received \n' + content);
    
            channel.ack(message)
        })
    
    
        channel.consume("UltimaFechaPedido", async (message) => {
    
            const content = JSON.parse(message.content.toString());
    
            const UltimaFechaPedido = await FechaUltPedido();
    
            resultadosUltimaDatePedido.push({ contenido: UltimaFechaPedido, id_solicitud: content.id_solicitud });
    
            console.log('Message Received \n' + content);
    
            channel.ack(message)
        })
    
    
    
        channel.consume("RegistrarPago", message => {
    
            const content = JSON.parse(message.content.toString());
    
    
            console.log('Message Received \n' + content);
    
            channel.ack(message)
        })
    
    
        channel.consume("RegistrarPending", message => {
    
            const content = JSON.parse(message.content.toString());
    
    
            console.log('Message Received \n' + content);
    
            channel.ack(message)
        })
    
    } catch (error) {
        console.log(error);
    }

}



export { resultadosOrders, resultadosUltimaDatePedido }

*/