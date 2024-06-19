import {cargarStorageProductos} from './producto.js';

let productos = JSON.parse(localStorage.getItem('productos'));



const cargarCategorias = () => {
	const categoriasIndex = document.getElementById('category-select');
	const categoriasUnicas = new Set(); // solo permite valores únicos
	productos.forEach((producto) => categoriasUnicas.add(producto.categoria));
	const arrayCategorias = Array.from(categoriasUnicas);
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
				pintarProductosAIndex();
				break;
		}
	});
};

export {cargarCategorias};