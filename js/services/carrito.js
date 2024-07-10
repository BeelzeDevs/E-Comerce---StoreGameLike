import StorageService from '../utils/storage.js';
import Producto from '../models/Producto.js';

import {pintarProductosAIndex} from './producto.js';
import {formatearNumbero2Decimales} from './formatNumbers.js';


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

const cargarCarrito = () => {
	cargarDatos();
	if (carrito.length !== 0) {
		const carritoData = StorageService.getItem('carrito');
		carrito = carritoData.map((item) => {
			const prod = new Producto(
				item.nombre,
				item.marca,
				item.categoria,
				item.precio,
				item.stock,
				item.img,
				item.envio
			);
			prod.setPid = item.pid;
			return prod;
		});
	}else {
			carrito = [];
			StorageService.setItem('carrito',carrito);
			
	}
	
	pintarCarrito();
};

const actualizarTotalAlCarrito = () => {
	const totalPriceCart = document.querySelector('#total-price');
	const totalEnvCart = document.querySelector('#total-env');
	const cartTotal = document.querySelector('#cart-total');
	const carritoUserSaldo = document.querySelector('#carrito-saldoUsuario');
	const carritoSaldoRestanteAlComprar = document.querySelector(
		'#carrito-saldoRestanteAlComprar'
	);
	const cartTotalPage = document.querySelector('#cart-total-index');
	// calculo
	const SumaTotalPrecios = parseFloat(
		carrito.reduce((acc, item) => {
			return (acc += item.getPrecio * item.getStock);
		}, 0)
	);
	const SumaTotalEnvios = carrito.reduce((acc, item) => {
		return (acc += item.getEnvio);
	}, 0);
	// texcontent
    
	const saldoUsuario = parseFloat(
		usuario[0].saldoCuenta
	);

	const SumaTotalCarrito = parseFloat(SumaTotalEnvios + SumaTotalPrecios);
	const CuentaSaldoRestante = parseFloat(saldoUsuario - SumaTotalCarrito);
	totalPriceCart.textContent =
		'$' + formatearNumbero2Decimales(SumaTotalPrecios);
	totalEnvCart.textContent = '$' + formatearNumbero2Decimales(SumaTotalEnvios);
	cartTotal.textContent = '$' + formatearNumbero2Decimales(SumaTotalCarrito);
	carritoUserSaldo.textContent = '$' + formatearNumbero2Decimales(saldoUsuario);
	carritoSaldoRestanteAlComprar.textContent =
		'$' + formatearNumbero2Decimales(CuentaSaldoRestante);
	cartTotalPage.textContent =
		'$' +
		formatearNumbero2Decimales(parseFloat(SumaTotalEnvios + SumaTotalPrecios));
	// estilo dinámico del Saldo Restante 
	if(CuentaSaldoRestante < 0) carritoSaldoRestanteAlComprar.style.color = 'Red';
	else carritoSaldoRestanteAlComprar.style.color = 'mediumspringgreen';

	actualizarUnidadesCarritoIndex();
};

const pintarCarrito = () => {
	const fragment = document.createDocumentFragment();
	const templateCart = document.querySelector('#template-cartProduct');
	const cartProducts = document.querySelector('#cart-products');
	cartProducts.innerHTML = '';
	carrito.forEach((item) => {
		const clone = templateCart.content.cloneNode(true);
		const productName = clone.querySelector('.product-name');
		const cantidadAcomprarCarrito = clone.querySelector(
			'.cantidadAcomprarCarrito'
		);
		const botonMenos = clone.querySelector('.cart-cantidadMenos');
		const botonMas = clone.querySelector('.cart-cantidadMas');
		const precioXunidadCarrito = clone.querySelector('.precioXunidadCarrito');
		const precioEnvioCarrito = clone.querySelector('.precioEnvioCarrito');
		const cartProductTotal = clone.querySelector('.cartProduct-total');
		const cartBtnEliminar = clone.querySelector('.cartbtn-eliminar');
		//dataset id
		botonMas.dataset.pid = item.getPid;
		botonMenos.dataset.pid = item.getPid;
		cartProductTotal.dataset.pid = item.getPid;
		cantidadAcomprarCarrito.dataset.pid = item.getPid;
		cartBtnEliminar.dataset.pid = item.getPid;
		precioEnvioCarrito.dataset.pid = item.getPid;

		// textcontent
		productName.textContent = item.getMarca + ' - ' + item.getNombre;
		cantidadAcomprarCarrito.textContent = item.getStock;
		precioXunidadCarrito.textContent =
			'$' + formatearNumbero2Decimales(parseFloat(item.getPrecio));
		precioEnvioCarrito.textContent = 0;
		cartProductTotal.textContent =
			'$' +
			formatearNumbero2Decimales(
				parseFloat(item.getStock * item.getPrecio)
			);
		cartProductTotal.appendChild(cartBtnEliminar);

		fragment.appendChild(clone);
	});
	cartProducts.appendChild(fragment);
	actualizarTotalAlCarrito();
};

