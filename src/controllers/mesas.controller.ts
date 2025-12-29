import { Request, Response } from 'express'
import {
  listarMesasService,
  crearMesaService,
  liberarMesaService,
  cerrarMesaTemporalService
} from '../services/mesas.service'
import { eliminarConsumosPorMesaService } from '../services/consumos.service'
import { supabase } from '../api/supabase'

/* =========================
   listar mesas
   ========================= */
export const listarMesas = async (_: Request, res: Response) => {
  try {
    const mesas = await listarMesasService()
    res.json({ ok: true, data: mesas })
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

/* =========================
   crear mesa
   ========================= */
export const crearMesa = async (req: Request, res: Response) => {
  try {
    const { numero, es_temporal } = req.body

    if (!numero) {
      return res.status(400).json({
        ok: false,
        message: 'numero de mesa requerido'
      })
    }

    const mesa = await crearMesaService(
      numero,
      'libre',
      es_temporal || false
    )

    res.status(201).json({ ok: true, data: mesa })
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: error.message
    })
  }
}

/* =========================
   pagar mesa (fix fk)
   ========================= */
export const pagarMesa = async (req: Request, res: Response) => {
  try {
    const { mesaId } = req.params

    // eliminar consumos primero
    await eliminarConsumosPorMesaService(mesaId)

    // obtener tipo de mesa
    const { data: mesa, error } = await supabase
      .from('mesas')
      .select('es_temporal')
      .eq('id', mesaId)
      .single()

    if (error) throw error

    if (mesa?.es_temporal) {
      // 🔴 ya no se elimina
      await cerrarMesaTemporalService(mesaId)
    } else {
      await liberarMesaService(mesaId)
    }

    res.json({
      ok: true,
      message: 'mesa pagada correctamente'
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
