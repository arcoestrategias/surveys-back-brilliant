import { Router } from 'express';
import { createRol, getRoles, getRolById, updateRol, deleteRol } from '../controllers/roles.controller.js';

const router = Router();

// Rutas para CRUD de roles
router.post('/', createRol);
router.get('/', getRoles);
router.get('/:id_rol', getRolById);
router.put('/:id_rol', updateRol);
router.delete('/:id_rol', deleteRol);

export default router;
