import { Router } from 'express';
import { listarMesas } from '../controllers/mesas.controller';
import {
  agregarConsumo,
  listarConsumosMesa,
  eliminarConsumo
} from '../controllers/consumos.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// mesas
router.get('/', listarMesas);

// consumos
router.post('/consumos', agregarConsumo);
router.get('/:mesaId/consumos', listarConsumosMesa);
router.delete('/consumos/:id', eliminarConsumo);

export default router;
