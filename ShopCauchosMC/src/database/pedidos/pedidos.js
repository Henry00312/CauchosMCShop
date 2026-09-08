import Pedido from './model-pedido.js';

function formatLocalDateForInput(date) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const getPedidos = async () => {
    try {
        const pedidos = await Pedido.find();

        const listaDePedidos = [];
        let ini_Prod = '';
        let fin_Prod = '';
        let date_Create = '';
        let date_Update = '';
        const pad = n => n.toString().padStart(2, '0');

        pedidos.forEach(pedido => {

            /*ini_Prod = pedido.Date_Ini_Prodcc.toLocaleString();
            fin_Prod = pedido.Date_Fin_Prodcc.toLocaleString();
            date_Create = pedido.createdAt.toLocaleString();
            date_Update = pedido.updatedAt.toLocaleString();
            // Formato "año/mes/día minutos:seg"
            ini_Prod = `${ini_Prod.slice(0, 16).replace('T', ' ')}`;
            fin_Prod = `${fin_Prod.slice(0, 16).replace('T', ' ')}`;
            date_Create = `${date_Create.slice(0, 16).replace('T', ' ')}`;
            date_Update = `${date_Update.slice(0, 16).replace('T', ' ')}`;*/
           
            ini_Prod = formatLocalDateForInput(new Date(pedido.Date_Ini_Prodcc))
            fin_Prod = formatLocalDateForInput(new Date(pedido.Date_Fin_Prodcc))
            date_Create = formatLocalDateForInput(new Date(pedido.createdAt))
            date_Update = formatLocalDateForInput(new Date(pedido.updatedAt))

            listaDePedidos.push({
                _id: pedido._id,
                id_Payment: pedido.id_Payment,
                products: pedido.products,
                Date_Ini_Prodcc: ini_Prod,
                Date_Fin_Prodcc: fin_Prod,
                Client: pedido.Client,
                Correo: pedido.Correo,
                Tel: pedido.Tel,
                Direction: pedido.Direction,
                MountainTotal: pedido.MountainTotal,
                createdAt: date_Create,
                updatedAt: date_Update
            });
        });

        return listaDePedidos;
    } catch (error) {
        console.log(error);
        return;
    }

};

export const getUltmDatePedido = async () => {

    try {
        const ultimoDocumento = await Pedido.findOne().sort({ Date_Fin_Prodcc: -1 });

        var Regres = '';

        if (ultimoDocumento) {
            /*
            const timezoneOffsetMinutes = ultimoDocumento.Date_Fin_Prodcc.getTimezoneOffset();
            // Ajustar la fecha a la zona horaria local
            const fechaLocal = new Date(ultimoDocumento.Date_Fin_Prodcc);
            fechaLocal.setMinutes(fechaLocal.getMinutes() - timezoneOffsetMinutes)
            return fechaLocal;
            */
           const actDate = new Date();

            Regres = (actDate > ultimoDocumento.Date_Fin_Prodcc) ? actDate : ultimoDocumento.Date_Fin_Prodcc;

        } else {
            Regres = new Date();
        }
        //console.log(Regres)
        return Regres;
    } catch (error) {
        console.log(error);
        return;
    }

};

export const insertPedido = async (req) => {

    try {
        /*
        let productsz = [];
        req.products.forEach((product) => {
            productsz.push({
                product_id: product.product_id,
                product_Name: product.product_Name,
                units: product.units,
            });
        }); */
        
        const newPedido = new Pedido({
            id_Payment: req.id_Payment,
            products: req.products,
            Date_Ini_Prodcc: new Date(req.Date_Ini_Prodcc),
            Date_Fin_Prodcc: new Date(req.Date_Fin_Prodcc),
            Client: req.Client,
            Correo: req.Correo,
            Tel: req.Tel,
            Direction: req.Direction,
            MountainTotal: req.MountainTotal
        });

        await newPedido.save();

        console.log('Pedido Registrado');

        return 'ok';
    }
    catch (error) {
        console.log(error);
        return;
    }

};

export const updatePedido = async (req) => {
    /*const { id_Payment, product_id, product_Name, time_Unit, units, Date_Ini_Prodcc, Date_Fin_Prodcc,
        Client, nit_Client, Correo, Tel, Direction, MountainTotal } = req.body; */
    
    try {
        delete req.body._id;
        //await Pedido.findOneAndUpdate({ _id: req.params.id }, {$set: req.body})
            /*
            {
            id_Payment: req.body.id_Payment,
            products: req.body.products,
            Date_Ini_Prodcc: new Date(req.body.Date_Ini_Prodcc),
            Date_Fin_Prodcc: new Date(req.body.Date_Fin_Prodcc),
            Client: req.body.Client,
            Correo: req.body.Correo,
            Tel: req.body.Tel,
            Direction: req.body.Direction,
            MountainTotal: req.body.MountainTotal
        });*/
        await Pedido.findByIdAndUpdate({_id: req.query.id}, {$set: req.body}); 
        return 'ok';
    } catch (error) {
        console.log(error);
        return 'no';
    }


};

export const deletePedido = async (req) => {
    try {
        //await Pedido.findOneAndDelete({ _id: req });
        await Pedido.findByIdAndDelete({ _id: req });
        return 'ok';
    }
    catch (error) {
        console.log(error);
        return 'no';
    }

};

export const PedidosXHacer = async () => {

    try {
        const pedidos = await Pedido.find();

        const fechaActual = new Date();

        // Filtra los usuarios cuya fecha futura asignada sea mayor a la fecha actual
        var listaXhacer = pedidos.filter(pedido => {
            return pedido.Date_Fin_Prodcc > fechaActual;
        });

        return listaXhacer;

        /*
        if (listaXhacer.length > 0) {
            /* Para los que son menores o iguales a la fech actual "Cambiar el > por <="
            listaEliminar.forEach(pedido => {
                Pedido.findByIdAndDelete(pedido._id);
            }); 

            return listaXhacer;

        }
        else { return 'No Hay Pedidos Que Despachar'; } */
    } catch (error) {
        console.log(error);
        return;
    }

};

export const findPedido = async (id_Payment) => {
    try {
        const pedidoE = await Pedido.findOne({ id_Payment});
        return pedidoE?.Date_Fin_Prodcc;
    }
    catch (error) {
        console.log(error);
        return 'no';
    }
}