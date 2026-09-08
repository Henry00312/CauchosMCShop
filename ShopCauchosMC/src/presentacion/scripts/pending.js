Tiempo();

function Tiempo() {
    const Mensaje = document.querySelector(".mensaje-pending");
    const Mostrar = document.querySelector(".tiempo");

    var pedidoexitoso = "";
    var parametros = {};
    // Obtener la parte de la URL que contiene los parámetros
    var queryString = window.location.search;
    // Eliminar el "?" inicial de la cadena
    queryString = queryString.substring(1);
    // Dividir la cadena en pares clave=valor
    var pares = queryString.split('&');

    if (pares.length > 1) {

        for (var i = 0; i < pares.length; i++) {
            var par = pares[i].split('=');
            var clave = decodeURIComponent(par[0]);
            var valor = decodeURIComponent(par[1]);
            if(clave === "payment_id" || clave === "collection_status" 
            || clave === "status" || clave === "merchant_order_id" || clave === "preference_id"){
                parametros[clave] = valor;
            }
        }



        var opciones = {
            method: 'POST',
            body: JSON.stringify(parametros)
        };


        const response = async () => {
            const respon = await fetch('http://localhost:3000/tiempo-pedido', opciones)
            const data = await respon.json()
            //console.log(data);
            return data;
        }

        pedidoexitoso =  "en 0 dias.";

    }
    else {
        pedidoexitoso = "en 0 dias.";
    }
    
    Mostrar.style.display = "block";
    Mensaje.textContent = `Mientras se realiza el pago el tiempo estimado en el que su pedido estará listo: ${pedidoexitoso}`;
}


