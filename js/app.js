let productos = [];
let carrito = [];

const datos = async () => {
	try {
		const response = await fetch('./json/data.json');
		if (!response.ok) {
			throw new Error('Error al solicitar el archivo data.json');
		}
		return await response.json();
	} catch (error) {
		console.error('Problema al hacer un fetch.', error);
		throw error;
	}
};

class Producto {
	static contadorID = 0;
	pid;
	nombre;
	categoria;
	marca;
	precio;
	stock;
	img;
	constructor(nombre, marca,categoria, precio, stock, img) {
		Producto.contadorID += 1;
		this.pid = Producto.contadorID;
		this.nombre = nombre;
		this.categoria = categoria;
		this.marca = marca;
		this.precio = precio;
		this.stock = stock;
		this.img = img;
	}

	getPid() {
		return this.pid;
	}
	setPid(pid) {
		this.pid=pid;
	}
	getNombre() {
		return this.nombre;
	}
	setNombre(nombre) {
		this.nombre = nombre;
	}

	getCategoria() {
		return this.categoria;
	}
	setCategoria(cat) {
		this.categoria = cat;
	}

	getMarca() {
		return this.marca;
	}
	setMarca(marca) {
		this.marca = marca;
	}

	getPrecio() {
		return this.precio;
	}
	setPrecio(p) {
		this.precio = p;
	}

	getStock() {
		return this.stock;
	}
	setStock(stock) {
		this.stock = stock;
	}

	getImg() {
		return this.img;
	}
	setImg(img) {
		this.img = img;
	}
}

const actualizarPID = async () => {
	try {
		const datos1 = await datos();
		const max = (listProducts) => {
			if (!listProducts.length) return 0;
			return Math.max(...listProducts.map((product) => product.pid));
		};
		Producto.contadorID = max(datos1.productos);
	} catch (error) {
		console.error('Error función datos()', error);
	}
};
const cargarStorageProductos = async () => {
	localStorage.clear();
	try {
		const datos1 = await datos();
		localStorage.setItem('productosJSON', JSON.stringify(datos1.productos));
		productos = [...JSON.parse(localStorage.getItem('productosJSON'))];
	} catch (error) {
		console.error('Error función datos()', error);
	}
};
const cargarProductosAIndex = async () => {
	const productsCardContainer = document.getElementById('productsCardContainer');
	const templateProdCard = document.getElementById('template-productCard')
	const fragment = document.createDocumentFragment();
	// vacio el contenedor de productos
	productsCardContainer.innerHTML = '';
	// actualizo los productos

	productos.forEach((item) => {
		const clone = templateProdCard.content.cloneNode(true);

		const productCard = clone.querySelector('#productCard');
		const categoria = clone.querySelector('#categoria');
		const precioxunidad = clone.querySelector('#precioXunidad');
		const nombre = clone.querySelector('#prod-name');
		const brand = clone.querySelector('#prod-brand');
		const total = clone.querySelector('#totalCard');
		const img = clone.querySelector('#prod-img');
		const stock = clone.querySelector('#prod-stock');
		const cantidadAcomprar =
		clone.querySelector('#cantidadAcomprar');
		const cantidadMenos = clone.querySelector('#prod-cantidadMenos');
		const cantidadMas = clone.querySelector('#prod-cantidadMas');
		const btnAddCart = clone.querySelector('#agregarCarrito');

		// dataset pid
		precioxunidad.dataset.pid = item.pid;
		cantidadAcomprar.dataset.pid = item.pid;
		cantidadMenos.dataset.pid = item.pid;
		cantidadMas.dataset.pid = item.pid;
		total.dataset.pid = item.pid;
		productCard.dataset.pid = item.pid;
		btnAddCart.dataset.pid = item.pid;

		// textcontent
		nombre.textContent = item.nombre;
		brand.textContent = item.marca;
		stock.textContent = 'stock: ' + item.stock;
		img.src = item.img;
		categoria.textContent = item.categoria;
		precioxunidad.textContent = parseFloat(item.precio).toFixed(2);
		
		cantidadAcomprar.textContent = 1;
		cantidadAcomprar.style.backgroundColor='black';
		if(item.stock === 0){ 
			cantidadAcomprar.textContent = 0;
			cantidadAcomprar.style.color = 'red';
		}
		total.textContent = parseFloat(item.precio * parseInt(cantidadAcomprar.textContent)).toFixed(2);

		fragment.appendChild(clone);
	});

	localStorage.setItem('productos', JSON.stringify(productos));
	productsCardContainer.appendChild(fragment);
};

