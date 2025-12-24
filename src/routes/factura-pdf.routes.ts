import { Router } from 'express'
import { descargarFacturaPDF } from '../controllers/factura-pdf.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { roleMiddleware } from '../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)
router.use(roleMiddleware(['admin']))

router.get('/:id/pdf', descargarFacturaPDF)

export default router
