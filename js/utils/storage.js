
import datos from '../connection/connect.js';
import Usuario from '../models/Usuario.js'
import Producto from '../models/Producto.js';

import { pintarCarrito , cargarCarrito} from '../services/carrito.js';
import { cargarStorageProductos} from '../services/producto.js';

class StorageService {
    
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

    static async initializeStorage() {
        try {
            const datos1 = await datos();
            const productosData = datos1.productos;
            const productos = productosData.map((item)=>{
                const prod = new Producto(item.nombre, item.marca, item.categoria, item.precio, item.stock, item.img, item.envio);
                prod.setPid = item.pid;
                return prod;
            })
            this.setItem('productos',productos);
            const usuario = new Usuario();
            this.setItem('usuario', usuario);
            this.setItem('carrito', []);
            pintarCarrito();
            await cargarStorageProductos();
            cargarCarrito();
        } catch (error) {
            console.error('Error initializing localStorage', error);
        }
        
    }
    
}

export default StorageService;