const actualizarTotalProdCard = (e) => {
	const button = e.target;
	const cardID = e.target.dataset.pid;
	const cantidad = parseInt(
		document.querySelector(`#cantidadAcomprar[data-pid="${cardID}"]`)
			.textContent
	);
	const precioXunidad = parseFloat(
		document.querySelector(`#precioXunidad[data-pid="${cardID}"]`).textContent
	);
	const totalCard = document.querySelector(`#totalCard[data-pid="${cardID}"]`);
	totalCard.textContent = parseFloat(cantidad * precioXunidad).toFixed(2);
};
const toggleCart = () => {
	const modalCart = document.querySelector('.modal-cart');
	modalCart.classList.toggle('modal-notshow');
};
const sumProd = (e) => {
	const button = e.target;
	const dataID = button.dataset.pid; // Opcion 1
	const span = document.querySelector(
		`#cantidadAcomprar[data-pid="${dataID}"]`
	);
	const cantidad = parseInt(span.textContent);
	const selectedProd = productos.filter(
		(item) => item.pid == e.target.dataset.pid
	);
	if (cantidad < selectedProd[0].stock) {
		span.textContent = cantidad + 1;
		actualizarTotalProdCard(e);
	}
};
const restProd = (e) => {
	const button = e.target;
	const dataID = button.getAttribute('data-pid'); // opcion 2
	const span = document.querySelector(
		`#cantidadAcomprar[data-pid='${dataID}']`
	);
	let cantidad = parseInt(span.textContent);
	if (cantidad - 1 > 0) span.textContent = cantidad - 1;
	else{
		span.textContent = 0;
	}
	actualizarTotalProdCard(e);
};
const pintarCarrito = () =>{

	const fragment = document.createDocumentFragment();
	const templateCart = document.querySelector('#template-cartProduct');
	const cartProducts = document.querySelector('#cart-products');
	cartProducts.innerHTML='';
	carrito.forEach((item)=>{
		const clone = templateCart.content.cloneNode(true);
		const productName = clone.querySelector('#product-name');
		const cantidadAcomprarCarrito = clone.querySelector('#cantidadAcomprarCarrito');
		const botonMenos = clone.querySelector('#cart-cantidadMenos');
		const botonMas = clone.querySelector('#cart-cantidadMas');
		const precioXunidadCarrito = clone.querySelector('#precioXunidadCarrito');
		const precioEnvioCarrito = clone.querySelector('#precioEnvioCarrito');
		const cartProductTotal = clone.querySelector('#cartProduct-total');
		const cartBtnEliminar = clone.querySelector('#cartbtn-eliminar');
		console.log(cartProductTotal);
		//dataset id
		botonMas.dataset.pid = item.getPid();
		botonMenos.dataset.pid = item.getPid();
		cartProductTotal.dataset.pid = item.getPid();
		cantidadAcomprarCarrito.dataset.pid = item.getPid();
		cartBtnEliminar.dataset.pid = item.getPid();

		// textcontent
		productName.textContent = item.getNombre();
		cantidadAcomprarCarrito.textContent = item.getStock();
		precioXunidadCarrito.textContent = parseFloat(item.getPrecio()).toFixed(2);
		precioEnvioCarrito.textContent = 0;
		cartProductTotal.textContent = parseFloat(item.getStock() * item.getPrecio()).toFixed(2) ;
		cartProductTotal.appendChild(cartBtnEliminar);

		fragment.appendChild(clone);
	})
	cartProducts.appendChild(fragment);
}
const añadirProductosAlCarrito = async (e) =>{
	const dataID = e.target.getAttribute('data-pid');
	const selecProdIndex = productos.findIndex((item) => item.pid == dataID);
	const selecProd = productos[selecProdIndex];
	const cantidadAcomprar = parseInt(document.querySelector(`#cantidadAcomprar[data-pid="${dataID}"]`).textContent);

	// reduzco stock del array
	productos[selecProdIndex].stock -= cantidadAcomprar;
	
	// Creo un Producto. Si no existe lo agrego al carrito. si existe, le sumo el stock pedido.
	const productoAagregar = new Producto(selecProd.nombre,selecProd.marca,selecProd.categoria,selecProd.precio,cantidadAcomprar,selecProd.img);
	productoAagregar.setPid(dataID);
	const existeEncarrito = carrito.findIndex((item)=> item.getPid() == dataID);
	
	if(existeEncarrito === -1){
		carrito.push(productoAagregar);
	}
	else{
		const stockPedidoAnt = carrito[existeEncarrito].getStock();
		carrito[existeEncarrito].setStock(stockPedidoAnt + cantidadAcomprar);
	}
	localStorage.setItem('carrito',JSON.stringify(carrito));
	localStorage.setItem('productos',JSON.stringify(productos));
	
	pintarCarrito();
	actualizarTotalProdCard(e);
	//
	//
}
const eliminarDelCarrito = (e) => {
	const selectedID = e.target.dataset.pid;
	const carritoSelect = carrito.filter((item) => item.getPid() === selectedID);
	const stockAdevolver = carritoSelect[0].getStock();
	
	productos.map((item)=> {if(item.pid == selectedID)
		item.stock += stockAdevolver;
	})
	carrito = carrito.filter((item)=> item.getPid() !== selectedID);
	localStorage.setItem('carrito',JSON.stringify(carrito));
	localStorage.setItem('productos',JSON.stringify(productos));
	pintarCarrito();
	cargarProductosAIndex();
}
// INICIO DE API
document.addEventListener('DOMContentLoaded', async () => {
	await actualizarPID();
	await cargarStorageProductos();
	await cargarProductosAIndex();
});

document.addEventListener('click', async (e) => {
	if (e.target.matches('#close-Cart')) {
		toggleCart();
	}
	if (e.target.matches('#cartLogo')) {
		toggleCart();
	}
	if (e.target.matches('#agregarCarrito')) {
		añadirProductosAlCarrito(e);
		cargarProductosAIndex();
		toggleCart();
	}
	if (e.target.matches('#prod-cantidadMenos')) {
		restProd(e);
	}
	if (e.target.matches('#prod-cantidadMas')) {
		sumProd(e);
	}
	if (e.target.matches('#cart-cantidadMas')) {
	}
	if(e.target.matches('#cartbtn-eliminar')){
		eliminarDelCarrito(e);

	}
});
