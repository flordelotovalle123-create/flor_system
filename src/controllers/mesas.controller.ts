import { Request, Response } from 'express'
import {
  listarMesasService,
  crearMesaService,
  liberarMesaService,
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
   crear mesa en caso de no encontrar una temporal libre
   ========================= */
export const crearMesa = async (req: Request, res: Response) => {
  try {
    const { numero, es_temporal } = req.body

    // solo aplica reutilizacion para mesas temporales
    if (es_temporal) {
      const { buscarMesaTemporalLibreService } = await import('../services/mesas.service')

      const mesaLibre = await buscarMesaTemporalLibreService()

      if (mesaLibre) {
        // reactivar mesa temporal existente
        await supabase
          .from('mesas')
          .update({ estado: 'ocupada' })
          .eq('id', mesaLibre.id)

        return res.status(200).json({
          ok: true,
          data: { ...mesaLibre, estado: 'ocupada' }
        })
      }
    }

    // si no hay mesa reutilizable → crear nueva
    if (!numero) {
      return res.status(400).json({
        ok: false,
        message: 'numero de mesa requerido'
      })
    }

    const mesa = await crearMesaService(
      numero,
      'ocupada',
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

    // todas las mesas vuelven a libre
    await liberarMesaService(mesaId)


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
