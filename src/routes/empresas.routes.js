import express from 'express';
import {
    createEmpresa,
    getEmpresas,
    getEmpresaById,
    updateEmpresa,
    deleteEmpresa
} from '../controllers/empresas.controller.js';

const router = express.Router();

// Ruta para crear una nueva empresa
router.post('/', createEmpresa);

// Ruta para obtener todas las empresas
router.get('/', getEmpresas);

// Ruta para obtener una empresa por ID
router.get('/:id_empresa', getEmpresaById);

// Ruta para actualizar una empresa por ID
router.put('/:id_empresa', updateEmpresa);

// Ruta para eliminar una empresa por ID
router.delete('/:id_empresa', deleteEmpresa);

export default router;
