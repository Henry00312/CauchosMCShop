import { getPayments, getPaymentsMounth, insertPayment, deletePayment, updatePayment } from
    '../database/payments/ready-Payments.js'
import { deletePending } from '../database/payments/wait-Payments.js'
import { RegistrarPedido } from './pedidos-gestion.js'


export const RegistrarPayment = async (req) => {

    console.log('En Proceso');
    const paymentHecho = await insertPayment(req);

    const delependg = await deletePending(req.id);

    const pedido = await RegistrarPedido(req);

    return 'Pago Registrado';
}

export const Payments = async () => {
    const payments = await getPayments();
    return payments;
};

export const PaymentsMounth = async () => {

    const paymentsMounth = await getPaymentsMounth();
    return paymentsMounth;
};

export const PaymentDelete = async (req) => {

    const delepayment = await deletePayment(req.query.id);
    return delepayment;
    //'Pago Eliminado';
};

export const PaymentUpdate = async (req) => {

    const updtpayment = await updatePayment(req);
    return updtpayment;
    //'Pago Actualizado';
};

