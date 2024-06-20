import StorageService from './utils/storage.js';

import { datos } from './connection/connect.js';
import { Producto } from './models/Producto.js';
import { Usuario } from './models/Usuario.js';
import {cargarCategorias} from './services/categorias.js';
import { cargarUsuarios} from './services/usuario.js';
import { 
	cargarStorageProductos,
    crearProductoNuevo,
    pintarProductosAIndex,
    sumProd,
    restProd,
    añadirProductosAlCarrito
} from './services/producto.js';
import {
	cargarCarrito,
    pintarCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    comprarCarrito,
    sumProdCarrito,
    restProdCarrito,
    toggleCart   
} from './services/carrito.js';
import {cargarBarraBuscador } from './services/barraBuscador.js';

// Si no existen en localStorage, los inicializa.

let productos = [];
let carrito = [];
let usuario = [];

const cargarDatos = () =>{
	if (!StorageService.getItem('usuario')) {
		StorageService.setItem('usuario', []);
		usuario = StorageService.getItem('usuario');
		
	}
	if (!StorageService.getItem('productos')) {
		StorageService.setItem('productos', []);
		productos = StorageService.getItem('productos');
	}
	if (!StorageService.getItem('carrito')) {
		StorageService.setItem('carrito', []);
		carrito = StorageService.getItem('carrito');
	}
}
    

const actualizarPID = async () => {
	try {
		const datos1 = await datos();
		//funcion max
		const max = (listProducts) => {
			if (!listProducts.length) return 0;
			return Math.max(...listProducts.map((product) => product.pid));
		};
		Producto.contadorID = max(datos1.productos);
	} catch (error) {
		console.error('Error función datos()', error);
	}
};




// INICIO DE API
document.addEventListener('DOMContentLoaded', async () => {
	cargarDatos();
	await actualizarPID();
	await cargarStorageProductos();
	cargarUsuarios();
	cargarCarrito();
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
	if (e.target.matches('#cartbtn-eliminar')) {
		eliminarDelCarrito(e);
	}
	if (e.target.matches('#cart-empty')) {
		vaciarCarrito();
	}
	if (e.target.matches('#cart-buy')) {
		comprarCarrito();
	}
	if (e.target.matches('#cart-cantidadMas')) {
		sumProdCarrito(e);
	}
	if (e.target.matches('#cart-cantidadMenos')) {
		restProdCarrito(e);
	}
	if (e.target.matches('#btnReinicio')) {
		StorageService.resetStorage();
	}
});


