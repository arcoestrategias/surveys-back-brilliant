import { Router } from 'express';
import {
    createRespuestasComportamientos,
    getAllRespuestasComportamientos,
    getRespuestaComportamientoById,
    updateRespuestaComportamientoById,
    deleteRespuestaComportamientoById
} from '../controllers/respuestas_comportamientos.controller.js';

const router = Router();

router.post('/', createRespuestasComportamientos);
router.get('/', getAllRespuestasComportamientos);
router.get('/:id', getRespuestaComportamientoById);
router.put('/:id', updateRespuestaComportamientoById);
router.delete('/:id', deleteRespuestaComportamientoById);

export default router;
