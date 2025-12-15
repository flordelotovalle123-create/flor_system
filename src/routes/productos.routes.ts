import { Router } from 'express';
import {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productos.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listarProductos);

router.post(
  '/',
  roleMiddleware(['admin']),
  crearProducto
);

router.put(
  '/:id',
  roleMiddleware(['admin']),
  actualizarProducto
);

router.delete(
  '/:id',
  roleMiddleware(['admin']),
  eliminarProducto
);

export default router;
