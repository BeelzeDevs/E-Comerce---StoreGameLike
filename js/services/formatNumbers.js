
const formatearNumbero = (num) => {
	let parts = num.toFixed(1).split('.');
	// Convierte el número el número a una cadena utilizando toLocaleString, Formateandor la parte entera del número
	parts[0] = parseInt(parts[0], 10).toLocaleString('en-ES');
	// Une las partes y deuelve el número formateado
	return parts.join('.');
}
const formatearNumbero2Decimales = (num) => {
	let parts = num.toFixed(2).split('.');
	// Convierte el número el número a una cadena utilizando toLocaleString, Formateandor la parte entera del número
	parts[0] = parseInt(parts[0], 10).toLocaleString('en-ES');
	// Une las partes y deuelve el número formateado
	return parts.join('.');
}
export {formatearNumbero,formatearNumbero2Decimales};