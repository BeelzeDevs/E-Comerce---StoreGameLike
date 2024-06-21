
import datos from '../connection/connect.js';
import Usuario from '../models/Usuario.js'
import Producto from '../models/Producto.js';
import {cargarUsuarios} from '../services/usuario.js';

import { cargarCarrito} from '../services/carrito.js';
import { cargarStorageProductos} from '../services/producto.js';
import {cargarCategorias} from '../services/categorias.js';
import {cargarBarraBuscador} from '../services/barraBuscador.js';

class StorageService {
    productos = [];
    usuario = [];
    carrito = [];
    static getItem(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
            return JSON.parse(item);
        }catch (error) {
            console.error(`Error getting item ${key} from localStorage`, error);
            return null;
        }
    }

    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key} to localStorage`, error);
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage`, error);
        }
    }

    static resetStorage() {
        try {
            this.removeItem('carrito');
            this.removeItem('productos');
            this.removeItem('usuario');
            this.initializeStorage();
        } catch (error) {
            console.error('Error resetting localStorage', error);
        }
    }

    static async initializeStorage(){
        const cargarDatos = () =>{
            const productosData = StorageService.getItem('productos') || [];
            const carritoData = StorageService.getItem('carrito') || [];
            const usuarioData = StorageService.getItem('usuario') || [];
            
            if(productosData.length !== 0){
                this.productos = productosData.map(item =>{ 
                    const prod = new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
                    prod.setPid = item.pid; 
                    return prod;
                });
            }else this.productos = productosData;
        
            if(carritoData.length !== 0){
                this.carrito = carritoData.map(item =>{ 
                    const prod = new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio); 
                    prod.setPid = item.pid; 
                    return prod;
                });
            }else this.carrito = carritoData;
        
            if(usuarioData.length !== 0){
                this.usuario = usuarioData.map(item=>{
                    const user = new Usuario ();
                    return user;
                });
            }else this.usuario = usuarioData;
        }
        cargarDatos();
	    await cargarStorageProductos();
	    cargarUsuarios();
	    cargarCarrito();
	    cargarCategorias();
	    cargarBarraBuscador();
        

    }
}

export default StorageService;