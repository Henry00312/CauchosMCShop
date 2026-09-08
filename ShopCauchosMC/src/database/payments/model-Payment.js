import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
}, {timestamps: true, strict: false});

const Payment = model('Payments', paymentSchema);

export default Payment;