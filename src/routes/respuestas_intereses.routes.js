import { Router } from 'express';
import {
    createRespuestasIntereses,
    getAllRespuestasIntereses,
    getRespuestaInteresById,
    updateRespuestaInteresById,
    deleteRespuestaInteresById
} from '../controllers/respuestas_intereses.controller.js';

const router = Router();

router.post('/', createRespuestasIntereses);
router.get('/', getAllRespuestasIntereses);
router.get('/:id', getRespuestaInteresById);
router.put('/:id', updateRespuestaInteresById);
router.delete('/:id', deleteRespuestaInteresById);

export default router;
