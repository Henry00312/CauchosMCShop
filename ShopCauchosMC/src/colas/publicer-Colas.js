import RabbitMQ from './conexionRabbit.js'


export async function publisher(nameQueue, message) {
    /*const message = {id: 516161, text: 'heloo'}*/
    const channel = RabbitMQ.getChannel();
    const sent = await channel.sendToQueue(nameQueue, Buffer.from(
        JSON.stringify(message)
    ), {
        persistent: true
    })


    sent ? console.log('Message Sent') : console.log('Fails Sending Message')
}
