import { Request, Response } from 'express'
import {
  reporteDiarioService,
  reporteSemanalService,
  reporteMensualService
} from '../services/reportes.service'

export const reporteDiario = async (_: Request, res: Response) => {
  await reporteDiarioService(res)
}

export const reporteSemanal = async (req: Request, res: Response) => {
  const { inicio, fin } = req.query

  if (!inicio || !fin) {
    return res.status(400).json({
      ok: false,
      message: 'fechas requeridas'
    })
  }

  await reporteSemanalService(String(inicio), String(fin), res)
}

export const reporteMensual = async (_: Request, res: Response) => {
  await reporteMensualService(res)
}
