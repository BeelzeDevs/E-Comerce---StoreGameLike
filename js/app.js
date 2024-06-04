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
	envio;
	constructor(nombre, marca,categoria, precio, stock, img, envio=0) {
		Producto.contadorID += 1;
		this.pid = Producto.contadorID;
		this.nombre = nombre;
		this.categoria = categoria;
		this.marca = marca;
		this.precio = parseFloat(precio).toFixed(2);
		this.stock = stock;
		this.img = img;
		this.envio = envio;
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
	setEnvio(envio) {
		this.envio=parseFloat(envio).toFixed(2);
	}
	getEnvio() {
		return this.envio;
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
		return parseFloat(this.precio).toFixed(2);
	}
	setPrecio(p) {
		this.precio = parseFloat(p).toFixed(2);
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
class Usuario  {
	saldoCuenta;
	constructor(dinero=1000000.00){
		this.saldoCuenta = parseFloat(dinero).toFixed(2);
	}
	getSaldoCuenta(){
		return parseFloat(this.saldoCuenta).toFixed(2);
	}
	setSaldoCuenta(dinero){
		this.saldoCuenta = parseFloat(dinero).toFixed(2);
	}
	sumarSaldoCuenta(dinero){
		this.saldoCuenta += parseFloat(dinero).toFixed(2);
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
const cargarUsuarios = () =>{
	const usuario = new Usuario();
	localStorage.setItem('usuario',JSON.stringify(usuario));
}
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
const crearProductoNuevo = (fragment,product) =>{
	const productsCardContainer = document.getElementById('productsCardContainer');
	const templateProdCard = document.getElementById('template-productCard');
	// vacio el contenedor de productos
	productsCardContainer.innerHTML = '';
	// actualizo los productos

	const clone = templateProdCard.content.cloneNode(true);
		
	// Producto Nuevo
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

		// Producto - dataset pid
	precioxunidad.dataset.pid = product.pid;
	cantidadAcomprar.dataset.pid = product.pid;
	cantidadMenos.dataset.pid = product.pid;
	cantidadMas.dataset.pid = product.pid;
	total.dataset.pid = product.pid;
	productCard.dataset.pid = product.pid;
	btnAddCart.dataset.pid = product.pid;

		// Producto - textcontent
	nombre.textContent = product.nombre;
	brand.textContent = product.marca;
	stock.textContent = 'stock: ' + product.stock;
	img.src = product.img;
	categoria.textContent = product.categoria;
	precioxunidad.textContent = parseFloat(product.precio).toFixed(2);
	
	cantidadAcomprar.textContent = 1;
	cantidadAcomprar.style.backgroundColor='black';
	if(product.stock === 0){ 
		cantidadAcomprar.textContent = 0;
		cantidadAcomprar.style.color = 'red';
	}
	const totalCompra = parseFloat(product.precio * parseInt(cantidadAcomprar.textContent));
	total.textContent = formatearNumbero(totalCompra);
		// Producto agregado al fragmento
	fragment.appendChild(clone);
	
}
const cargarProductosAIndex = async () => {
	const productsCardContainer = document.getElementById('productsCardContainer');
	const fragment = document.createDocumentFragment();
	// vacio el contenedor de productos
	productsCardContainer.innerHTML = '';
	// actualizo los productos

	productos.forEach((item) => {
		crearProductoNuevo(fragment,item);
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
	
	const totalCompra = parseFloat(cantidad * precioXunidad);
	totalCard.textContent = formatearNumbero(totalCompra);
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


const actualizarUnidadesCarritoIndex = () =>{
	const logoUnidades = document.querySelector('#cart-units');
	const cantidad = carrito.reduce((acc)=> acc += 1, 0);
	logoUnidades.textContent = parseInt(cantidad);

}
const actualizarTotalAlCarrito = ()=>{

	const totalPriceCart = document.querySelector('#total-price');
	const totalEnvCart = document.querySelector('#total-env');
	const cartTotal = document.querySelector('#cart-total');
	const carritoUserSaldo = document.querySelector('#carrito-saldoUsuario');
	const carritoSaldoRestanteAlComprar = document.querySelector('#carrito-saldoRestanteAlComprar');
	const cartTotalPage = document.querySelector('#cart-total-index');
	// calculo
	SumaTotalPrecios = parseFloat(carrito.reduce((acc,item)=> {return acc += (item.getPrecio() * item.getStock())},0));
	SumaTotalEnvios = carrito.reduce((acc,item)=> { return acc += item.getEnvio()},0);
	// texcontent
	const saldoUsuario = parseFloat(JSON.parse(localStorage.getItem('usuario')).saldoCuenta);
	const SumaTotalCarrito = parseFloat(SumaTotalEnvios + SumaTotalPrecios);
	const CuentaSaldoRestante = parseFloat(saldoUsuario - SumaTotalCarrito);
	totalPriceCart.textContent = "$" + formatearNumbero2Decimales(SumaTotalPrecios);
	totalEnvCart.textContent = "$" + formatearNumbero2Decimales(SumaTotalEnvios);
	cartTotal.textContent = "$" + formatearNumbero2Decimales(SumaTotalCarrito);
	carritoUserSaldo.textContent = "$" + formatearNumbero2Decimales(saldoUsuario);
	carritoSaldoRestanteAlComprar.textContent = '$' + formatearNumbero2Decimales(CuentaSaldoRestante);
	cartTotalPage.textContent = "$" + formatearNumbero2Decimales(parseFloat(SumaTotalEnvios + SumaTotalPrecios));
	actualizarUnidadesCarritoIndex();

}
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
		//dataset id
		botonMas.dataset.pid = item.getPid();
		botonMenos.dataset.pid = item.getPid();
		cartProductTotal.dataset.pid = item.getPid();
		cantidadAcomprarCarrito.dataset.pid = item.getPid();
		cartBtnEliminar.dataset.pid = item.getPid();
		precioEnvioCarrito.dataset.pid = item.getPid();

		// textcontent
		productName.textContent = item.getMarca() + " - " + item.getNombre() ;
		cantidadAcomprarCarrito.textContent = item.getStock();
		precioXunidadCarrito.textContent = "$" + formatearNumbero2Decimales(parseFloat(item.getPrecio()));
		precioEnvioCarrito.textContent = 0;
		cartProductTotal.textContent = "$" + formatearNumbero2Decimales(parseFloat(item.getStock() * item.getPrecio()));
		cartProductTotal.appendChild(cartBtnEliminar);

		fragment.appendChild(clone);
	})
	cartProducts.appendChild(fragment);
	actualizarTotalAlCarrito();
}
const añadirProductosAlCarrito = async (e) =>{
	
	const dataID = e.target.getAttribute('data-pid');
	const selecProdIndex = productos.findIndex((item) => item.pid == dataID);
	const selecProd = productos[selecProdIndex];
	const cantidadAcomprar = parseInt(document.querySelector(`#cantidadAcomprar[data-pid="${dataID}"]`).textContent);
	if(cantidadAcomprar != 0 ){
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
		cargarProductosAIndex();
	}	
	
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
const vaciarCarrito = () =>{
	carrito.map((item)=>{
		productos.map((product) =>
			{
				if(product.pid == item.getPid()){
					return product.stock += item.getStock();
				}
			});
			return;
	});
	carrito = [];
	localStorage.setItem('carrito', JSON.stringify(carrito));
	pintarCarrito();
	cargarProductosAIndex();

}
const comprarCarrito = () =>{
	const errorSaldoInsuficiente = document.getElementById('error-saldoInsuficiente');
	const user = JSON.parse(localStorage.getItem('usuario'));
	const cartTotal = document.querySelector('#cart-total').textContent.slice(1).replace(/,/g, '');
	const saldoCuenta = user.saldoCuenta;
	const total = saldoCuenta - cartTotal;
	if(total >= 0 ){
		errorSaldoInsuficiente.classList.add('d-none');
		user.saldoCuenta = total;
		carrito = [];
		localStorage.setItem('usuario',JSON.stringify(user));
		localStorage.setItem('carrito',JSON.stringify(carrito));
		pintarCarrito();
		cargarProductosAIndex();
	}else{
		const parpadeo = 200;
		let oculto = true;
	
		const intervalo = setInterval(()=>{
			if (oculto) {
                errorSaldoInsuficiente.classList.remove('d-none');
				errorSaldoInsuficiente.style.color ='red';
				errorSaldoInsuficiente.style.fontWeight = 600;
            } else {
                errorSaldoInsuficiente.classList.add('d-none');
            }
            oculto = !oculto;
		}, parpadeo);
		setTimeout(()=>{
			clearInterval(intervalo);
			errorSaldoInsuficiente.classList.add('d-none');
		},2000);
	}
}
const sumProdCarrito = (e)=>{
	const dataID = e.target.getAttribute('data-pid');
	const producto = productos.filter((item)=> item.pid == dataID);
	const productoIndex = productos.findIndex((item)=> item.pid == dataID);
	console.log(dataID);
	carrito.map((item)=> {
		if(item.getPid() == dataID && productos[productoIndex].stock-1 >= 0){
			item.setStock(item.getStock()+1);
			productos[productoIndex].stock -= 1;
		}
	});
	localStorage.setItem('producto',JSON.stringify(producto));
	localStorage.setItem('carrito',JSON.stringify(carrito));
	actualizarTotalAlCarrito();
	pintarCarrito();
	cargarProductosAIndex();

};
const restProdCarrito = (e)=>{
	const dataID = e.target.getAttribute('data-pid');
	const producto = productos.filter((item)=> item.pid == dataID);
	const productoIndex = productos.findIndex((item)=> item.pid == dataID);
	console.log(dataID,producto,productoIndex);
	carrito.map((item)=>{
		if(item.getPid() == dataID && item.getStock()-1 > 0){
			item.setStock(item.getStock() -1);
			productos[productoIndex].stock += 1;
		}
	})
	localStorage.setItem('producto',JSON.stringify(producto));
	localStorage.setItem('carrito',JSON.stringify(carrito));
	actualizarTotalAlCarrito();
	pintarCarrito();
	cargarProductosAIndex();
};
const cargarCategorias = ()=>{
	const categoriasIndex = document.getElementById('category-select');
	const categoriasUnicas = new Set(); // solo permite valores únicos
	productos.forEach((producto)=> categoriasUnicas.add(producto.categoria));
	const arrayCategorias = Array.from(categoriasUnicas);
	// primer elemento desactivado
	const categoriaNueva = document.createElement('option');
	categoriaNueva.value = '';
	categoriaNueva.textContent = '--';
	categoriaNueva.disabled = true;
	categoriaNueva.selected = true;
	categoriasIndex.appendChild(categoriaNueva);
	
	arrayCategorias.forEach((cat)=>{
		const categoriaNueva = document.createElement('option');
		categoriaNueva.value = cat;
		categoriaNueva.textContent = cat;
		categoriasIndex.appendChild(categoriaNueva);
	});
	const categoriaMarcaAsc = document.createElement('option');
	categoriaMarcaAsc.textContent = 'Marca ascendente';
	categoriaMarcaAsc.value = 'Marca asc';
	categoriasIndex.appendChild(categoriaMarcaAsc);
	const categoriaMarcaDesc = document.createElement('option');
	categoriaMarcaDesc.textContent = 'Marca descendente';
	categoriaMarcaDesc.value = 'Marca desc';
	categoriasIndex.appendChild(categoriaMarcaDesc);

	categoriasIndex.addEventListener('change',()=>{
		switch (categoriasIndex.value) {
			case 'Bebidas':
					productos.sort((a,b)=>{
						if( a.categoria === 'Bebidas' && b.categoria !== 'Bebidas'){
							return -1; // a esta antes que b
						}
						else if (a.categoria !== 'Bebidas' && b.categoria === 'Bebidas'){
							return 1; // b esta antes que a
						}else{
							return 0; // ambos son 'Bebidas'
						}
					});
					cargarProductosAIndex();
				break;
			case 'Comestibles':
					productos.sort((a,b)=>{
						if(a.categoria === 'Comestibles' && b.categoria !== 'Comestibles'){
							return -1;
						}else if(a.categoria !== 'Comestibles' && b.categoria === 'Comestibles'){
							return 1;
						}else{
							return 0;
						}
					})
					cargarProductosAIndex();
				break;
			case 'Limpieza':
					productos.sort((a,b)=>{
						if(a.categoria === 'Limpieza' && b.categoria !== 'Limpieza'){
							return -1;
						}else if(a.categoria !== 'Limpieza' && b.categoria === 'Limpieza'){
							return 1;
						}else{
							return 0;
						}
					});
					cargarProductosAIndex();
				break;
				case 'Marca asc':
						productos.sort((a,b)=>{
							if(a.marca < b.marca){
								return -1;
							}else if(a.marca > b.marca){
								return 1;
							}else{
								return 0;
							}
						});
						cargarProductosAIndex();
					break;
				case 'Marca desc':
						productos.sort((a,b)=>{
							if(a.marca > b.marca){
								return -1;
							}else if(a.marca < b.marca){
								return 1;
							}else{
								return 0;
							}
						});
						cargarProductosAIndex();
					break;
		}
	})
};
const cargarBarraBuscador = () =>{
	const searchInput = document.getElementById('search-input');
	searchInput.addEventListener('input',()=>{
		const palabraBuscada = searchInput.value.toLowerCase();
		let coincidencias = [];
		productos.forEach((prod)=>{
			if(prod.nombre.toLowerCase().includes(palabraBuscada) || prod.marca.toLowerCase().includes(palabraBuscada)){
				coincidencias.push(prod.pid);
			}
		});
		console.log(palabraBuscada,coincidencias);
		
		if(coincidencias[0] === undefined){
			console.log('entro');
			cargarProductosAIndex();
		}else{
			const productCardContainer = document.getElementById('productsCardContainer');
			const fragment = document.createDocumentFragment();
			productCardContainer.innerHTML = '';

			productos.forEach((item)=>{
				 if(coincidencias.includes(item.pid)){
					crearProductoNuevo(fragment,item);
				 }
			});
			productCardContainer.appendChild(fragment);
		}
			
	});
}
// INICIO DE API
document.addEventListener('DOMContentLoaded', async () => {
	await actualizarPID();
	await cargarStorageProductos();
	await cargarProductosAIndex();
	cargarUsuarios();
	actualizarTotalAlCarrito();
	cargarCategorias();
	cargarBarraBuscador();
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
	}
	if (e.target.matches('#prod-cantidadMenos')) {
		restProd(e);
	}
	if (e.target.matches('#prod-cantidadMas')) {
		sumProd(e);
	}
	if(e.target.matches('#cartbtn-eliminar')){
		eliminarDelCarrito(e);
	}
	if(e.target.matches('#cart-empty')){
		vaciarCarrito();
	}
	if(e.target.matches('#cart-buy')){
		comprarCarrito();
	}
	if (e.target.matches('#cart-cantidadMas')) {
		sumProdCarrito(e);
	}
	if (e.target.matches('#cart-cantidadMenos')) {
		restProdCarrito(e);
	}
});


function formatearNumbero (num) {
	let parts = num.toFixed(1).split('.');
    // Convierte el número el número a una cadena utilizando toLocaleString, Formateandor la parte entera del número
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-ES');
    // Une las partes y deuelve el número formateado
    return parts.join('.');
};
function formatearNumbero2Decimales (num) {
	let parts = num.toFixed(2).split('.');
    // Convierte el número el número a una cadena utilizando toLocaleString, Formateandor la parte entera del número
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-ES');
    // Une las partes y deuelve el número formateado
    return parts.join('.');
};