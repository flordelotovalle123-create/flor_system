import { Router } from 'express';
import {
  generarFactura,
  listarFacturas,
  detalleFactura
} from '../controllers/facturas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/mesa/:mesaId', generarFactura);

router.get(
  '/',
  roleMiddleware(['admin']),
  listarFacturas
);

router.get(
  '/:id',
  roleMiddleware(['admin']),
  detalleFactura
);

export default router;
