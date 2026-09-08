import {getPendings, insertPending, deletePending, updatePending} from '../database/payments/wait-Payments.js'


export const InsertarPending = async (req) => {
    
    const pendind = await insertPending(req);

    return 'Pago Pendiente Registrado';

}

export const Pendings = async () => {
    const pendings = await getPendings();
    return pendings;
};


export const PendingDelete = async (req) =>{
    const deletepend = await deletePending(req);
    return deletepend;
    //'Pago Eliminado';
};

export const PendingUpdate = async (req) =>{
    const updatepend = await updatePending(req);
    return updatepend;
    //'Pago Actualizado';
};
