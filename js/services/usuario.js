import {Usuario} from '../models/Usuario.js';
import StorageService from '../utils/storage.js';

const cargarUsuarios = () => {
	if (StorageService.getItem('usuario').length !== 0) {
		const usuario = StorageService.getItem('usuario');
		return;
	} else {
		const usuario = new Usuario();
		StorageService.setItem('usuario', usuario);
	}
};


export{
    cargarUsuarios
}