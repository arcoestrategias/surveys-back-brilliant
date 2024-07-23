import express from 'express';
import {
    getEstudios,
    getEstudioById,
    createEstudio,
    updateEstudio,
    deleteEstudio
} from '../controllers/estudios.controller.js';

const router = express.Router();

// Obtener todos los estudios
router.get('/', getEstudios);

// Obtener un estudio por ID
router.get('/:id', getEstudioById);

// Crear un nuevo estudio
router.post('/', createEstudio);

// Actualizar un estudio por ID
router.put('/:id', updateEstudio);

// Eliminar un estudio por ID
router.delete('/:id', deleteEstudio);

export default router;
