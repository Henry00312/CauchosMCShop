import { MercadoPagoConfig, Preference } from 'mercadopago';
import { HOST, MERCADOPAGO_ACCESS_TOKEN } from '../config.js';



export const crearOrder = async (req) => {

    const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

    const preference = new Preference(client);

    const idPreference = await preference.create({
        body: {
            items: req.productos,
            back_urls: {
                success: `${HOST}/success`,//`${HOST}/success`,
                failure: `${HOST}/failure`,//`${HOST}/failure`,
                pending: `${HOST}/pending`,//`${HOST}/pending`,
            },
            auto_return: 'approved',
            payer:{
                phone: {number: req.telefono},
                address: {street_name: req.direccion + " - " + req.ciudad},
                email: req.correo,
                identification: {number: req.nit},
                name: req.persona
            },
            notification_url: `${HOST}/api/webhook`,

        }
      });
    // El .catch(console.log) anterior se tragaba el fallo y dejaba idPreference
    // sin definir, de modo que el error real se convertia en un TypeError al
    // leer init_point. Ahora el error se propaga y lo traduce el controlador.
    //console.log(idPreference.init_point)
    //console.log(idPreference.sandbox_init_point)
    const data = {url : idPreference.init_point};
    return data;
}
