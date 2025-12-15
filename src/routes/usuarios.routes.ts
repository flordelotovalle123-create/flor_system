import { Router } from 'express';
import {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuarios.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/', crearUsuario);
router.get('/', listarUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
