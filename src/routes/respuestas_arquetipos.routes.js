import express from 'express';
import {
    getRespuestasArquetipos,
    getRespuestaArquetipoById,
    createRespuestasArquetipos,
    updateRespuestaArquetipo,
    deleteRespuestaArquetipo
} from '../controllers/respuestas_arquetipos.controller.js';

const router = express.Router();

router.get('/', getRespuestasArquetipos);
router.get('/:id', getRespuestaArquetipoById);
router.post('/', createRespuestasArquetipos);
router.put('/:id', updateRespuestaArquetipo);
router.delete('/:id', deleteRespuestaArquetipo);

export default router;
