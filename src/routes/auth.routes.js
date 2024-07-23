import { Router } from 'express';
import { loginUser, validateAccessCode } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginUser);
router.post('/validate-access-code', validateAccessCode);

export default router;
