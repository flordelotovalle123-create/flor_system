import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import { generarVentaRapidaService } from '../services/ventasRapidas.service'

export const ventaRapida = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body
    const usuarioId = req.user.id

    const factura = await generarVentaRapidaService(items, usuarioId)

    res.status(201).json({ ok: true, data: factura })
  } catch (e: any) {
    res.status(400).json({ ok: false, message: e.message })
  }
}
