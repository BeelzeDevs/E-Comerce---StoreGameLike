class Producto {
	static contadorID = 0;
	pid;
	nombre;
	categoria;
	marca;
	precio;
	stock;
	img;
	envio;
	constructor(nombre, marca, categoria, precio, stock, img, envio = 0) {
		Producto.contadorID += 1;
		this.pid = Producto.contadorID;
		this.nombre = nombre;
		this.categoria = categoria;
		this.marca = marca;
		this.precio = parseFloat(precio).toFixed(2);
		this.stock = stock;
		this.img = img;
		this.envio = envio;
	}

	getPid() {
		return this.pid;
	}
	setPid(pid) {
		this.pid = pid;
	}
	getNombre() {
		return this.nombre;
	}
	setEnvio(envio) {
		this.envio = parseFloat(envio).toFixed(2);
	}
	getEnvio() {
		return this.envio;
	}
	setNombre(nombre) {
		this.nombre = nombre;
	}

	getCategoria() {
		return this.categoria;
	}
	setCategoria(cat) {
		this.categoria = cat;
	}

	getMarca() {
		return this.marca;
	}
	setMarca(marca) {
		this.marca = marca;
	}

	getPrecio() {
		return parseFloat(this.precio).toFixed(2);
	}
	setPrecio(p) {
		this.precio = parseFloat(p).toFixed(2);
	}

	getStock() {
		return this.stock;
	}
	setStock(stock) {
		this.stock = stock;
	}

	getImg() {
		return this.img;
	}
	setImg(img) {
		this.img = img;
	}
}

export {
	Producto
};