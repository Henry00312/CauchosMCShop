import amqp from 'amqplib';
import { MQURI } from '../config.js';
import { crearOrder } from '../services/create-order.js'
import { FechaUltPedido, pickFecha } from '../services/pedidos-gestion.js'
import {RegistrarPayment} from '../services/ready-payments.js'
import {InsertarPending, PendingDelete} from '../services/pending-payments.js'

//"Singleton" => No repetir conexiones
class RabbitMQ{

    constructor() {
        this.connection = null;
        this.channel = null;
        this.resultadosOrders = [];
        this.resultadosUltimaDatePedido = [];
        this.pickDate = [];
    }

    async connect(){
        
        if(!this.connection){
            this.connection = await amqp.connect(MQURI);
            this.channel = await this.connection.createChannel();

            
            await this.channel.assertQueue("Orders", {durable: true });
            await this.channel.assertQueue("UltimaFechaPedido", {durable: true });
            await this.channel.assertQueue("RegistrarPago", {durable: true });
            await this.channel.assertQueue("RegistrarPending", {durable: true });
            await this.channel.assertQueue("CancelarPending", {durable: true });
            await this.channel.assertQueue("FechaFin", {durable: true });
            console.log('Conexión Exitosa a RabbitMQ');

            try {
                this.channel.consume("Orders", async (message) => {       
                    const content = JSON.parse(message.content.toString());          
                    const preference = await crearOrder(content.contenidoRX);    
                    this.resultadosOrders.push({ contenido: preference, id_solicitud: content.id_solicitud });
                    console.log('Message Received');          
                    this.channel.ack(message)
                })
                this.channel.consume("UltimaFechaPedido", async (message) => {            
                    const content = JSON.parse(message.content.toString());           
                    const {FechaIniProd, FechaFinProd, ProductoXPedido} = await FechaUltPedido(content.contenidoRX);     
                    this.resultadosUltimaDatePedido.push({ contenido: FechaFinProd, id_solicitud: content.id_solicitud });            
                    console.log('Message Received');            
                    this.channel.ack(message)
                })
                this.channel.consume("FechaFin", async (message) => {            
                    const content = JSON.parse(message.content.toString());           
                    const fechaProgramada = await pickFecha(content.contenidoRX);     
                    this.pickDate.push({ contenido: fechaProgramada, id_solicitud: content.id_solicitud });            
                    console.log('Message Received');            
                    this.channel.ack(message)
                })
                this.channel.consume("RegistrarPago", async (message) => {
                    const content = JSON.parse(message.content.toString());
                    await RegistrarPayment(content);
                    console.log('Message Received');         
                    this.channel.ack(message)
                }) 
                this.channel.consume("RegistrarPending", async (message) => {
                    const content = JSON.parse(message.content.toString());  
                    await InsertarPending(content);
                    console.log('Message Received');            
                    this.channel.ack(message)
                })
                this.channel.consume("CancelarPending", async (message) => {
                    const content = JSON.parse(message.content.toString());  
                    await PendingDelete(content);
                    console.log('Message Received');            
                    this.channel.ack(message)
                })
            
            } catch (error) {
                console.log(error);
            }
            
        }
        else{
            console.log('Ya Hay Conexión');
        }
    }

    getChannel() {
        return this.channel;
    }

    getOrders() {
        return this.resultadosOrders;
    }

    getDate(){
        return this.resultadosUltimaDatePedido;
    }

    getPick(){
        return this.pickDate;
    }

}

export default new RabbitMQ();