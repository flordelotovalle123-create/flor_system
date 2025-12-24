import { Request, Response } from 'express'
import { generarFacturaPDFService } from '../services/factura-pdf.service'

export const descargarFacturaPDF = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params
  await generarFacturaPDFService(id, res)
}
