
const ShopContainer = document.querySelector('.container');

const enterBuscarInput = document.getElementById("searchInput");
const btnBuscar = document.querySelector('.btnBuscar');

const loader = document.getElementById('loader');

const logoImg = document.querySelector('.LogoIMG');


window.addEventListener("scroll", function () {

    if (window.scrollY === 0) {
        logoImg.style.width = '15vh';
        logoImg.style.height = '12vh';
    } else {
        logoImg.style.width = '16vh';
        logoImg.style.height = '13vh';
    }

});


enterBuscarInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        btnBuscar.click();
    }
});


btnBuscar.addEventListener('click', () => {

    let pdBusc = enterBuscarInput.value;

    let PalN = "";
    let PalT = "";
    let Pal0 = "";

    if (pdBusc.length > 3) {

        ShopContainer.innerHTML = '';

        Productos.forEach((product) => {
            PalN = quitarTildes(product.nombre);
            PalT = quitarTildes(product.type);
            Pal0 = quitarTildes(pdBusc);

            PalN = PalN.toLowerCase();
            PalT = PalT.toLowerCase();
            Pal0 = Pal0.toLowerCase();


            if (PalN.includes(Pal0) === true || PalT.includes(Pal0) === true || Pal0.includes(PalN) === true || Pal0.includes(PalT) === true) {

                let content = document.createElement("div");
                content.classList.add('box');
                content.innerHTML = `
                        <div class="tlProd">${product.nombre}</div>
                        <img src="${product.img}">
                        <div style="display: flex; justify-content: center; align-items: center;">
                            <div class="PrecProd">$${product.precio}</div>
                            <input type="number" min="1" max="100000" step="1" value="1">
                        </div>

                        <div class="descrip">${product.descripcion}</div>
                        <button class="btnAñadir">Añadir</button>
                    `;

                ShopContainer.append(content);

            }
        });
    }

});



function quitarTildes(palabraConTilde) {
    // Utilizamos el método "normalize" para descomponer la letra con tilde en sus componentes.
    const palabraSinTilde = palabraConTilde.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Eliminamos los diacríticos (tildes).

    return palabraSinTilde;
}



/* LLevar Producto a Carrito de Compra */
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});


const cartInfo = document.querySelector('.cart-product');

const rowProduct = document.querySelector('.row-product');

const productsList = document.querySelector('.container');

let allProducts = [];

let valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btnAñadir')) {

        const Product = e.target.parentElement;

        if (Product.querySelector("input").value > 0) {

            const infoProduct = {
                quantity: Product.querySelector("input").value,
                title: Product.querySelector(".tlProd").textContent,
                price: Product.querySelector(".PrecProd").textContent,
            };


            const exits = allProducts.some(product => product.title === infoProduct.title);

            if (exits) {
                const products = allProducts.map(product => {
                    if (product.title === infoProduct.title) {
                        product.quantity = parseInt(product.quantity) + parseInt(infoProduct.quantity);
                        return product;
                    }
                    else {
                        return product;
                    }
                })
                allProducts = [...products]
            }
            else {
                allProducts = [...allProducts, infoProduct];
            }
            showHTML();

        }
        else {
            alert("Ingresa una cantidad válida.");
        }


    }
});

rowProduct.addEventListener('click', (e) => {

    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(product => product.title !== title);
        showHTML();
    }
});

const showHTML = () => {

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito"><b>${product.quantity}</b></span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total = total + (parseInt(product.price.slice(1)) * parseInt(product.quantity))

    });

    valorTotal.innerText = `$${total}`;
    totalOfProducts = allProducts.length;
    countProducts.innerText = totalOfProducts;
};

/* Tiempo Estimado del Pedido */


const verTiempoPedido = document.querySelector(".btnPagoCar");
const modalTiempoPedido = document.querySelector(".time-pedido");


verTiempoPedido.addEventListener("click", () => {
    containerCartProducts.classList.toggle('hidden-cart');
    modalTiempoPedido.style.display = "flex";
    modalTiempoPedido.innerHTML = ``;

});


/* Formulario Pago Carrito */

const modalContainer = document.querySelector(".modal-container");

