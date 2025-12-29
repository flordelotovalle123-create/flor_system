import { Router } from 'express'
import {
  listarMesas,
  crearMesa,
  pagarMesa
} from '../controllers/mesas.controller'
import {
  agregarConsumo,
  listarConsumosMesa,
  eliminarConsumo,
  actualizarCantidad
} from '../controllers/consumos.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

// mesas
router.get('/', listarMesas)
router.post('/', crearMesa)
router.post('/pagar/:mesaId', pagarMesa)

// consumos
router.post('/consumos', agregarConsumo)
router.get('/:mesaId/consumos', listarConsumosMesa)
router.patch('/consumos/:id', actualizarCantidad)
router.delete('/consumos/:id', eliminarConsumo)

export default router
