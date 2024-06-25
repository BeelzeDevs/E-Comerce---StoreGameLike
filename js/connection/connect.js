
const API_URL = 'data.json';

const datos = async () => {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error('Error al solicitar el archivo data.json');
		}
		return await response.json();
	} catch (error) {
		console.error('Problema al hacer un fetch.', error);
		throw error;
	}
};

export default datos;