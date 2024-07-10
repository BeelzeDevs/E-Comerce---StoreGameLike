import StorageService from './utils/storage.js';

import { sumProd,restProd,añadirProductosAlCarrito} from './services/producto.js';
import {
    eliminarDelCarrito,
    vaciarCarrito,
    comprarCarrito,
    sumProdCarrito,
    restProdCarrito,
    toggleCart   
} from './services/carrito.js';



// INICIO DE API
document.addEventListener('DOMContentLoaded', async () => {
	StorageService.initializeStorage();
});

document.addEventListener('click', async (e) => {
	if (e.target.matches('#close-Cart')) {
		toggleCart();
	}
	if (e.target.matches('#cartLogo')) {
		toggleCart();
	}
	if (e.target.matches('.agregarCarrito')) {
		añadirProductosAlCarrito(e);
		
	}
	if (e.target.matches('.prod-cantidadMenos')) {
		restProd(e);
	}
	if (e.target.matches('.prod-cantidadMas')) {
		sumProd(e);
	}
	if (e.target.matches('.cartbtn-eliminar')) {
		eliminarDelCarrito(e);
	}
	if (e.target.matches('#cart-empty')) {
		vaciarCarrito();
	}
	if (e.target.matches('#cart-buy')) {
		comprarCarrito();
	}
	if (e.target.matches('.cart-cantidadMas')) {
		sumProdCarrito(e);
	}
	if (e.target.matches('.cart-cantidadMenos')) {
		restProdCarrito(e);
	}
	if (e.target.matches('#btnReinicio')) {
		StorageService.resetStorage();
	}
});


