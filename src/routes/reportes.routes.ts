import { Router } from 'express';
import {
  reporteDiario,
  reporteSemanal,
  reporteMensual
} from '../controllers/reportes.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/diario', reporteDiario);
router.get('/semanal', reporteSemanal);
router.get('/mensual', reporteMensual);

export default router;
