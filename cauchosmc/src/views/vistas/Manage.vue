<template>
    <body class="body"><!--Verificar Token-->
        <section class="panel">
            <div style="display: flex; justify-content: center; align-items: center;padding: 25px;">
                <img class="logo" src="LOGO.png">
            </div>
            <div class="Orportales">
                <h2 :class="{ 'portales': true, 'portal-clickeado': Panels.portal === 'pedidos' }" id="pedidos"
                    @click="togglePanels('pedidos')">Pedidos</h2>
                <h2 :class="{ 'portales': true, 'portal-clickeado': Panels.portal === 'pagos' }" id="pagos"
                    @click="togglePanels('pagos')">Pagos</h2>
                <h2 :class="{ 'portales': true, 'portal-clickeado': Panels.portal === 'pendientes' }" id="pagospendientes" 
                    @click="togglePanels('pendientes')">Pagos Pendientes</h2>
                <h2 :class="{ 'portales': true, 'portal-clickeado': Panels.portal === 'costos' }" id="costos"
                    @click="togglePanels('costos')">Costos</h2>
                <button class="btnsFordmsGG" style="background-color: black; color: brown; padding: 5px 30px;" @click="directLogOut()">Salir</button>
            </div>
        </section>

        <section class="contenido">

            <div class="btonActualizar">🎨</div>
            
            <button v-if="Panels.seeEncabCost" class="add-button" @click="CrearProcess()">+</button>
            <button v-if="Panels.seeEncabPed" class="add-button" @click="btnPedidosXH = !btnPedidosXH">🧭</button>

            <h1 class="titulo">{{ Panels.tituloEncab }}</h1>
            <div style="width: 100%; display: flex; justify-content: center;">
                <div v-if="Panels.seeEncabPed" class="encabezado">
                    <h3 class="titulo-encabezado" style="width:16.66%">ID PAYMENT</h3>
                    <h3 class="titulo-encabezado" style="width:16.66%">CLIENTE</h3>
                    <h3 class="titulo-encabezado" style="width:16.66%">FECHA DE INICIO</h3>
                    <h3 class="titulo-encabezado" style="width:16.66%">FECHA ACORDADA</h3>
                    <h3 class="titulo-encabezado" style="width:16.66%">N° PRODUCTOS</h3>
                    <h3 class="titulo-encabezado" style="width:16.66%">MONTO</h3>
                </div>
                <div v-if="Panels.seeEncabPag" class="encabezado">
                    <h3 class="titulo-encabezado" style="width:20%">ID PAYMENT</h3>
                    <h3 class="titulo-encabezado" style="width:20%">CLIENTE</h3>
                    <h3 class="titulo-encabezado" style="width:20%">FECHA DE PAGO</h3>
                    <h3 class="titulo-encabezado" style="width:20%">MONTO PAGADO</h3>
                    <h3 class="titulo-encabezado" style="width:20%">IVA</h3>
                </div>
                <div v-if="Panels.seeEncabPen" class="encabezado">
                    <h3 class="titulo-encabezado" style="width:20%">ID PAYMENT</h3>
                    <h3 class="titulo-encabezado" style="width:20%">CLIENTE</h3>
                    <h3 class="titulo-encabezado" style="width:20%">TELEFONO</h3>
                    <h3 class="titulo-encabezado" style="width:20%">FECHA DE PAGO</h3>
                    <h3 class="titulo-encabezado" style="width:20%">MONTO A PAGAR</h3>
                </div>
                <div v-if="Panels.seeEncabCost" class="encabezado">
                    <h3 class="titulo-encabezado" style="width:20%">ID COSTO</h3>
                    <h3 class="titulo-encabezado" style="width:20%">EMPRESA</h3>
                    <h3 class="titulo-encabezado" style="width:20%">EMAIL</h3>
                    <h3 class="titulo-encabezado" style="width:20%">FECHA DE COMPRA</h3>
                    <h3 class="titulo-encabezado" style="width:20%">MONTO PAGADO</h3>
                </div>

            </div>

            <div class="despliegue">
                {{ Panels.advMess }}

                <div v-if="Panels.seeEncabPed" style="width: 100%;">
                    <div class="data" v-for="pedido in pedidosFiltred" :key="pedido._id" @click="InfoProcess(pedido, 1)">
                        <p class="item" style="width:16.66%">{{ pedido.id_Payment }}</p>
                        <p class="item" style="width:16.66%">{{ pedido.Client }}</p>
                        <p class="item" style="width:16.66%">{{ formatiarDatesIn(pedido.Date_Ini_Prodcc+"z", 'nstd') }}</p>
                        <p class="item" style="width:16.66%">{{ formatiarDatesIn(pedido.Date_Fin_Prodcc+"z", 'nstd') }}</p>
                        <p class="item" style="width:16.66%">{{ pedido.products.length }}</p>
                        <p class="item" style="width:16.66%">${{ pedido.MountainTotal }}</p>
                    </div>
                    <div class="totalGG">
                        <b style="width:80%; text-align: right; margin: 0 auto; font-size:17px">TOTAL</b>
                        <b class="item" style="width:20%; cursor: none;">${{ findTotal(pedidosFiltred) }}</b> 
                    </div>
                </div>
                <div v-if="Panels.seeEncabPag" style="width: 100%;">
                    <div class="data" v-for="pago in Pagos" :key="pago._id" @click="InfoProcess(pago, 2)">
                        <p class="item" id="id_payment" style="width:20%">{{ pago.id }}</p>
                        <p class="item" style="width:20%">{{ pago.additional_info.payer.first_name }}</p>
                        <p class="item" style="width:20%">{{ formatiarDatesIn(pago.createdAt, 'nstd') }}</p>
                        <p class="item" style="width:20%">${{ pago.transaction_details.total_paid_amount }}</p>
                        <p class="item" style="width:20%">${{ pago.transaction_details.total_paid_amount * 0.19 }}</p>
                    </div>
                    <div class="totalGG">
                        <b style="width:60%; text-align: right; margin: 0 auto; font-size:17px">TOTALES</b>
                        <b class="item" style="width:20%; cursor: none;">${{ findTotal(Pagos) }}</b>
                        <b class="item" style="width:20%; cursor: none;">${{ findTotal(Pagos) * 0.19}}</b>
                    </div>
                </div>
                <div v-if="Panels.seeEncabPen" style="width: 100%;">
                    <div class="data" v-for="pendiente in Pendientes" :key="pendiente._id" @click="InfoProcess(pendiente, 3)">
                        <p class="item" id="id_payment" style="width:20%">{{ pendiente.id }}</p>
                        <p class="item" style="width:20%">{{ pendiente.additional_info.payer.first_name }}</p>
                        <p class="item" style="width:20%">{{ pendiente.additional_info.payer.phone.number }}</p>
                        <p class="item" style="width:20%">{{ formatiarDatesIn(pendiente.createdAt, 'nstd') }}</p>
                        <p class="item" style="width:20%">${{ pendiente.transaction_details.total_paid_amount }}</p>
                    </div>
                    <div class="totalGG">
                        <b style="width:80%; text-align: right; margin: 0 auto; font-size:17px">TOTAL</b>
                        <b class="item" style="width:20%; cursor: none;">${{ findTotal(Pendientes) }}</b>
                    </div>
                </div>
                <div v-if="Panels.seeEncabCost" style="width: 100%;">
                    <div class="data" v-for="costo in Costos" :key="costo._id" @click="InfoProcess(costo, 4)">
                        <p class="item" id="id_payment" style="width:20%">{{ costo._id }}</p>
                        <p class="item" style="width:20%">{{ costo.name }}</p>
                        <p class="item" style="width:20%">{{ costo.email }}</p>
                        <p class="item" style="width:20%">{{ formatiarDatesIn(costo.createdAt, 'nstd') }}</p><!--Verificar-->
                        <p class="item" style="width:20%">${{ costo.MountainTotal }}</p>
                    </div>
                    <div class="totalGG">
                        <b style="width:80%; text-align: right; margin: 0 auto; font-size:17px">TOTAL</b>
                        <b class="item" style="width:20%; cursor: none;">${{ findTotal(Costos) }}</b>
                    </div>
                </div>
            </div>

            <div v-if="seeWindow.seeFondo" class="ConfGeneral">

                <div v-if="seeWindow.seePedido" class="ConfData">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0px 0px 3vh 1.8vh;">
                        <h3 class="tituloForm">Pedido N° {{ auxProcess.id_Payment }}</h3>
                        <div class="btnFormClose" @click="InfoProcess({}, 0)">✖️</div>
                    </div>
                    <div
                        style="width: 100%; display: flex; flex-wrap: wrap; justify-content: space-around; margin-bottom: 8px;">
                        <div class="formData">
                            <label for="Icliente">Cliente</label>
                            <input v-if="btnActuaz" type="text" id="Icliente" name="Icliente" v-model="auxProcess.Client">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Client }}</p>
                        </div>
                        <div class="formData">
                            <label for="Icorreo">Correo</label>
                            <input v-if="btnActuaz" type="text" id="Icorreo" name="Icorreo" v-model="auxProcess.Correo">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Correo }}</p>
                        </div>
                        <div class="formData">
                            <label for="Itelefono">Telefono</label>
                            <input v-if="btnActuaz" type="number" id="Itelefono" name="Itelefono" v-model="auxProcess.Tel">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Tel }}</p>
                        </div>
                        <div class="formData">
                            <label for="Idireccion">Direccion</label>
                            <input v-if="btnActuaz" type="text" id="Idireccion" name="Idireccion" v-model="auxProcess.Direction">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Direction }}</p>
                        </div>
                        <div class="formData">
                            <label for="Imonto">Monto</label>
                            <input v-if="btnActuaz" type="number" id="Imonto" name="Imonto" v-model="auxProcess.MountainTotal" readonly>
                            <p class="datoActz" v-if="!btnActuaz">${{ auxProcess.MountainTotal }}</p>
                        </div>
                        <div class="formData">
                            <label for="IfechaInicio">Fecha De Inicio</label>
                            <input v-if="btnActuaz" type="datetime-local" id="IfechaInicio" name="IfechaInicio" v-model="auxProcess.Date_Ini_Prodcc">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Date_Ini_Prodcc.replace('T', ', ')  }}</p>
                        </div>
                        <div class="formData">
                            <label for="IfechaAcordada">Fecha Acordada</label>
                            <input v-if="btnActuaz" type="datetime-local" id="IfechaAcordada" name="IfechaAcordada" v-model="auxProcess.Date_Fin_Prodcc">
                            <p class="datoActz" v-if="!btnActuaz">{{ auxProcess.Date_Fin_Prodcc.replace('T', ', ')  }}</p>
                        </div>
                    </div>
                    <div>
                        <div class="EncProducts">
                            <h3 class="titulo-encabProducts">Nombre</h3>
                            <h3 class="titulo-encabProducts">Cantidad</h3>
                            <h3 class="titulo-encabProducts">Precio</h3>
                            <h3 class="titulo-encabProducts">Total</h3>
                            <h3 class="titulo-encabProducts">Iva</h3>
                        </div>
                        <div class="despliegue-products">
                            <div v-if="btnActuaz" class="productB" style="padding-bottom: 7px;">
                                <input type="text" style="width: 20%;" v-model="auxProcessProduct.product_Name">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.units">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.price">
                                <button class="btnsFordmsGG" style="background-color: gray; color: black; margin-left: 10px; font-size: 0.9vw;" @click="addProduct()">Agregar</button>
                            </div>
                            <div class="productB" v-for="product in auxProcess.products" :key="product.id">
                                <!-- auxProcess.products e Total crear Funcion -->
                                <p class="productAL">{{ product.product_Name }}</p>
                                <p class="productAL">{{ product.units }}</p>
                                <p class="productAL">${{ product.price }}</p>
                                <p class="productAL">${{ product.units * product.price }}</p>
                                <p class="productAL">${{ (product.units * product.price) * 0.19 }}</p>
                                <div v-if="btnActuaz" class="QuitProdc" @click="RestarProduct(product)">➖</div>
                                <div v-if="btnActuaz" class="QuitProdc" @click="SumarProduct(product)">➕</div>
                            </div>
                        </div>
                    </div>
                    <div class="btnsForms">
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(68, 68, 255); margin-right: 2vh;" @click="EditarProcess()">Editar Pedido</button>
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(121, 1, 1);" @click="EliminarProcess(auxProcess.id_Payment)">Eliminar Pedido</button>                 
                        <button v-if="btnActuaz" class="btnsFordmsGG" style="background-color: rgb(1, 121, 121); margin-right: 2vh;" @click="OKProcess()">Guardar</button>
                        <button v-if="btnActuaz" class="btnsFordmsGG" style="background-color: gray;" @click="CancelProcess()">Cancelar</button>
                    </div>
                </div>
                <div v-if="seeWindow.seeCosto" class="ConfData">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0px 0px 3vh 1.8vh;">
                        <h3 class="tituloForm">Costo N° {{auxProcess._id}}</h3>
                        <div class="btnFormClose" @click="InfoProcess({}, 0)">✖️</div>
                    </div>
                    <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: space-around; margin-bottom: 8px;">
                        <div class="formData">
                            <label for="Icliente">Empresa</label>
                            <input v-if="btnActuaz" type="text" id="Icliente" name="Icliente" v-model="auxProcess.name">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.name}}</p>
                        </div>
                        <div class="formData">
                            <label for="Icorreo">Correo</label>
                            <input v-if="btnActuaz" type="text" id="Icorreo" name="Icorreo" v-model="auxProcess.email">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.email}}</p>
                        </div>
                        <div class="formData">
                            <label for="Itelefono">Telefono</label>
                            <input v-if="btnActuaz" type="number" id="Itelefono" name="Itelefono" v-model="auxProcess.number">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.number}}</p>
                        </div>
                        <div class="formData">
                            <label for="Idireccion">Direccion</label>
                            <input v-if="btnActuaz" type="text" id="Idireccion" name="Idireccion" v-model="auxProcess.direction">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.direction}}</p>
                        </div>
                        <div class="formData">
                            <label for="Imonto">Monto</label>
                            <input v-if="btnActuaz" type="number" id="Imonto" name="Imonto" v-model="auxProcess.MountainTotal" readonly>
                            <p class="datoActz" v-if="!btnActuaz">${{auxProcess.MountainTotal}}</p>
                        </div>
                        <div class="formData">
                            <label for="Iiva">Iva</label>
                            <input v-if="btnActuaz" type="number" id="Iiva" name="Iiva" :value="auxProcess.MountainTotal * 0.19" readonly>
                            <p class="datoActz" v-if="!btnActuaz">${{auxProcess.MountainTotal * 0.19}}</p>
                        </div>
                        <div class="formData">
                            <label for="ImetodoPago">Forma de Pago</label>
                            <input v-if="btnActuaz" type="text" id="ImetodoPago" name="ImetodoPago" v-model="auxProcess.payment_method">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.payment_method}}</p>
                        </div>
                    </div>
                    <div>
                        <div class="EncProducts">
                            <h3 class="titulo-encabProducts">Nombre</h3>
                            <h3 class="titulo-encabProducts">Cantidad</h3>
                            <h3 class="titulo-encabProducts">Precio</h3>
                            <h3 class="titulo-encabProducts">Total</h3>
                            <h3 class="titulo-encabProducts">Iva</h3>
                        </div>
                        <div class="despliegue-products">
                            <div v-if="btnActuaz" class="productB" style="padding-bottom: 7px;">
                                <input type="text" style="width: 20%;" v-model="auxProcessProduct.product_Name">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.units">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.price">
                                <button class="btnsFordmsGG" style="background-color: gray; color: black; margin-left: 10px; font-size: 0.9vw;" @click="addProduct">Agregar</button>
                            </div>
                            <div class="productB" v-for="product in auxProcess.products" :key="product.id">
                                <!-- auxProcess.products e Total crear Funcion -->
                                <p class="productAL">{{ product.product_Name }}</p>
                                <p class="productAL">{{ product.units }}</p>
                                <p class="productAL">${{ product.price }}</p>
                                <p class="productAL">${{ product.units * product.price }}</p>
                                <p class="productAL">${{ (product.units * product.price) * 0.19 }}</p>
                                <div v-if="btnActuaz" class="QuitProdc" @click="RestarProduct(product)">➖</div>
                                <div v-if="btnActuaz" class="QuitProdc" @click="SumarProduct(product)">➕</div>
                            </div>
                        </div>
                    </div>
                    <div class="btnsForms">
                        
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(68, 68, 255);margin-right: 2vh;" @click="EditarProcess()">Editar Costo</button>
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(121, 1, 1);" @click="EliminarProcess(auxProcess._id)">Eliminar Costo</button>
                        <button v-if="btnActuaz" class="btnsFordmsGG" style="background-color: rgb(1, 121, 121); margin-right: 2vh;" @click="OKProcess()">Guardar</button>
                        <button v-if="btnActuaz && !btnCreate" class="btnsFordmsGG" style="background-color: gray;" @click="CancelProcess()">Cancelar</button>
                    </div>

                </div>
                <div v-if="seeWindow.seePago" class="ConfData">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0px 0px 3vh 1.8vh;">
                        <h3 class="tituloForm">Pago N° {{auxProcess._id}}</h3>
                        <div class="btnFormClose" @click="InfoProcess({}, 0)">✖️</div>
                    </div>
                    <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: space-around; margin-bottom: 8px;">
                        <div class="formData">
                            <label for="Icliente">Cliente</label>
                            <input v-if="btnActuaz" type="text" id="Icliente" name="Icliente" v-model="auxProcess.additional_info.payer.first_name">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.additional_info.payer.first_name}}</p>
                        </div>
                        <div class="formData">
                            <label for="Icorreo">Correo</label>
                            <input v-if="btnActuaz" type="text" id="Icorreo" name="Icorreo" v-model="auxProcess.payer.email">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.payer.email}}</p>
                        </div>
                        <div class="formData">
                            <label for="Itelefono">Telefono</label>
                            <input v-if="btnActuaz" type="number" id="Itelefono" name="Itelefono" v-model="auxProcess.additional_info.payer.phone.number">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.additional_info.payer.phone.number}}</p>
                        </div>
                        <div class="formData">
                            <label for="Idireccion">Direccion</label>
                            <input v-if="btnActuaz" type="text" id="Idireccion" name="Idireccion" v-model="auxProcess.additional_info.payer.address.street_name">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.additional_info.payer.address.street_name}}</p>
                        </div>
                        <div class="formData">
                            <label for="Imonto">Monto</label>
                            <input v-if="btnActuaz" type="number" id="Imonto" name="Imonto" v-model="auxProcess.transaction_details.total_paid_amount" readonly>
                            <p class="datoActz" v-if="!btnActuaz">${{auxProcess.transaction_details.total_paid_amount}}</p>
                        </div>
                        <div class="formData">
                            <label for="Iiva">Iva</label>
                            <input v-if="btnActuaz" type="number" id="Iiva" name="Iiva" :value="auxProcess.transaction_details.total_paid_amount * 0.19" readonly>
                            <p class="datoActz" v-if="!btnActuaz">${{auxProcess.transaction_details.total_paid_amount * 0.19}}</p>
                        </div>
                        <div class="formData">
                            <label for="ImetodoPago">Forma de Pago</label>
                            <input v-if="btnActuaz" type="text" id="ImetodoPago" name="ImetodoPago" v-model="auxProcess.payment_method.type">
                            <p class="datoActz" v-if="!btnActuaz">{{auxProcess.payment_method.type}}</p>
                        </div>
                    </div>
                    <div>
                        <div class="EncProducts">
                            <h3 class="titulo-encabProducts">Nombre</h3>
                            <h3 class="titulo-encabProducts">Cantidad</h3>
                            <h3 class="titulo-encabProducts">Precio</h3>
                            <h3 class="titulo-encabProducts">Total</h3>
                            <h3 class="titulo-encabProducts">Iva</h3>
                        </div>
                        <div class="despliegue-products">
                            <div v-if="btnActuaz" class="productB" style="padding-bottom: 7px;">
                                <input type="text" style="width: 20%;" v-model="auxProcessProduct.title">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.quantity">
                                <input type="number" style="width: 20%;" v-model="auxProcessProduct.unit_price">
                                <button class="btnsFordmsGG" style="background-color: gray; color: black; margin-left: 10px; font-size: 0.9vw;" @click="addProduct()">Agregar</button>
                            </div>
                            <div class="productB" v-for="product in auxProcess.additional_info.items" :key="product.id">
                                <!-- auxProcess.products e Total crear Funcion -->
                                <p class="productAL">{{ product.title }}</p>
                                <p class="productAL">{{ product.quantity }}</p>
                                <p class="productAL">${{ product.unit_price }}</p>
                                <p class="productAL">${{ product.quantity * product.unit_price }}</p>
                                <p class="productAL">${{ (product.quantity * product.unit_price) * 0.19 }}</p>
                                <div v-if="btnActuaz" class="QuitProdc" @click="RestarProduct(product)">➖</div>
                                <div v-if="btnActuaz" class="QuitProdc" @click="SumarProduct(product)">➕</div>
                            </div>
                        </div>
                    </div>
                    <div class="btnsForms">
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(68, 68, 255); margin-right: 2vh;" @click="EditarProcess()">Editar Pago</button>
                        <button v-if="!btnActuaz" class="btnsFordmsGG" style="background-color: rgb(121, 1, 1);" @click="EliminarProcess(auxProcess._id)">Eliminar Pago</button>
                        <button v-if="btnActuaz" class="btnsFordmsGG" style="background-color: rgb(1, 121, 121); margin-right: 2vh;" @click="OKProcess()">Guardar</button>
                        <button v-if="btnActuaz" class="btnsFordmsGG" style="background-color: gray;" @click="CancelProcess()">Cancelar</button>
                    </div>

                </div>
                

            </div>

            <div v-if="seeWindow.seeLoader" id="loader"></div>
        </section>

    </body>
</template>

<script src="../scripts/Manage.js"></script>
<style scoped src="../estilos/manage.css"></style>