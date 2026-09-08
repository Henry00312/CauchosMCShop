import Payment from './model-Payment.js';


export const getPayments = async () => {
    try {
        const payments = await Payment.find();
        return payments;

    } catch (error) {
        console.log(error);
        return;
    }

};

export const getPaymentsMounth = async () => {

    try {

        const paymentsMounths = [];

        const payments = await getPayments();

        const fechaActual = new Date();

        // Calcula la fecha del primer día del mes actual
        const primerDiaEsteMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

        // Calcula la fecha del último día del mes actual
        const ultimoDiaEsteMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

        ultimoDiaEsteMes.setHours(24, 0, 0, 0);

        paymentsMounths = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: primerDiaEsteMes,
                        $lte: ultimoDiaEsteMes
                    }
                }
            }
        ]);

        return paymentsMounths;

    } catch (error) {
        console.log(error);
        return;
    }

};

export const insertPayment = async (req) => {

    try {
        const newPayment = new Payment({
            id: req.id,
            ...req
        });

        await newPayment.save();
        console.log('Pago Registrado');
        return 'ok';

    } catch (error) {

        if (error.code === 11000 && error.keyPattern && error.keyPattern.id === 1) {
            console.error('Clave Repetida');
        }
        else{
            console.log(error);
        }
        return;
    }
};

export const deletePayment = async (req) => {
    try {
        //await Payment.findOneAndDelete({ id: req });
        await Payment.findByIdAndDelete({ _id: req });
        return 'ok';
    }
    catch (error) {
        console.log(error);
        return 'no';
    }
};

export const updatePayment = async (req) => {
    try {
        delete req.body._id;
        //await Payment.findOneAndUpdate({id: req.params.id}, {$set: req.body});//$unset: req.body.unset
        await Payment.findByIdAndUpdate({_id: req.query.id}, {$set: req.body}); 
        return 'ok';

    } catch (error) {
        console.log(error);
        return 'no';
    }
};