function FormularioPago() {
    if (allProducts.length > 0) {
        containerCartProducts.classList.toggle('hidden-cart');

        modalContainer.style.display = "flex";
        modalContainer.innerHTML = ``;

        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";
        modalHeader.innerHTML = `
        <h1 class="modal-header-title">Información de Pedido</h1>`; /* Formulario de Registro */
        modalContainer.append(modalHeader);

        const modalButton = document.createElement("div");
        modalButton.innerHTML = "✖️";
        modalButton.className = "modal-header-button";

        modalButton.addEventListener("click", () => {
            modalContainer.style.display = "none";
        });

        modalHeader.append(modalButton);

        const modalContentt = document.createElement("div");
        modalContentt.className = "modal-contentt";
        modalContentt.innerHTML = `
            <div class="formIP">
                <label for="persona">Persona (J)(N)</label>
                <input type="text" id="persona" name="persona" size="50%">
            </div>
            <div class="formIP">
                <label for="nit">NIT</label>
                <input type="text" id="nit" name="nit" size="50%">
            </div>
            <div class="formIP">
                <label for="correo">Correo Electrónico</label>
                <input type="text" id="correo" name="correo" size="50%">
            </div>
            <div class="formIP">
                <label for="telefono">Teléfono</label>
                <input type="text" id="telefono" name="telefono" size="50%">
            </div>
            <div class="formIP">
                <label for="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" size="50%">
            </div>
            <div class="formIP">
                <label for="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" size="50%">
            </div>
                
            <div class="mitInfo"><button class="btnOKPay" OnClick="validarFormulario()">OK</button></div>
        `;

        modalContainer.append(modalContentt);

    }
}

function validarFormulario() {
    var Persona = document.getElementById("persona").value;
    var Nit = document.getElementById("nit").value;
    var Correo = document.getElementById("correo").value;
    var Telefono = document.getElementById("telefono").value;
    var Direccion = document.getElementById("direccion").value;
    var Ciudad = document.getElementById("ciudad").value;

    var correoValido = /\S+@\S+\.\S+/;

    if (Persona === "" || Nit === "" || Correo === "" || Telefono === "" || Direccion === "" || Ciudad === "") {
        alert("Por favor, llena todos los campos del formulario.");
        return false;
    }

    if (!correoValido.test(Correo)) {
        alert("Ingresa un correo electrónico válido.");
        return false;
    }


    checkOut(Persona, Nit, Correo, Telefono, Direccion, Ciudad);

    loader.style.display = 'block';

    return true;
}

async function checkOut(Persona, Nit, Correo, Telefono, Direccion, Ciudad) {
    var datos = {
        persona: Persona,
        nit: Nit,
        correo: Correo,
        telefono: Telefono,
        direccion: Direccion,
        ciudad: Ciudad,
        productos: allProducts
    };

    var opciones = {
        method: 'POST',
        body: JSON.stringify(datos)
    };


    const response = await fetch('http://localhost:3000/payment', opciones)

    const data = await response.json()
    console.log(data);
    window.location.href = data.init_point;

    loader.style.display = 'none';


}

/* Formulario Contacto */
const verContacto = document.getElementById("contacto");
const contactoContainer = document.querySelector(".contacto-container");

verContacto.addEventListener("click", () => {

    contactoContainer.style.display = "flex";
    contactoContainer.innerHTML = ``;

    const contactoHeader = document.createElement("div");
    contactoHeader.className = "contacto-header";
    contactoHeader.innerHTML = `
        <h1 class="contacto-header-title">Contacto</h1>`; /* Formulario de Registro */
    contactoContainer.append(contactoHeader);

    const modalButton = document.createElement("div");
    modalButton.innerHTML = "✖️";
    modalButton.className = "contacto-header-button";

    modalButton.addEventListener("click", () => {
        contactoContainer.style.display = "none";
    });

    contactoHeader.append(modalButton);

    const contactoContentt = document.createElement("div");
    contactoContentt.className = "contacto-contentt";
    contactoContentt.innerHTML = `     
            <div class="formIPContac">
                <label for="empresa">Empresa</label>
                <input type="text" id="empresa" name="empresa">
            </div>

            <div class="formIPContac">
                <label for="correoElec">Correo Electrónico</label>
                <input type="text" id="correoElec" name="correoElec">
            </div>
            <div class="formIPContac">
                <label for="numContact">Teléfono</label>
                <input type="text" id="numContact" name="numContact">
            </div>
            <div class="formIPContac">
                <label for="mensaje">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="3" placeholder="Escribe aquí..."></textarea>
            </div>
                
            <div class="mitInfoContac"><button class="btnOKContac" OnClick="validarFormularioContacto()">OK</button></div>      
        `;

    contactoContainer.append(contactoContentt);
});

function validarFormularioContacto() {
    var Empresa = document.getElementById("empresa").value;
    var correoElec = document.getElementById("correoElec").value;
    var numContact = document.getElementById("numContact").value;
    var Mensaje = document.getElementById("mensaje").value;

    var correoValido = /\S+@\S+\.\S+/;

    if (Empresa === "" || correoElec === "" || numContact === "" || Mensaje === "") {
        alert("Por favor, llena todos los campos del formulario.");
        return false;
    }

    if (!correoValido.test(correoElec)) {
        alert("Ingresa un correo electrónico válido.");
        return false;
    }

    //MessaggeOut();
    return true;

}
