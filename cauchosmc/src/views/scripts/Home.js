import Productos from "./productos.js";
export default {
  name: "home",
  data() {
    return {
      changeIMG: { width: "15vh", height: "12vh" },
      searchItem: "",
      seePaneles: {
        seeCar: false,
        seeFondo: false,
        seeLoader: false,
        seeTimePD: false,
        seeInfoPD: false,
        seeContact: false,
        seePTTData: false,
      },
      carrito: { cont: 0, items: [], total: 0 },
      LastDate: "",
      InfoPedido: {
        razon: "",
        nit: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        ATTdata: false,
      },
      InfoContact: {
        razon: "",
        email: "",
        phone: "",
        message: "",
        ATTdata: false,
      },
      apiURL: process.env.VUE_APP_API_URL,
      scrollTimeout: null,
      searchCache: new Map(),
      lastSearchTerm: "",
      searchTimeout: null,
      visibleProducts: [],
      itemsPerPage: 12,
      currentPage: 0,
    };
  },
  methods: {
    //ops
    async fetchTasks() {},
    async TimeES() {
      try {
        this.seePaneles.seeLoader = true;
        var opciones = {
          method: "POST",
          body: JSON.stringify(this.carrito.items),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`${this.apiURL}/api/time`, opciones);
        const FechaT = await response.json();
        //console.log(FechaT)
        const fechaFinal = new Date(FechaT);

        // Formatear la fecha según tus necesidades
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          //timeZone: 'UTC', // Ajustar la zona horaria según sea necesario
        };
        const formatoFecha = new Intl.DateTimeFormat("es-ES", options);
        // Obtener la cadena formateada
        const fechaFinalFormateada = formatoFecha.format(fechaFinal);

        this.seePaneles.seeLoader = false;
        return fechaFinalFormateada;
      } catch (error) {
        console.log(error);
      }
    },
    async checkOut() {
      try {
        this.seePaneles.seeLoader = true;
        var datos = {
          persona: this.InfoPedido.razon,
          nit: this.InfoPedido.nit,
          correo: this.InfoPedido.email,
          telefono: this.InfoPedido.phone,
          direccion: this.InfoPedido.address,
          ciudad: this.InfoPedido.city,
          productos: this.carrito.items,
        };
        var opciones = {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`${this.apiURL}/api/payment`, opciones);
        const data = await response.json();
        this.seePaneles.seeLoader = false;
        //window.location.href = data.url;
        window.open(data.url, "_blank");
      } catch (error) {
        console.log(error);
      }
    },
    async MessaggeOut() {
      try {
        var datos = {
          empresa: this.InfoContact.razon,
          correo: this.InfoContact.email,
          telefono: this.InfoContact.phone,
          mensaje: this.InfoContact.message,
        };
        var opciones = {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        };
        await fetch(`${this.apiURL}/api/contacto`, opciones);
      } catch (error) {
        console.log(error);
      }
    },
    //dom
    addProduct(product) {
      if (product.items > 0) {
        const infoProduct = {
          id: product.id,
          title: product.nombre,
          unit_price: product.precio,
          quantity: product.items,
        };
        //const exits = this.carrito.items.some(product => product.id === infoProduct.id);
        let exits = false;
        let auxTotal = 0;
        const Allproducts = this.carrito.items.map((product) => {
          if (product.id === infoProduct.id) {
            product.quantity =
              parseInt(product.quantity) + parseInt(infoProduct.quantity);
            exits = true;
          }
          auxTotal += parseInt(product.unit_price) * parseInt(product.quantity);
          return product;
        });
        this.carrito.total = exits
          ? auxTotal
          : auxTotal +
            parseInt(infoProduct.unit_price) * parseInt(infoProduct.quantity);
        this.carrito.items = exits
          ? [...Allproducts]
          : [...this.carrito.items, infoProduct];
        this.carrito.cont = this.carrito.items.length;
      }
    },
    remProduct(id) {
      let total = 0;
      this.carrito.items = this.carrito.items.filter((product) => {
        if (product.id !== id) {
          total += parseInt(product.unit_price) * parseInt(product.quantity);
          return product;
        }
      });
      this.carrito.cont = this.carrito.items?.length;
      this.carrito.total = total;
    },
    async seeTimePDFun() {
      if (this.carrito.items.length > 0) {
        this.seePaneles.seeCar = false;
        this.LastDate = await this.TimeES();
        this.seePaneles.seeFondo = true;
        this.seePaneles.seeTimePD = true;
      }
    },
    async validarFormulario() {
      var correoValido = /\S+@\S+\.\S+/;
      if (
        this.InfoPedido.razon?.length < 3 ||
        this.InfoPedido.nit?.length < 4 ||
        this.InfoPedido.email?.length < 5 ||
        this.InfoPedido.phone?.length < 6 ||
        this.InfoPedido.address?.length < 6 ||
        this.InfoPedido.city?.length < 4
      ) {
        alert(
          "Por favor, llena todos los campos del formulario correctamente."
        );
        return false;
      }
      if (
        this.InfoPedido.razon?.length > 150 ||
        this.InfoPedido.nit?.length > 150 ||
        this.InfoPedido.email?.length > 150 ||
        this.InfoPedido.phone?.length > 150 ||
        this.InfoPedido.address?.length > 150 ||
        this.InfoPedido.city?.length > 150
      ) {
        alert("Por favor, digita datos concisos no tan largos.");
        return false;
      }
      if (!correoValido.test(this.InfoPedido.email)) {
        alert("Ingresa un correo electrónico válido.");
        return false;
      }
      if (!this.InfoPedido.ATTdata) {
        alert("Debes aceptar nuestra política de tratamiento de datos.");
        return false;
      }
      await this.checkOut();
      return true;
    },
    async validarFormularioContacto() {
      var correoValido = /\S+@\S+\.\S+/;
      if (
        this.InfoContact.razon?.length < 3 ||
        this.InfoContact.email?.length < 5 ||
        this.InfoContact.phone?.length < 6 ||
        this.InfoContact.message?.length < 7
      ) {
        alert(
          "Por favor, llena todos los campos del formulario correctamente."
        );
        return false;
      }
      if (
        this.InfoContact.razon?.length > 150 ||
        this.InfoContact.email?.length > 150 ||
        this.InfoContact.phone?.length > 150
      ) {
        alert("Por favor, digita datos concisos no tan largos.");
        return false;
      }
      if (!correoValido.test(this.InfoContact.email)) {
        alert("Ingresa un correo electrónico válido.");
        return false;
      }
      if (!this.InfoContact.ATTdata) {
        alert("Debes aceptar nuestra política de tratamiento de datos.");
        return false;
      }
      await MessaggeOut();
      window.location.href = `${this.apiURL}/contacto`;
      return true;
    },
    //functions
    closePanelsIn() {
      this.seePaneles.seeTimePD = false;
      this.seePaneles.seeInfoPD = false;
      this.seePaneles.seeFondo = false;
    },
    FormularioPago() {
      this.seePaneles.seeCar = false;
      this.seePaneles.seeTimePD = false;
      this.seePaneles.seeInfoPD = true;
    },
    toggleContact() {
      this.seePaneles.seeContact = !this.seePaneles.seeContact;
      this.seePaneles.seeFondo = !this.seePaneles.seeFondo;
    },
    togglePTTData() {
      this.seePaneles.seePTTData = !this.seePaneles.seePTTData;
      this.seePaneles.seeFondo = !this.seePaneles.seeFondo;
    },
    handleScroll(e) {
      // Throttling para mejorar rendimiento
      if (this.scrollTimeout) {
        return;
      }

      this.scrollTimeout = setTimeout(() => {
        var scr = e.target.scrollTop;
        if (scr > 0) {
          this.changeIMG.width = "15vh";
          this.changeIMG.height = "13vh";
        } else {
          this.changeIMG.width = "15vh";
          this.changeIMG.height = "12vh";
        }
        this.scrollTimeout = null;
      }, 16); // ~60fps
    },
    // Método para manejar búsqueda con debounce
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        // Forzar actualización del computed
        this.$forceUpdate();
      }, 300);
    },
    // Método para cargar más productos (paginación virtual)
    loadMoreProducts() {
      const allProducts = this.productsFiltred;
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const newProducts = allProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        this.visibleProducts = [...this.visibleProducts, ...newProducts];
        this.currentPage++;
      }
    },
    // Método para resetear la paginación
    resetPagination() {
      this.visibleProducts = [];
      this.currentPage = 0;
      this.loadMoreProducts();
    },
  },
  watch: {
    searchItem() {
      this.handleSearch();
      this.resetPagination();
    },
    productsFiltred() {
      this.resetPagination();
    },
  },
  computed: {
    productsFiltred() {
      // Cache para evitar recálculos innecesarios
      if (
        this.searchItem === this.lastSearchTerm &&
        this.searchCache.has(this.searchItem)
      ) {
        return this.searchCache.get(this.searchItem);
      }

      let result;
      if (this.searchItem.length > 0) {
        // Normalizar búsqueda una sola vez
        const normalizedSearch = this.searchItem
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        result = Productos.filter((product) => {
          // Normalizar datos del producto una sola vez
          const normalizedName = product.nombre
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
          const normalizedType = product.type
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

          return (
            normalizedName.includes(normalizedSearch) ||
            normalizedType.includes(normalizedSearch) ||
            normalizedSearch.includes(normalizedName) ||
            normalizedSearch.includes(normalizedType)
          );
        });
      } else {
        result = Productos;
      }

      // Guardar en cache
      this.searchCache.set(this.searchItem, result);
      this.lastSearchTerm = this.searchItem;

      // Limpiar cache si se vuelve muy grande
      if (this.searchCache.size > 10) {
        this.searchCache.clear();
      }

      return result;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
    // Cargar productos iniciales
    this.resetPagination();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true);
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
  created() {
    //this.fetchTasks();
  },
};
