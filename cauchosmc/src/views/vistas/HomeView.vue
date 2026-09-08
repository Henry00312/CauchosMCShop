<template>

    <body class="body">
        <header class="header">
            <div class="header1">
                <div id="contacto" @click="toggleContact()"><img src="../../assets/CONTACTOS.png" class="ContactoIMG"
                        loading="lazy" alt="Contacto"></div>
                <a href="/"
                    style="width: 15vh; height: 12vh; display: flex; justify-content: center; align-items: center;"><img
                        src="../../assets/LOGO.png" class="LogoIMG"
                        :style="{ width: changeIMG.width, height: changeIMG.height }" alt="CauchosMC Logo"></a>
                <div class="container-icon">
                    <div class="container-cart-icon" @click="seePaneles.seeCar = !seePaneles.seeCar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="icon-cart">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <div class="count-products">
                            <span id="contador-productos">{{ carrito.cont }}</span>
                        </div>
                    </div>
                    <div v-if="seePaneles.seeCar" class="container-cart-products">
                        <div class="row-product">
                            <div class="cart-product" v-for="product in carrito.items" :key="product.id">
                                <div class="info-cart-product">
                                    <span class="cantidad-producto-carrito"><b>{{ product.quantity }}</b></span>
                                    <p class="titulo-producto-carrito">{{ product.title }}</p>
                                    <span class="precio-producto-carrito">${{ product.unit_price.toLocaleString('es-ES',
                                        {
                                            useGrouping:
                                        true})}}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="icon-close"
                                    @click="remProduct(product.id)">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div class="cart-total">
                            <h3>Total:</h3>
                            <span class="total-pagar">${{ carrito.total.toLocaleString('es-ES', {
                                useGrouping:
                                    true
                            }) }}</span>
                            <button class="btnPagoCar" @click="seeTimePDFun()">Pagar</button>
                        </div>
                    </div>
                </div>

            </div>

        </header>

        <div id="recycling-image"></div>
        <div class="preset">
            <div style="text-align: center;color: black;font-size: 5vh; padding: 4.87vh 1vw;">
                <b>¡Tienda Cauchos MC!</b>
            </div>

            <input list="browsers" name="browser" id="searchInput" v-model="searchItem"
                placeholder="Busca por nombre de producto, tipo o categoria...">
            <datalist id="browsers">
                <option value="Ordeños"></option>
                <option value="Plasticos"></option>
            </datalist>

            <div class="container">
                <div class="box" v-for="product in visibleProducts" :key="product.id">
                    <div class="tlProd">{{ product.nombre }}</div>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img :src="product.img" loading="lazy" :alt="product.nombre">
                        <div style="display: flex; align-items: center;">
                            <div class="PrecProd">${{ product.precio.toLocaleString('es-ES', { useGrouping: true }) }}
                            </div>
                            <input type="number" min="1" max="100000" step="1" value="1" v-model="product.items">
                        </div>
                        <div class="descrip">{{ product.descripcion }}</div>
                    </div>
                    <button class="btnAñadir" @click="addProduct(product)">Añadir</button>
                </div>

                <!-- Botón para cargar más productos -->
                <div v-if="visibleProducts.length < productsFiltred.length" class="load-more-container">
                    <button class="btnLoadMore" @click="loadMoreProducts()">
                        Cargar más productos ({{ productsFiltred.length - visibleProducts.length }} restantes)
                    </button>
                </div>
            </div>

        </div>




        <div id="footer">
            <div style="display: flex; align-items: center;">
                <div class="footerIMG"></div>
                <div
                    style="color: white; display: flex; flex-direction: column; justify-content: center;padding: 0px 0.4vw">
                    <p class="infoM">Nit 21659660-7</p>
                    <p class="infoM">Medellín Calle 7 Sur # 51 - 45</p>
                </div>
                <div
                    style="color: white; display: flex; flex-direction: column; justify-content: center;padding: 0px 0.4vw">
                    <p class="infoM">CauchosMC@gmail.com</p>
                    <p class="infoM">(+57) 312 802 3879</p>
                </div>
                <div style="display: flex; align-items: end; height: 5.3vh"><a class="TDat"
                        @click="togglePTTData()">Política de Tratamiento de Datos</a></div>
            </div>

            <a href="https://www.instagram.com/cauchosmc/?hl=es-la"><img class="instagram"
                    src="../../assets/instagram.png" loading="lazy" alt="Instagram"></a>
        </div>

        <div v-if="seePaneles.seeFondo" class="Degrad">
            <div v-if="seePaneles.seeTimePD" class="time-pedido">
                <div class="time-pedido-header">
                    <div class="time-pedido-header-button" @click="closePanelsIn()">✖️</div>
                </div>
                <div class="time-pedido-content">
                    <p class="time-pedido-messgue">Su Pedido Será Producido Aproximadamente El {{ LastDate }}</p>
                    <button class="time-pedido-btn" @click="FormularioPago()">Continuar</button>
                </div>
            </div>

            <div v-if="seePaneles.seeInfoPD" class="modal-container">
                <div class="modal-header">
                    <h1 class="modal-header-title">Información de Pedido</h1>
                    <div class="modal-header-button" @click="closePanelsIn()">✖️</div>
                </div>
                <div class="modal-contentt">
                    <div class="formIP">
                        <label for="persona">Empresa (J)(N)</label>
                        <input type="text" id="persona" name="persona" v-model="InfoPedido.razon"><!--size="50%"-->
                    </div>
                    <div class="formIP">
                        <label for="nit">NIT</label>
                        <input type="text" id="nit" name="nit" v-model="InfoPedido.nit">
                    </div>
                    <div class="formIP">
                        <label for="correo">Correo Electrónico</label>
                        <input type="text" id="correo" name="correo" v-model="InfoPedido.email">
                    </div>
                    <div class="formIP">
                        <label for="telefono">Teléfono</label>
                        <input type="text" id="telefono" name="telefono" v-model="InfoPedido.phone">
                    </div>
                    <div class="formIP">
                        <label for="direccion">Dirección</label>
                        <input type="text" id="direccion" name="direccion" v-model="InfoPedido.address">
                    </div>
                    <div class="formIP">
                        <label for="ciudad">Ciudad</label>
                        <input type="text" id="ciudad" name="ciudad" v-model="InfoPedido.city">
                    </div>
                    <div class="formIPTTD">
                        <input type="checkbox" id="TTData" name="TTData" v-model="InfoPedido.ATTdata"
                            style="margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif;">
                        <label>Acepto la política de tratamiento de datos</label>
                    </div>
                    <div class="mitInfo"><button class="btnOKPay" @click="validarFormulario()">Continuar</button></div>
                </div>
            </div>

            <div v-if="seePaneles.seeContact" class="modal-container">
                <div class="modal-header">
                    <h1 class="modal-header-title">Contacto</h1>
                    <div class="modal-header-button" @click="toggleContact()">✖️</div>
                </div>
                <div class="modal-contentt">
                    <div class="formIP">
                        <label for="empresa">Empresa</label>
                        <input type="text" id="empresa" name="empresa" v-model="InfoContact.razon">
                    </div>
                    <div class="formIP">
                        <label for="correoElec">Correo Electrónico</label>
                        <input type="text" id="correoElec" name="correoElec" v-model="InfoContact.email">
                    </div>
                    <div class="formIP">
                        <label for="numContact">Teléfono</label>
                        <input type="text" id="numContact" name="numContact" v-model="InfoContact.phone">
                    </div>
                    <div class="formIP">
                        <label for="mensaje">Mensaje</label>
                        <textarea id="mensaje" name="mensaje" rows="3" placeholder="Escribe aquí..."
                            v-model="InfoContact.message"></textarea>
                    </div>
                    <div class="formIPTTD">
                        <input type="checkbox" id="TTData" name="TTData" v-model="InfoContact.ATTdata"
                            style="margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif;">
                        <label>Acepto la política de tratamiento de datos</label>
                    </div>
                    <div class="mitInfo"><button class="btnOKPay" @click="validarFormularioContacto()">Enviar</button>
                    </div>
                </div>
            </div>

            <div v-if="seePaneles.seePTTData" class="PolTratamientoDatos">
                <div class="TratDatos-header">
                    <h1 class="TratDatos-header-title">Política de Tratamiento de Datos</h1>
                    <div class="TratDatos-header-button" @click="togglePTTData()">✖️</div>
                </div>
                <div class="TratDatos-contentt">
                    <h2 class="TratDatos-tema">Introducción</h2>
                    <p class="TratDatos-parrafo">CauchosMC reconoce la importancia de proteger la privacidad y la
                        seguridad de la información personal de sus clientes.
                        Esta política describe cómo recopilamos, utilizamos, divulgamos y protegemos la información
                        personal que obtenemos a través de nuestro sitio web.</p>
                    <h2 class="TratDatos-tema">Información Personal Recopilada</h2>
                    <p class="TratDatos-parrafo">CauchosMC recopila información personal de sus clientes para facilitar
                        la compra y mejorar la experiencia de usuario.
                        La información puede incluir, pero no se limita a:
                    </p>
                    <ul class="listaDat">
                        <li>Nombre, apellidos o razón social</li>
                        <li>Dirección de correo electrónico</li>
                        <li>Dirección de envío</li>
                        <li>Número de teléfono</li>
                        <li>Información de pago</li>
                    </ul>
                    <h2 class="TratDatos-tema">Uso de la Información Personal</h2>
                    <p class="TratDatos-parrafo">La información personal recopilada se utiliza para:</p>
                    <ul class="listaDat">
                        <li>Procesar y completar pedidos</li>
                        <li>Enviar confirmaciones de compra y actualizaciones de envío</li>
                        <li>Brindar soporte al cliente</li>
                        <li>Mejorar y personalizar la experiencia del usuario</li>
                        <li>Cumplir con requisitos legales y reglamentarios</li>
                    </ul>
                    <h2 class="TratDatos-tema">Seguridad de la Información Personal</h2>
                    <p class="TratDatos-parrafo">CauchosMC implementa medidas de seguridad para proteger la información
                        personal de accesos no autorizados,
                        pérdidas, alteraciones o divulgaciones. Utilizamos tecnologías de cifrado y prácticas de
                        seguridad estándar de la industria.</p>
                    <h2 class="TratDatos-tema">Compartir Información Personal</h2>
                    <p class="TratDatos-parrafo">CauchosMC no vende, alquila ni comparte información personal con
                        terceros no afiliados,
                        excepto cuando sea necesario para procesar transacciones o cumplir con requisitos legales.</p>
                    <h2 class="TratDatos-tema">Cookies y Tecnologías Similares</h2>
                    <p class="TratDatos-parrafo">CauchosMC utiliza cookies y tecnologías similares para mejorar la
                        funcionalidad del sitio web y recopilar información no personal sobre la interacción del usuario
                        con el sitio.</p>
                    <h2 class="TratDatos-tema">Derechos del Usuario</h2>
                    <p class="TratDatos-parrafo">Los usuarios tienen derechos para acceder, corregir,
                        eliminar y oponerse al tratamiento de su información personal. Pueden ejercer estos derechos
                        enviando una solicitud a nuestro equipo de soporte.</p>
                    <h2 class="TratDatos-tema">Cambios en la Política de Privacidad</h2>
                    <p class="TratDatos-parrafo">CauchosMC se reserva el derecho de modificar esta política en cualquier
                        momento. Los cambios se publicarán en el sitio web, y se alienta a los usuarios a revisar la
                        política periódicamente.</p>
                    <h2 class="TratDatos-tema">Contacto</h2>
                    <p class="TratDatos-parrafo">Cualquier pregunta sobre esta política puede dirigirse a nuestro equipo
                        de atención al cliente a través de cauchosmc@gmail.com.</p>
                    <button class="TratDatos-btn" @click="togglePTTData()">Aceptar</button>
                </div>

            </div>
        </div>

        <div v-if="seePaneles.seeLoader" id="loader"></div>

    </body>
</template>

<script src="../scripts/Home.js"></script>

<style scoped src="../estilos/principal.css"></style>
<style scoped src="../estilos/movil.css"></style>