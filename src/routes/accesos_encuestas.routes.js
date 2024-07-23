// src/routes/accesos_encuestas.routes.js
import express from 'express';
import {
    getAccesosEncuestas,
    getAccesoEncuestaById,
    createAccesoEncuesta,
    updateAccesoEncuesta,
    deleteAccesoEncuesta,
    getAccesosPorUsuarioYEstudio
} from '../controllers/accesos_encuestas.controller.js';

const router = express.Router();

// Obtener todos los accesos
router.get('/', getAccesosEncuestas);

// Obtener un acceso por ID
router.get('/:id', getAccesoEncuestaById);

// Obtener accesos por id_usuario y id_estudio
router.get('/usuario/:id_usuario/estudio/:id_estudio', getAccesosPorUsuarioYEstudio);

// Crear un nuevo acceso
router.post('/', createAccesoEncuesta);

// Actualizar un acceso por ID
router.put('/:id', updateAccesoEncuesta);

// Eliminar un acceso por ID
router.delete('/:id', deleteAccesoEncuesta);

export default router;
