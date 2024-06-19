import {datos} from './connection/connect.js';
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


const reinicioTotal = async () => {
	localStorage.removeItem('carrito');
	localStorage.removeItem('productos');
	localStorage.removeItem('usuario');
	
	const datos1 = await datos();
	localStorage.setItem('productos', JSON.stringify(datos1.productos));
	let productos = [...datos1.productos];
	const usuario = new Usuario();
	localStorage.setItem('usuario', JSON.stringify(usuario));
	let carrito = [];
	localStorage.setItem('carrito', JSON.stringify(carrito));
	pintarCarrito();
	cargarStorageProductos();
};

const cargarBarraBuscador = () => {
	const searchInput = document.getElementById('search-input');
	searchInput.addEventListener('input', () => {
		const palabraBuscada = searchInput.value.toLowerCase();
		let coincidencias = [];
		productos.forEach((prod) => {
			if (
				prod.nombre.toLowerCase().includes(palabraBuscada) ||
				prod.marca.toLowerCase().includes(palabraBuscada)
			) {
				coincidencias.push(prod.pid);
			}
		});

		if (coincidencias[0] === undefined) {
			pintarProductosAIndex();
		} else {
			const productCardContainer = document.getElementById(
				'productsCardContainer'
			);
			const fragment = document.createDocumentFragment();
			productCardContainer.innerHTML = '';

			productos.forEach((item) => {
				if (coincidencias.includes(item.pid)) {
					crearProductoNuevo(fragment, item);
				}
			});
			productCardContainer.appendChild(fragment);
		}
	});
};
// INICIO DE API
document.addEventListener('DOMContentLoaded', async () => {
	await actualizarPID();
	await cargarStorageProductos();
	await pintarProductosAIndex();

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
		reinicioTotal();
	}
});


