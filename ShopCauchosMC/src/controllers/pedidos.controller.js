import {Pedidos, PedidosFaltan, PedidoDelete, PedidoUpdate} from '../services/pedidos-gestion.js'

export const get_Pedidos = async (req, res) => {
    const pedidos = await Pedidos();
    res.send({ data: pedidos});
}

/*export const get_PedidosXH = async (req, res) => {
    const pedidos = await PedidosFaltan();
    res.send({ data: pedidos});
}*/


export const update_Pedido = async (req, res) => {
    const mess = await PedidoUpdate(req);
    res.send({ message: mess});
}

export const delete_Pedido = async (req, res) => {
    const mess = await PedidoDelete(req);
    res.send({ message: mess});
}

//Pedidos faltan?