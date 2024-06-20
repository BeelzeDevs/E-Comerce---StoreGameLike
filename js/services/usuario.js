import Usuario from '../models/Usuario.js';
import StorageService from '../utils/storage.js';

const cargarUsuarios = () => {
	if(!StorageService.getItem('usuario')){
		const usuario = [];
		const cargoUser = new Usuario(); // debería consultar la existencia a la base de datos
		usuario.push(cargoUser);
		StorageService.setItem('usuario',usuario);
	}
};


export{
    cargarUsuarios
}