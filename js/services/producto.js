import StorageService from '../utils/storage.js';

import {datos} from '../connection/connect.js';
import {Producto} from '../models/Producto.js';
import { cargarCarrito } from './carrito.js';
import {formatearNumbero,formatearNumbero2Decimales} from './formatNumbers.js';


let productos = [];
let carrito = [];
let usuario = [];
// Cargar datos del localStorage
const cargarDatos = () => {
    productos = StorageService.getItem('productos') || [];
    carrito = StorageService.getItem('carrito') || [];
    usuario = StorageService.getItem('usuario') || [];
};


const cargarStorageProductos = async () => {
	cargarDatos();
	if (productos.length !== 0) {
		const productosData = StorageService.getItem('productos');
		productos = productosData.map((item) => {
			const prod = new Producto(
				item.nombre,
				item.marca,
				item.categoria,
				item.precio,
				item.stock,
				item.img,
				item.envio
			);
			prod.setPid(item.pid);
			return prod;
		});
		await pintarProductosAIndex();
	} else {
		try {
			const datos1 = await datos();
			StorageService.setItem('productos', datos1.productos);
			productos = [...datos1.productos];
			await pintarProductosAIndex();
		} catch (error) {
			console.error('Error función datos()', error);
		}
	}
};


const crearProductoNuevo = (fragment, product) => {
	const productsCardContainer = document.getElementById(
		'productsCardContainer'
	);
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
	const cantidadAcomprar = clone.querySelector('#cantidadAcomprar');
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
	cantidadAcomprar.style.backgroundColor = 'black';
	if (product.stock === 0) {
		cantidadAcomprar.textContent = 0;
		cantidadAcomprar.style.color = 'red';
	}
	const totalCompra = parseFloat(
		product.precio * parseInt(cantidadAcomprar.textContent)
	);
	total.textContent = formatearNumbero(totalCompra);
	// Producto agregado al fragmento
	fragment.appendChild(clone);
};

const pintarProductosAIndex = async () => {
	const productsCardContainer = document.getElementById(
		'productsCardContainer'
	);
	const fragment = document.createDocumentFragment();
	// vacio el contenedor de productos
	productsCardContainer.innerHTML = '';
	// actualizo los productos

	productos.forEach((item) => {
		crearProductoNuevo(fragment, item);
	});

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
	else {
		span.textContent = 0;
	}
	actualizarTotalProdCard(e);
};

const añadirProductosAlCarrito = async (e) => {
    
	const dataID = e.target.getAttribute('data-pid');
	const selecProdIndex = productos.findIndex((item) => item.pid == dataID);
	const selecProd = productos[selecProdIndex];
	const cantidadAcomprar = parseInt(
		document.querySelector(`#cantidadAcomprar[data-pid="${dataID}"]`)
			.textContent
	);
	if (cantidadAcomprar != 0) {
		// reduzco stock del array
		productos[selecProdIndex].stock -= cantidadAcomprar;

		// Creo un Producto. Si no existe lo agrego al carrito. si existe, le sumo el stock pedido.
		const productoAagregar = new Producto(
			selecProd.nombre,
			selecProd.marca,
			selecProd.categoria,
			selecProd.precio,
			cantidadAcomprar,
			selecProd.img
		);
		productoAagregar.setPid(dataID);
		const existeEncarrito = carrito.findIndex(
			(item) => item.getPid() == dataID
		);

		if (existeEncarrito === -1) {
			carrito.push(productoAagregar);
		} else {
			const stockPedidoAnt = carrito[existeEncarrito].getStock();
			carrito[existeEncarrito].setStock( stockPedidoAnt + cantidadAcomprar);
		}
		StorageService.setItem('carrito', carrito);
		StorageService.setItem('productos', productos);

		cargarCarrito();
		actualizarTotalProdCard(e);
		pintarProductosAIndex();
	}
};

export {
    cargarStorageProductos,
    crearProductoNuevo,
    pintarProductosAIndex,
    actualizarTotalProdCard,
    sumProd,
    restProd,
    añadirProductosAlCarrito

}