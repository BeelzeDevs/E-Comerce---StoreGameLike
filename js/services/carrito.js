import StorageService from '../utils/storage.js';

import {Producto} from '../models/Producto.js';
import {pintarProductosAIndex, cargarStorageProductos} from './producto.js';
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
			prod.setPid(item.pid);
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
			return (acc += item.getPrecio() * item.getStock());
		}, 0)
	);
	const SumaTotalEnvios = carrito.reduce((acc, item) => {
		return (acc += item.getEnvio());
	}, 0);
	// texcontent
    
	const saldoUsuario = parseFloat(
		StorageService.getItem('usuario').saldoCuenta
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
	actualizarUnidadesCarritoIndex();
};

const pintarCarrito = () => {
	const fragment = document.createDocumentFragment();
	const templateCart = document.querySelector('#template-cartProduct');
	const cartProducts = document.querySelector('#cart-products');
	cartProducts.innerHTML = '';
	carrito.forEach((item) => {
		const clone = templateCart.content.cloneNode(true);
		const productName = clone.querySelector('#product-name');
		const cantidadAcomprarCarrito = clone.querySelector(
			'#cantidadAcomprarCarrito'
		);
		const botonMenos = clone.querySelector('#cart-cantidadMenos');
		const botonMas = clone.querySelector('#cart-cantidadMas');
		const precioXunidadCarrito = clone.querySelector('#precioXunidadCarrito');
		const precioEnvioCarrito = clone.querySelector('#precioEnvioCarrito');
		const cartProductTotal = clone.querySelector('#cartProduct-total');
		const cartBtnEliminar = clone.querySelector('#cartbtn-eliminar');
		//dataset id
		botonMas.dataset.pid = item.getPid();
		botonMenos.dataset.pid = item.getPid();
		cartProductTotal.dataset.pid = item.getPid();
		cantidadAcomprarCarrito.dataset.pid = item.getPid();
		cartBtnEliminar.dataset.pid = item.getPid();
		precioEnvioCarrito.dataset.pid = item.getPid();

		// textcontent
		productName.textContent = item.getMarca() + ' - ' + item.getNombre();
		cantidadAcomprarCarrito.textContent = item.getStock();
		precioXunidadCarrito.textContent =
			'$' + formatearNumbero2Decimales(parseFloat(item.getPrecio()));
		precioEnvioCarrito.textContent = 0;
		cartProductTotal.textContent =
			'$' +
			formatearNumbero2Decimales(
				parseFloat(item.getStock() * item.getPrecio())
			);
		cartProductTotal.appendChild(cartBtnEliminar);

		fragment.appendChild(clone);
	});
	cartProducts.appendChild(fragment);
	actualizarTotalAlCarrito();
};

const eliminarDelCarrito = (e) => {
	const selectedID = e.target.dataset.pid;
	const carritoSelect = carrito.filter((item) => item.getPid() === selectedID);
	const stockAdevolver = carritoSelect[0].getStock();

	productos.map((item) => {
		if (item.pid == selectedID) item.stock += stockAdevolver;
	});
	carrito = carrito.filter((item) => item.getPid() !== selectedID);
	StorageService.setItem('carrito', carrito);
	StorageService.setItem('productos', productos);
	pintarCarrito();
	pintarProductosAIndex();
};

const vaciarCarrito = () => {
	carrito.map((item) => {
		productos.map((product) => {
			if (product.pid == item.getPid()) {
				return (product.stock += item.getStock());
			}
		});
		return;
	});
	carrito = [];
	StorageService.setItem('carrito', carrito);
	pintarCarrito();
	pintarProductosAIndex();
};

const comprarCarrito = () => {
	const errorSaldoInsuficiente = document.getElementById(
		'error-saldoInsuficiente'
	);
	const user = StorageService.getItem('usuario');
	const cartTotal = document
		.querySelector('#cart-total')
		.textContent.slice(1)
		.replace(/,/g, ''); //quitar el formato al número
	const saldoCuenta = user.saldoCuenta;
	const total = saldoCuenta - cartTotal;
	if (total >= 0) {
		errorSaldoInsuficiente.classList.add('d-none');
		user.saldoCuenta = total;
		carrito = [];
		StorageService.setItem('carrito', carrito);
		StorageService.setItem('usuario', user);
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
	const dataID = e.target.getAttribute('data-pid');
	const producto = productos.filter((item) => item.pid == dataID);
	const productoIndex = productos.findIndex((item) => item.pid == dataID);
	carrito.map((item) => {
		if (item.getPid() == dataID && productos[productoIndex].stock - 1 >= 0) {
			item.setStock(item.getStock() + 1);
			productos[productoIndex].stock -= 1;
		}
	});
	StorageService.setItem('productos', productos);
	StorageService.setItem('carrito', carrito);
	actualizarTotalAlCarrito();
	pintarCarrito();
	pintarProductosAIndex();
};

const restProdCarrito = (e) => {
	const dataID = e.target.getAttribute('data-pid');
	const producto = productos.filter((item) => item.pid == dataID);
	const productoIndex = productos.findIndex((item) => item.pid == dataID);
	carrito.map((item) => {
		if (item.getPid() == dataID && item.getStock() - 1 > 0) {
			item.setStock(item.getStock() - 1);
			productos[productoIndex].stock += 1;
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