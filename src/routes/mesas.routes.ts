import { Router } from 'express'
import { listarMesas } from '../controllers/mesas.controller'
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

// consumos
router.post('/consumos', agregarConsumo)
router.get('/:mesaId/consumos', listarConsumosMesa)
router.patch('/consumos/:id', actualizarCantidad) // ✅ ESTA FALTABA
router.delete('/consumos/:id', eliminarConsumo)

export default router
