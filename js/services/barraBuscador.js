import {crearProductoNuevo, pintarProductosAIndex } from './producto.js';
import StorageService from '../utils/storage.js';

let productos = [];
let carrito = [];
let usuario = [];

// Cargar datos del localStorage
const cargarDatos = () => {
    productos = StorageService.getItem('productos') || [];
    carrito = StorageService.getItem('carrito') || [];
    usuario = StorageService.getItem('usuario') || [];
};

const cargarBarraBuscador = () => {
	cargarDatos();
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

export { cargarBarraBuscador };