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

	get getPid() {
		return this.pid;
	}
	set setPid(pid) {
		this.pid = pid;
	}
	get getNombre() {
		return this.nombre;
	}
	set setNombre(nombre) {
		this.nombre = nombre;
	}
	set setEnvio(envio) {
		this.envio = parseFloat(envio).toFixed(2);
	}
	get getEnvio() {
		return this.envio;
	}

	get getCategoria() {
		return this.categoria;
	}
	set setCategoria(cat) {
		this.categoria = cat;
	}

	get getMarca() {
		return this.marca;
	}
	set setMarca(marca) {
		this.marca = marca;
	}

	get getPrecio() {
		return parseFloat(this.precio).toFixed(2);
	}
	set setPrecio(p) {
		this.precio = parseFloat(p).toFixed(2);
	}

	get getStock() {
		return this.stock;
	}
	set setStock(stock) {
		this.stock = stock;
	}

	get getImg() {
		return this.img;
	}
	set setImg(img) {
		this.img = img;
	}
}

export default Producto;