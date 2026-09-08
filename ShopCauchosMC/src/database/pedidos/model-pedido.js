import { Schema, model } from "mongoose";

const pedidoSchema = new Schema({
    id_Payment: {
        type: Number,
        unique: true,
        required: true,
    },
    products: [{
        product_id: Number,
        product_Name: String,
        units:  Number,
        price: Number
    }],
    Date_Ini_Prodcc: Date,
    Date_Fin_Prodcc: Date,
    Client: String,
    Correo: String,
    Tel: Number,
    Direction: String,
    MountainTotal: Number,
    
}, {timestamps: true});

const Pedido = model('Pedidos', pedidoSchema);

export default Pedido;