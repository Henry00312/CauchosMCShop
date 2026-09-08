import { Schema, model } from "mongoose";

const pendingSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
}, {timestamps: true, strict: false});

const Pending = model('Pendings', pendingSchema);

export default Pending;