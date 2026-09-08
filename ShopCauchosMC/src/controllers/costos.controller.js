
import {getCostos, getCostosMounth, insertCosto, deleteCosto, updateCosto} from '../database/costos/costos.js'

export const get_Costos = async (req, res) => {
    const costos = await getCostos();
    res.send({ data: costos});
}

export const post_Costo = async (req, res) => {
    const mess = await insertCosto(req.body);
    res.send({ message: mess});
}

export const update_Costo = async (req, res) => {
    const mess = await updateCosto(req);
    res.send({ message: mess});
}

export const delete_Costo = async (req, res) => {
    const mess = await deleteCosto(req.query.id);
    res.send({ message: mess});
}