import RabbitMQ from '../colas/conexionRabbit.js'


export function Order(id_solicitud) {
    var res = null;
    let band = false;

    for (let i = 0; i < RabbitMQ.getOrders().length; i++) {
        if (RabbitMQ.getOrders()[i].id_solicitud === id_solicitud) {
            band = true;
            res = RabbitMQ.getOrders()[i].contenido;
            // splice(i) eliminaba desde i hasta el final del array, descartando
            // las respuestas pendientes de otras solicitudes concurrentes.
            RabbitMQ.getOrders().splice(i, 1);
            break;
        }
    }
    //console.log("Resultado Order: ", res);
    return res;
    
}

export function UltimaDatePedid(id_solicitud) {
    var res = null;
    let band = false;

    for (let i = 0; i < RabbitMQ.getDate().length; i++) {
        if (RabbitMQ.getDate()[i].id_solicitud === id_solicitud) {
            band = true;
            res = RabbitMQ.getDate()[i].contenido;
            RabbitMQ.getDate().splice(i, 1);
            break;
        }
    }
    return res;
}

export function pickDateProg(id_solicitud) {
    var res = null;
    let band = false;

    for (let i = 0; i < RabbitMQ.getPick().length; i++) {
        if (RabbitMQ.getPick()[i].id_solicitud === id_solicitud) {
            band = true;
            res = RabbitMQ.getPick()[i].contenido;
            RabbitMQ.getPick().splice(i, 1);
            break;
        }
    }
    return res;
}
