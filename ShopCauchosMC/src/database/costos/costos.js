import Costo from './model-costo.js';


export const getCostos = async () => {
    try {
        const costos = await Costo.find();
        return costos;

    } catch (error) {
        console.log(error);
        return;
    }

};

export const getCostosMounth = async () => {

    try {

        const costosMounths = [];

        const costos = await getCostos(); // ?

        const fechaActual = new Date();

        // Calcula la fecha del primer día del mes actual
        const primerDiaEsteMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

        // Calcula la fecha del último día del mes actual
        const ultimoDiaEsteMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

        ultimoDiaEsteMes.setHours(24, 0, 0, 0);

        costosMounths = await Costo.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: primerDiaEsteMes,
                        $lte: ultimoDiaEsteMes
                    }
                }
            }
        ]);

        return costosMounths;

    } catch (error) {
        console.log(error);
        return;
    }

};

export const insertCosto = async (req) => {

    try {
        const newCosto = new Costo(req);

        await newCosto.save();
        console.log('Costo Registrado');
        return 'ok';

    } catch (error) {

        if (error.code === 11000 && error.keyPattern && error.keyPattern.id === 1) {
            console.error('Clave Repetida');
        }
        else{
            console.log(error);
        }
        return 'no';
    }
};

export const deleteCosto = async (req) => {
    try {
        //await Costo.findOneAndDelete({ id: req });
        await Costo.findByIdAndDelete({ _id: req });
        return 'ok';
    }
    catch (error) {
        console.log(error);
        return 'no';
    }
};

export const updateCosto = async (req) => {
    try {
        delete req.body._id;
        //await Costo.findOneAndUpdate({id: req.query.id}, {$set: req.body}); //, $unset: req.body.unset , sirve para eliminar campos
        await Costo.findByIdAndUpdate({_id: req.query.id}, {$set: req.body}); 
        return 'ok';

    } catch (error) {
        console.log(error);
        return 'no';
    }
};
