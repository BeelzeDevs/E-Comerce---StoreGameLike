import StorageService from '../utils/storage.js';
import Producto from '../models/Producto.js';
import { pintarProductosAIndex } from './producto.js';

let productos = [];
let carrito = [];
let usuario = [];

const cargarDatos = () =>{
	const productosData = StorageService.getItem('productos') || [];
    const carritoData = StorageService.getItem('carrito') || [];
    usuario = StorageService.getItem('usuario') || [];

	if(productosData.length !== 0){
		productos = productosData.map(item =>{ 
			new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
			item.setPid = item.pid; 
			return item;
		});
	}else productos = productosData;
	
	if(carritoData.length !== 0){
		carrito = carritoData.map(item =>{ 
			new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
			item.setPid = item.pid; 
			return item;
		});
	}else carrito = carritoData;
}
const cargarCategorias = () => {
    cargarDatos();
	const categoriasIndex = document.getElementById('category-select');
	const categoriasUnicas = new Set(); // solo permite valores únicos
	productos.forEach((producto) => categoriasUnicas.add(producto.categoria));
	const arrayCategorias = Array.from(categoriasUnicas);
	// limpio el inner
	categoriasIndex.innerHTML = '';
	// primer elemento desactivado
	const categoriaNueva = document.createElement('option');
	categoriaNueva.value = '';
	categoriaNueva.textContent = '--';
	categoriaNueva.disabled = true;
	categoriaNueva.selected = true;
	categoriasIndex.appendChild(categoriaNueva);

	arrayCategorias.forEach((cat) => {
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

	categoriasIndex.addEventListener('change', () => {
		switch (categoriasIndex.value) {
			case 'Bebidas':
				productos.sort((a, b) => {
					if (a.categoria === 'Bebidas' && b.categoria !== 'Bebidas') {
						return -1; // a esta antes que b
					} else if (a.categoria !== 'Bebidas' && b.categoria === 'Bebidas') {
						return 1; // b esta antes que a
					} else {
						return 0; // ambos son 'Bebidas'
					}
				});
				StorageService.setItem('productos',productos);
				pintarProductosAIndex();
				break;
			case 'Comestibles':
				productos.sort((a, b) => {
					if (a.categoria === 'Comestibles' && b.categoria !== 'Comestibles') {
						return -1;
					} else if (
						a.categoria !== 'Comestibles' &&
						b.categoria === 'Comestibles'
					) {
						return 1;
					} else {
						return 0;
					}
				});
				StorageService.setItem('productos',productos);
				pintarProductosAIndex();
				break;
			case 'Limpieza':
				productos.sort((a, b) => {
					if (a.categoria === 'Limpieza' && b.categoria !== 'Limpieza') {
						return -1;
					} else if (a.categoria !== 'Limpieza' && b.categoria === 'Limpieza') {
						return 1;
					} else {
						return 0;
					}
				});
				StorageService.setItem('productos',productos);
				pintarProductosAIndex();
				break;
			case 'Marca asc':
				productos.sort((a, b) => {
					if (a.marca < b.marca) {
						return -1;
					} else if (a.marca > b.marca) {
						return 1;
					} else {
						return 0;
					}
				});
				StorageService.setItem('productos',productos);
				pintarProductosAIndex();
				break;
			case 'Marca desc':
				productos.sort((a, b) => {
					if (a.marca > b.marca) {
						return -1;
					} else if (a.marca < b.marca) {
						return 1;
					} else {
						return 0;
					}
				});
				StorageService.setItem('productos',productos);
				pintarProductosAIndex();
				break;
		}
	});
};

export {cargarCategorias};