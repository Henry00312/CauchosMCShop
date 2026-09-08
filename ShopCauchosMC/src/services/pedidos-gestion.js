import { getPedidos, insertPedido, deletePedido, updatePedido, getUltmDatePedido, PedidosXHacer, findPedido } from
    "../database/pedidos/pedidos.js";
import Productos from '../products.js'



//insertPedido(req.body);
//updatePedido(req);
//deletePedido(req.query.id)
//const pedido = await getPedidos(); return pedido;
//const UltimaFecha = await getUltmDatePedido(); return UltimaFecha;
// const PedidosxHa = await PedidosXHacer(); return PedidosxHa

export const Pedidos = async () => {

    const pedidos = await getPedidos();
    return pedidos;

}

export const RegistrarPedido = async (req) => {
    
    const {FechaIniProd, FechaFinProd, ProductoXPedido} = await FechaUltPedido(req.additional_info.items);

    //
    const client = req.additional_info.payer.first_name;
    const correo = req.payer.email;
    const tel = req.additional_info.payer.phone.number;
    const direction = req.additional_info.payer.address.street_name;
    const totalMontoPagado = req.transaction_details.total_paid_amount;

    //
    const pedido_doc = {
        id_Payment: req.id,
        products: ProductoXPedido,
        Date_Ini_Prodcc: FechaIniProd,
        Date_Fin_Prodcc: FechaFinProd,
        Client: client,
        Correo: correo,
        Tel: tel,
        Direction: direction,
        MountainTotal: totalMontoPagado
    };


    await insertPedido(pedido_doc);

    return 'Pedido Registrado';

}

export const FechaUltPedido = async (req) => {

    const FechaInicial = await getUltmDatePedido();

    /*FechaIniProd = await FechaIniProd.text();
    
    if(FechaIniProd.length > 0){
        FechaIniProd = FechaIniProd.slice(1, -6) + "Z";
        FechaIniProd = new Date(FechaIniProd);
    }*/

    var ProductoXPedido = [];
    var TiempoTotal = 0;

    req.forEach((producto) => {

        TiempoTotal += Productos[producto.id - 1].time * producto.quantity;
        ProductoXPedido.push({
            product_id: producto.id,
            product_Name: producto.title,
            units: producto.quantity,
            price: producto.unit_price
        });

    });

    //const FechaFinProd = new Date(FechaIniProd.getTime() + (TiempoTotal * 60 * 1000));

    function jornada(dateIni, Restante){
        let FechaFin = "";
        let FechaIni = dateIni;
        let timeRestant = Restante;

        const dia = FechaIni.getDay(); // 0 = domingo, 6 = sábado
        const hora = FechaIni.getHours();

        const esLaboral = dia >= 1 && dia <= 5 && hora >= 7 && hora <= 17;

        if(!esLaboral){
            // Mueve al próximo día laboral a las 7:00 a. m.
            do {
                FechaIni.setDate(FechaIni.getDate() + 1);
            } while (FechaIni.getDay() === 0 || FechaIni.getDay() === 6);
            FechaIni.setHours(7, 0, 0, 0);
        }
            
        // Calcula cuántos milisegundos quedan hoy dentro del horario laboral
        const finJornada = new Date(FechaIni);
        finJornada.setHours(17, 0, 0, 0);
        const disponibleHoy = finJornada - FechaIni;

        if (timeRestant <= disponibleHoy) {
            FechaFin = new Date(FechaIni.getTime() + timeRestant);
        }else{
            timeRestant -= disponibleHoy;
            // Avanza al próximo día laboral a las 7:00 a. m.
            let fecha = new Date(FechaIni);
            do {
                fecha.setDate(fecha.getDate() + 1);
            } while (fecha.getDay() === 0 || fecha.getDay() === 6);
            fecha.setHours(7, 0, 0, 0);
            let {FechaIni: ini, FechaFin: fechafin} = jornada(fecha, timeRestant)
            FechaFin = fechafin;
        }

        return {FechaIni, FechaFin}
        
    }

    const offsetColombia = -5 * 60; // en minutos
    const offsetUTC = 5 * 60;

    const fechaColombia = new Date(FechaInicial.getTime() + offsetColombia * 60 * 1000);

    const {FechaIni, FechaFin} = jornada(fechaColombia, TiempoTotal * 60 * 1000)

    const FechaIniProd = new Date(FechaIni.getTime() + offsetUTC * 60 * 1000);
    const FechaFinProd = new Date(FechaFin.getTime() + offsetUTC * 60 * 1000);


    return {FechaIniProd, FechaFinProd, ProductoXPedido};
};

export const pickFecha = async (req) => {
    let fecha = "";
    if(req.type === "success"){
        fecha = await findPedido(req.payment_id);
    }else if(req.type === "pending"){
        const {FechaIniProd, FechaFinProd, ProductoXPedido} = await FechaUltPedido([]);
        fecha = FechaFinProd;
    }
    return fecha;
}

export const PedidosFaltan = async () => {

    const PedidosxHa = await PedidosXHacer();
    return PedidosxHa
};

export const PedidoDelete = async (req) => {

    return await deletePedido(req.query.id);
    //'Pedido Eliminado';
};

export const PedidoUpdate = async (req) => {
    return await updatePedido(req);
    //'Pago Actualizado';
};





export const RegisterOrder = async (req) => {

    const ProductByOrder = [];
    var TotalTime = 0;
    const totalProducts = req.additional_info.items;
    totalProducts.forEach((producto) => {

        TotalTime = TotalTime + (Products[product.id - 1].time * product.quantity);
        ProductByOrder.push({
            product_id: product.id,
            product_Name: product.title,
            units: product.quantity,
        });

    });

    const client = req.additional_info.payer.first_name;
    const email = req.payer.email;
    const tel = req.additional_info.payer.phone.number;
    const address = req.additional_info.payer.address.street_name;
    const totalPayment = req.transaction_details.total_paid_amount;
    const AvailabilityStartDate = req.iniDate;

    var AvailabilityEndDate = new Date(AvailabilityStartDate + (TiempoTotal * 60 * 1000));

    const order_doc = {
        id_Payment: req.id,
        products: ProductByOrder,
        Date_Init_Prodcc: AvailabilityStartDate,
        Date_Fin_Prodcc: AvailabilityEndDate,
        Client: client,
        Email: email,
        Tel: tel,
        Address: address,
        TotalPayment: totalPayment
    };
    await insertOrder(order_doc);
    return 'Order registered!';
}
