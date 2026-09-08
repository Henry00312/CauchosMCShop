import Pending from './model-waitPayment.js';

export const getPendings = async () => {
    try {
        const pendings = await Pending.find();
        return pendings;

    } catch (error) {
        console.log(error);
        return;
    }

};

export const insertPending = async (req) => {

    try {
        const newPending = new Pending({
            id: req.id,
            ...req
        });

        await newPending.save();

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

export const deletePending = async (req) => {
    try {
        /*const elimino = await Pending.findOneAndDelete({id: req});

        if(!elimino){
            console.log('No existia')
        }*/
        //await Pending.findByIdAndDelete({ id: req });
        const resultado = await Pending.deleteOne({ id: req});
        return 'ok';
    }
    catch (error) {
        console.log(error);
        return 'no';
    }
};

export const updatePending = async (req) => {
    try {
        delete req.body._id;
        //await Pending.findOneAndUpdate({id: req.params.id}, {$set: req.body}); //$unset: req.body.unset
        await Pending.findByIdAndUpdate({_id: req.query.id}, {$set: req.body}); 
        return 'ok';

    } catch (error) {
        console.log(error);
        return 'no';
    }
};
