<template>
    <div class="body">
        <header class="header">
            <div class="header1">
                <a href="/" style="width: 15vh; height: 12vh;">
                    <img src="../assets/LOGO.png" class="LogoIMG" alt="Logo">
                </a>
                <div id="contacto">
                    <img src="../assets/CONTACTOS.png" class="ContactoIMG" alt="Contacto">
                </div>
            </div>
        </header>
        <section v-if="seePanel" style="padding-top: 13vh;">
            <div class="centrar">
                <div class="status">
                    <h1 :class="{ 'titulo': true, [color]: true }">{{ titulo }}</h1>
                    <p class="mensaje">{{ mensaje }}{{ Mssage }}</p>
                </div>
            </div>
        </section>
        <div v-if="seeLoader" id="loader"></div>
    </div>
</template>

<script>
export default {
    name: 'Messague',
    props: {
        titulo: {type: String, required: true},
        mensaje: {type: String, required: true},
        color: {type: String, required: true},
        action: {type: Boolean, required: true}
    },
    data() {
        return {
            seePanel: true,
            seeLoader: false,
            Mssage: '',
            apiURL: process.env.VUE_APP_API_URL,
        }
    },
    methods: {
        async LastTime(act) {
            if (act) {
                this.seePanel = false;
                this.seeLoader = true;

                var pedidoexitoso = "";
                //var parametros = {};
                var paymentID = false;
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
                        /*if (clave === "payment_id" || clave === "collection_status"
                            || clave === "status" || clave === "merchant_order_id" || clave === "preference_id") {
                            parametros[clave] = valor;
                        }*/
                       if (clave === "payment_id") {
                            paymentID = valor;
                            break;
                        }

                    }
                    var opciones = {
                        method: 'GET',
                        //body: JSON.stringify(parametros),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    if(paymentID){
                        //color === pending o success
                        const response = await fetch(`${this.apiURL}/api/pickTime?type=${this.color}&payment_id=${paymentID}`, opciones)
                        const data = await response.json()
                        
                        const fechaFinal = new Date(data);
                
                        // Formatear la fecha según tus necesidades
                        const options = {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            //timeZone: 'UTC', // Ajustar la zona horaria según sea necesario
                        };
                        const formatoFecha = new Intl.DateTimeFormat('es-ES', options);
                        // Obtener la cadena formateada
                        const fechaFinalFormateada = formatoFecha.format(fechaFinal);

                        pedidoexitoso = `el ${fechaFinalFormateada}.`;
                    }else{
                        pedidoexitoso = "en - dias.";
                    }
                    
                }
                else {
                    pedidoexitoso = "en - dias.";
                }
                this.seeLoader = false;
                this.seePanel = true;
                this.Mssage = pedidoexitoso;
            }

        }
    },
    mounted() {
        this.LastTime(this.action);
    },

};
</script>
<style scoped src="../views/estilos/pagos.css"></style>