const eliminarDelCarrito = (e) => {
	const selectedID = parseInt(e.target.dataset.pid);
	const carritoIndex = carrito.findIndex((item) => item.getPid === selectedID);
	const stockAdevolver = carrito[carritoIndex].getStock;

	productos.map((item) => {
		if (item.pid == selectedID) item.setStock = item.getStock + stockAdevolver;
	});
	carrito = carrito.filter((item) => item.getPid !== selectedID);
	StorageService.setItem('carrito', carrito);
	StorageService.setItem('productos', productos);
	pintarCarrito();
	pintarProductosAIndex();
};

const vaciarCarrito = () => {
	cargarDatos();
	
	carrito.map((item) => {
		const indexAdevolverStock = productos.findIndex((prod)=> prod.getPid === item.getPid );
		if(indexAdevolverStock == -1) return item;
		productos[indexAdevolverStock].setStock = productos[indexAdevolverStock].getStock + item.getStock;
		return item;
	});
	carrito = [];
	StorageService.setItem('carrito', carrito);
	StorageService.setItem('productos',productos);
	pintarCarrito();
	pintarProductosAIndex();
};

const comprarCarrito = () => {
	cargarDatos();
	const errorSaldoInsuficiente = document.getElementById(
		'error-saldoInsuficiente'
	);
	const userMoney = usuario[0].saldoCuenta;
	const cartTotal = document
		.querySelector('#cart-total')
		.textContent.slice(1)
		.replace(/,/g, ''); //quitar el formato al número
	const total = userMoney - cartTotal;
	if (total >= 0) {
		errorSaldoInsuficiente.classList.add('d-none');
		usuario[0].saldoCuenta = total;
		carrito = [];
		StorageService.setItem('carrito', carrito);
		StorageService.setItem('usuario', usuario);
		pintarCarrito();
		pintarProductosAIndex();
	} else {
		const parpadeo = 200;
		let oculto = true;

		const intervalo = setInterval(() => {
			if (oculto) {
				errorSaldoInsuficiente.classList.remove('d-none');
				errorSaldoInsuficiente.style.color = 'red';
				errorSaldoInsuficiente.style.fontWeight = 600;
			} else {
				errorSaldoInsuficiente.classList.add('d-none');
			}
			oculto = !oculto;
		}, parpadeo);
		setTimeout(() => {
			clearInterval(intervalo);
			errorSaldoInsuficiente.classList.add('d-none');
		}, 2000);
	}
};

const sumProdCarrito = (e) => {
	const dataID = parseInt(e.target.getAttribute('data-pid'));
	const productoIndex = productos.findIndex((item) => item.getPid === dataID);
	carrito.map((item) => {
		if (item.getPid === dataID && productos[productoIndex].getStock - 1 >= 0) {
			item.setStock = item.getStock + 1;
			productos[productoIndex].setStock = productos[productoIndex].getStock - 1;
		}
	});
	StorageService.setItem('productos', productos);
	StorageService.setItem('carrito', carrito);
	actualizarTotalAlCarrito();
	pintarCarrito();
	pintarProductosAIndex();
};

const restProdCarrito = (e) => {
	const dataID = parseInt(e.target.getAttribute('data-pid'));
	const productoIndex = productos.findIndex((item) => item.getPid === dataID);
	carrito.map((item) => {
		if (item.getPid == dataID && item.getStock - 1 > 0) {
			item.setStock = item.getStock - 1;
			productos[productoIndex].setStock = productos[productoIndex].getStock + 1;
		}
	});
	StorageService.setItem('productos', productos);
	StorageService.setItem('carrito',carrito);
	actualizarTotalAlCarrito();
	pintarCarrito();
	pintarProductosAIndex();
};

const actualizarUnidadesCarritoIndex = () => {
	const logoUnidades = document.querySelector('#cart-units');
	const cantidad = carrito.reduce((acc) => (acc += 1), 0);
	logoUnidades.textContent = parseInt(cantidad);
};

const toggleCart = () => {
	const modalCart = document.querySelector('.modal-cart');
	modalCart.classList.toggle('modal-notshow');
};

export {
    cargarCarrito,
    actualizarTotalAlCarrito,
    pintarCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    comprarCarrito,
    sumProdCarrito,
    restProdCarrito,
    toggleCart,
    actualizarUnidadesCarritoIndex
}