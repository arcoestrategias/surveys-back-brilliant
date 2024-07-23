import { promises as fs } from 'fs';
import path from 'path';

let error = ""
const rutaDirectorioRaiz = process.cwd();
const rutaArchivoConfiguracion = path.join(rutaDirectorioRaiz, 'config.json');

export const obtenerParametrosSistema = async () => {
    if (!(await archivoExiste(rutaArchivoConfiguracion))) {
        throw new Error('El archivo de configuración no existe');
    }

    try {
        const data = await fs.readFile(rutaArchivoConfiguracion, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error al leer el archivo de configuración: ${error}`);
    }
};


export const getFechaActual = () => {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaActual.getDate()).slice(-2);
    return `${anio}${mes}${dia}`
}