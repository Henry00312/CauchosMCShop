import { mapActions, mapState } from "vuex";
import router from '@/router';
export default {
    name: 'Manage',
    components: {},
    data() {
        return {
            Panels: { tituloEncab: 'SISTEMA DE INFORMACION', advMess: '', portal: null, seeEncabPed: false, seeEncabPag: false, seeEncabPen: false, seeEncabCost: false },
            seeWindow: { seeLoader: false, seeFondo: false, seePedido: false, seePago: false, seeCosto: false },
            Pedidos: [],
            Pagos: [],
            Pendientes: [],
            Costos: [],
            //auxProcessP: {_id: 0, additional_info: {payer: {first_name: "", phone: {number: 0}, address: {street_name: ""}}, items: []}, payer: {email: ""}, 
            //transaction_details: {total_paid_amount: 0}, payment_method: {type: ""}, }, 
            auxProcess: {}, //Estandarizar en base a costos
            VauxProcess: {},
            auxProcessProduct: {},
            Tipo: 0,
            btnActuaz: false,
            btnCreate: false,
            btnPedidosXH: false,
            apiURL: process.env.VUE_APP_API_URL,
        }
    },
    computed: {
        ...mapState(['token']),
        dateToken() {
            return (this.token === null || this.token === '') ? false : true;
        },
        pedidosFiltred() {
            if (this.btnPedidosXH) {
                let fechaAct = new Date();
                const result = this.Pedidos.filter(pedido => {
                    let ultP = new Date(pedido.Date_Fin_Prodcc+'z')
                    return ultP > fechaAct
                })
                return result
            }
            return this.Pedidos;
        },

    },
    methods: {
        ...mapActions(['logOut']),
        async directLogOut() {
            await this.logOut();          // borra token del store y localStorage
            router.push('/login'); // redirige desde el componente
        },
        //ops
        async extractData(url) {
            this.seeWindow.seeLoader = true;
            try {
                if (this.dateToken) {// Verificar Token y enviarlo al backend
                    const options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': this.token } }
                    const response = await fetch(`${this.apiURL}/api/${url}`, options);
                    const result = await response.json();
                    //console.log(result)
                    this.Panels.advMess = (result.data?.length == 0) ? "NO HAY REGISTRO AÚN" : '';
                    this.seeWindow.seeLoader = false;
                    //Array Independiente = JSON.parse(JSON.stringify(data))
                    //console.log(result.data)
                    return result.data.reverse();
                }

            } catch (error) {
                console.log(error)
            }
        },
        //dom
        async togglePanels(imm) {

            this.Panels.seeEncabPag = false;
            this.Panels.seeEncabPed = false;
            this.Panels.seeEncabPen = false;
            this.Panels.seeEncabCost = false;
            if (imm === this.Panels.portal) {
                this.Panels.portal = null;
                this.Panels.tituloEncab = 'SISTEMA DE INFORMACION';
            } else {
                this.Panels.portal = imm;

                if (imm === 'pedidos') {
                    this.Panels.tituloEncab = 'Pedidos Sin Despachar';
                    this.Panels.seeEncabPed = true;
                    (this.Pedidos?.length == 0) ? this.Pedidos = await this.extractData('pedidosXH') : this.Panels.advMess = '';
                    //this.Pedidos = this.Pedidos.reverse()

                } else if (imm === 'pagos') {
                    this.Panels.tituloEncab = 'Pagos Del Mes';
                    this.Panels.seeEncabPag = true;
                    (this.Pagos?.length == 0) ? this.Pagos = await this.extractData('pagosMTH') : this.Panels.advMess = '';
                    //reverse
                    //this.Pagos = this.Pagos.reverse()
                } else if (imm === 'pendientes') {
                    this.Panels.tituloEncab = 'Pagos Pendientes';
                    this.Panels.seeEncabPen = true;
                    (this.Pendientes?.length == 0) ? this.Pendientes = await this.extractData('pendientesD') : this.Panels.advMess = '';
                    //reverse
                    //this.Pendientes = this.Pendientes.reverse()
                } else {
                    this.Panels.tituloEncab = 'Costos Empresa';
                    this.Panels.seeEncabCost = true;
                    (this.Costos?.length == 0) ? this.Costos = await this.extractData('costosDX') : this.Panels.advMess = '';
                    //reverse
                    //this.Costos = this.Costos.reverse()
                }
            }
        },
        findTotal(registros) {
            let total = 0;
            if (registros?.length > 0) {
                if (this.Panels.seeEncabPed || this.Panels.seeEncabCost) {
                    registros.forEach((regist => {
                        total += regist.MountainTotal;
                    }));
                } else {
                    registros.forEach((regist => {
                        total += regist.transaction_details.total_paid_amount;
                    }));

                }
            }
            return total;
        },
        InfoProcess(processed, tipe) {
            this.auxProcess = JSON.parse(JSON.stringify(processed)); //{...processed}
            if (tipe === 0) {
                this.seeWindow.seeFondo = false;
                this.seeWindow.seePedido = false;
                this.seeWindow.seePago = false;
                this.seeWindow.seeCosto = false;
                this.btnActuaz = false;
                this.btnCreate = false;
            } else {
                this.seeWindow.seeFondo = true;
                this.Tipo = tipe;
                (tipe === 1) ? this.seeWindow.seePedido = true : (tipe === 2 || tipe === 3) ? this.seeWindow.seePago = true :
                    (tipe === 4) ? this.seeWindow.seeCosto = true : '';
            }

        },
        CrearProcess() {
            this.seeWindow.seeFondo = true;
            this.seeWindow.seeCosto = true;
            this.btnActuaz = true;
            this.btnCreate = true;
            this.auxProcess = { _id: 0, name: '', email: '', number: '', direction: '', MountainTotal: 0, payment_method: '', products: [] };
            this.auxProcessProduct = { product_Name: '', units: 0, price: 0 };
        },
        EditarProcess() {
            this.VauxProcess = JSON.parse(JSON.stringify(this.auxProcess));
            this.btnActuaz = true;
        },
        async OKProcess() {
            this.seeWindow.seeLoader = true;
            var url = (this.Tipo === 1) ? `pedidosXH?id=${this.auxProcess._id}` : (this.Tipo === 2) ? `pagosMTH?id=${this.auxProcess._id}` :
                (this.Tipo === 3) ? `pendientesD?id=${this.auxProcess._id}` : `costosDX?id=${this.auxProcess._id}`;

            var opera = 'PUT'
            if (this.btnCreate) {
                opera = 'POST';
                url = 'costosDX';
                delete this.auxProcess._id;
            }

            const opciones = {
                method: opera,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': this.token
                },
                body: JSON.stringify(this.auxProcess)
            }
            /*const sett = [];
            const unsetData = {};
            for (const key in Data) {
                unsetData[key] = 1;
            }
            sett.push({ data: Data });
            sett.push({ unset: unsetData }); Sirve para eliminar campos*/
            try {
                const resp = await fetch(`${this.apiURL}/api/${url}`, opciones)
                const result = await resp.json();
                if (result.message == 'ok' && this.btnCreate === false) {
                    if (this.Tipo === 1) {
                        const indice = this.Pedidos.findIndex(pedido => pedido.id_Payment === this.auxProcess.id_Payment)
                        this.Pedidos[indice] = JSON.parse(JSON.stringify(this.auxProcess));
                    } else if (this.Tipo === 2) {
                        const indice = this.Pagos.findIndex(pago => pago._id === this.auxProcess._id)
                        this.Pagos[indice] = JSON.parse(JSON.stringify(this.auxProcess));
                    } else if (this.Tipo === 3) {
                        const indice = this.Pendientes.findIndex(pendiente => pendiente._id === this.auxProcess._id)
                        this.Pendientes[indice] = JSON.parse(JSON.stringify(this.auxProcess));
                    } else {
                        const indice = this.Costos.findIndex(costo => costo._id === this.auxProcess._id)
                        this.Costos[indice] = JSON.parse(JSON.stringify(this.auxProcess));
                    }
                    alert('Se Guardo el Cambio Exitosamente.')
                } else if (this.btnCreate && result.message == 'ok') {
                    this.Costos = await this.extractData('costosDX');

                    this.seeWindow.seeCosto = false;
                    this.seeWindow.seeFondo = false;
                    this.auxProcess = {};
                    alert('Se Guardo el Cambio Exitosamente.')
                } else {
                    alert(`Parece que Sucedio un Error: ${result.message}`)
                    //this.auxProcess = JSON.parse(JSON.stringify(this.VauxProcess));
                }
                this.auxProcessProduct = { product_Name: "", units: 0, price: 0 };
                this.VauxProcess = {};
                this.btnActuaz = false;
                this.btnCreate = false;
            } catch (error) {
                alert(`Parece que Sucedio un Error: ${error}`)
                console.error(error)
            }

            this.seeWindow.seeLoader = false;
        },
        async EliminarProcess(id) {
            this.seeWindow.seeLoader = true;
            const url = (this.Tipo === 1) ? `pedidosXH?id=${this.auxProcess._id}` : (this.Tipo === 2) ? `pagosMTH?id=${this.auxProcess._id}` :
                (this.Tipo === 3) ? `pendientesD?id=${this.auxProcess.id}` : `costosDX?id=${this.auxProcess._id}`;
            const opciones = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'authorization': this.token }
            }
            try {
                const resp = await fetch(`${this.apiURL}/api/${url}`, opciones)
                const result = await resp.json();

                if (result.message == 'ok') {
                    if (this.Tipo === 1) {
                        this.Pedidos = this.Pedidos.filter(objeto => objeto.id_Payment !== id)
                    } else if (this.Tipo === 2) {
                        this.Pagos = this.Pagos.filter(objeto => objeto._id !== id)
                    } else if (this.Tipo === 3) {
                        this.Pendientes = this.Pendientes.filter(objeto => objeto._id !== id)
                    } else {
                        this.Costos = this.Costos.filter(objeto => objeto._id !== id);
                    }
                    
                    /*
                    (this.Tipo === 1) ? this.Pedidos = this.Pedidos.filter(objeto => objeto.id_Payment !== id) :
                    (this.Tipo === 2) ? this.Pagos = this.Pagos.filter(objeto => objeto.id !== id) :
                    (this.Tipo === 3) ? this.Pendientes = this.Pendientes.filter(objeto => objeto.id !== id) :
                    this.Costos = this.Costos.filter(objeto => objeto.id !== id);*/
                    alert('Se Elimino el Registro Exitosamente.')
                    this.InfoProcess({}, 0);

                } else {
                    alert(`Parece que Sucedio un Error: ${result}`)
                }
                
                
            } catch (error) {
                alert(`Parece que Sucedio un Error: ${error}`)
                console.error(error)
            }
            this.seeWindow.seeLoader = false;
        },
        CancelProcess() {
            this.auxProcess = JSON.parse(JSON.stringify(this.VauxProcess));
            this.VauxProcess = {};
            this.auxProcessProduct = { product_Name: "", units: 0, price: 0 };
            this.btnActuaz = false;
        },
        RestarProduct(product) {
            if (this.seeWindow.seePago) {
                product.quantity = Number(product.quantity) - 1;
                this.auxProcess.transaction_details.total_paid_amount = Number(this.auxProcess.transaction_details.total_paid_amount) - Number(product.unit_price);
                (Number(product.quantity) == 0) ? this.auxProcess.additional_info.items = this.auxProcess.additional_info.items.filter(productt => productt.id != product.id) : '';
            } else {
                product.units = Number(product.units) - 1;
                this.auxProcess.MountainTotal = Number(this.auxProcess.MountainTotal) - Number(product.price);
                (Number(product.units) == 0) ? this.auxProcess.products = this.auxProcess.products.filter(productt => productt._id != product._id) : '';
            }
        },
        SumarProduct(product) {
            if (this.seeWindow.seePago) {
                product.quantity = Number(product.quantity) + 1;
                this.auxProcess.transaction_details.total_paid_amount = Number(this.auxProcess.transaction_details.total_paid_amount) + Number(product.unit_price);
            } else {
                product.units = Number(product.units) + 1;
                this.auxProcess.MountainTotal = Number(this.auxProcess.MountainTotal) + Number(product.price);
            }

        },
        addProduct() {
            if (this.seeWindow.seePago) {
                if (this.auxProcessProduct.unit_price > 0 && this.auxProcessProduct.quantity > 0 && this.auxProcessProduct.title) {
                    this.auxProcess.additional_info.items.push(JSON.parse(JSON.stringify(this.auxProcessProduct)))// Validar
                    this.auxProcess.transaction_details.total_paid_amount = Number(this.auxProcess.transaction_details.total_paid_amount) + (this.auxProcessProduct.unit_price * this.auxProcessProduct.quantity);
                } else {
                    alert('Debes Llenar Todos Los Campos para Poder Ingresar Un Producto.')
                }

            } else {
                if (this.auxProcessProduct.price > 0 && this.auxProcessProduct.units > 0 && this.auxProcessProduct.product_Name) {
                    this.auxProcess.products.push(JSON.parse(JSON.stringify(this.auxProcessProduct))); // Validar
                    this.auxProcess.MountainTotal = Number(this.auxProcess.MountainTotal) + (this.auxProcessProduct.price * this.auxProcessProduct.units);
                } else {
                    alert('Debes Llenar Todos Los Campos para Poder Ingresar Un Producto.')
                }
            }

        },
        //functions
        //Formatiar Fechas
        formatiarDatesIn(fecha, imm) {
            const fechaFM = new Date(fecha);
            var zoneHoraria = '';
            (imm === 'std') ? zoneHoraria = 'UTC' : zoneHoraria = 'America/Bogota';
            // Formatear la fecha según tus necesidades
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: zoneHoraria, // Ajustar la zona horaria según sea necesario
            };
            const formatoFecha = new Intl.DateTimeFormat('es-ES', options);

            // Obtener la cadena formateada
            const fechaFinalFormateada = formatoFecha.format(fechaFM);
            return fechaFinalFormateada;
        },
        formatiarDateOut(fecha) {
            // Dividir la cadena en fecha y hora
            var partes = fecha.split(', ');
            // Obtener la parte de la fecha y dividirla en día, mes y año
            var fechaPartes = partes[0].split('/');
            var dia = parseInt(fechaPartes[0], 10);
            var mes = parseInt(fechaPartes[1], 10) - 1; // Meses en JavaScript son indexados desde 0
            var año = parseInt(fechaPartes[2], 10);

            // Obtener la parte de la hora y dividirla en horas y minutos
            var horaPartes = partes[1].split(':');
            var horas = parseInt(horaPartes[0], 10);
            var minutos = parseInt(horaPartes[1], 10);

            // Crear un nuevo objeto Date con los valores obtenidos
            var fechaFinal = new Date(año, mes, dia, horas, minutos);
            return fechaFinal;
        },
    },
    mounted() { },
    created() {
        //this.fetchTasks();
    },

};