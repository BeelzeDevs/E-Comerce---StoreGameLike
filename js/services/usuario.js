import {Usuario} from '../models/Usuario.js';

const cargarUsuarios = () => {
	if (localStorage.getItem('usuario')) {
		const usuario = JSON.parse(localStorage.getItem('usuario'));
		console.log(usuario);
		return;
	} else {
		const usuario = new Usuario();
		localStorage.setItem('usuario', JSON.stringify(usuario));
	}
};


export{
    cargarUsuarios
}