import {crearProductoNuevo, pintarProductosAIndex } from './producto.js';
import Producto from '../models/Producto.js';
import StorageService from '../utils/storage.js';

let productos = [];
let carrito = [];
let usuario = [];

// Cargar datos del localStorage
const cargarDatos = () => {
    const productosData = StorageService.getItem('productos') || [];
    const carritoData = StorageService.getItem('carrito') || [];
    usuario = StorageService.getItem('usuario') || [];

	// convertir los datos planos en instancias de Producto
	if(productosData.length !== 0){
		productos = productosData.map(item =>{ 
			const prod = new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
			prod.setPid = item.pid; 
			return prod;
		});
	}else productos = productosData;

	if(carritoData.length !== 0){
		carrito = carritoData.map(item =>{ 
			const prod = new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
			prod.setPid = item.pid; 
			return prod;
		});
	}else carrito = carritoData;
};

const cargarBarraBuscador = () => {
	cargarDatos();
	const searchInput = document.getElementById('search-input');
	searchInput.addEventListener('input', () => {
		const palabraBuscada = searchInput.value.trim().toLowerCase();
		const productosFiltrados = productos.filter((prod) => {
			const Nombre = prod.getNombre.toLowerCase();
			const Marca = prod.getMarca.toLowerCase();
			return ( Nombre.includes(palabraBuscada) || Marca.includes(palabraBuscada) );
		});
		
		StorageService.setItem('productos',productosFiltrados);	
		pintarProductosAIndex();
	});
};

export { cargarBarraBuscador };