class Usuario {
	saldoCuenta;
	constructor(dinero = 1000000.0) {
		this.saldoCuenta = parseFloat(dinero).toFixed(2);
	}
	get getSaldoCuenta() {
		return parseFloat(this.saldoCuenta).toFixed(2);
	}
	set setSaldoCuenta(dinero) {
		this.saldoCuenta = parseFloat(dinero).toFixed(2);
	}
	sumarSaldoCuenta(dinero) {
		this.saldoCuenta += parseFloat(dinero).toFixed(2);
	}
}

export default Usuario;