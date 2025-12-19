import { Request, Response } from 'express'
import {
  agregarConsumoService,
  listarConsumosPorMesaService,
  eliminarConsumoService,
  calcularTotalMesaService,
  actualizarCantidadService
} from '../services/consumos.service'

export const agregarConsumo = async (req: Request, res: Response) => {
  await agregarConsumoService(req.body)
  res.status(201).json({ ok: true })
}

export const listarConsumosMesa = async (req: Request, res: Response) => {
  const { mesaId } = req.params

  const consumos = await listarConsumosPorMesaService(mesaId)
  const total = await calcularTotalMesaService(mesaId)

  res.json({
    ok: true,
    data: {
      consumos,
      total
    }
  })
}

// En el controlador de consumos, modifica:

export const actualizarCantidad = async (req: Request, res: Response) => {
  const { id } = req.params
  const { cantidad, comentario } = req.body  // AÑADE comentario

  await actualizarCantidadService(id, cantidad, comentario)  // PASA EL COMENTARIO

  res.json({ ok: true })
}

export const eliminarConsumo = async (req: Request, res: Response) => {
  const { id } = req.params

  await eliminarConsumoService(id)

  res.json({ ok: true })
}
