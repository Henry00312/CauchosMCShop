import { Schema, model } from "mongoose";

const costoSchema = new Schema({
    products: [{
        product_id: Number,
        product_Name: String,
        units:  Number,
        price: Number,
    }],
    name: String,
    email: String,
    number: Number,
    direction: String,
    payment_method: String,
    MountainTotal: Number,
    
}, {timestamps: true});

const Costo = model('Costos', costoSchema);

export default Costo;