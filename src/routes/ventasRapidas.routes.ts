import { Router } from 'express'
import { ventaRapida } from '../controllers/ventasRapidas.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/', ventaRapida)

export default router
