import { Request, Response } from 'express';
import {
  agregarConsumoService,
  listarConsumosPorMesaService,
  eliminarConsumoService,
  calcularTotalMesaService
} from '../services/consumos.service';

export const agregarConsumo = async (req: Request, res: Response) => {
  try {
    const { mesa_id, producto_id, cantidad } = req.body;

    if (!mesa_id || !producto_id || !cantidad) {
      return res.status(400).json({
        ok: false,
        message: 'datos incompletos'
      });
    }

    await agregarConsumoService({
      mesa_id,
      producto_id,
      cantidad
    });

    return res.status(201).json({
      ok: true,
      message: 'producto agregado a la mesa'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const listarConsumosMesa = async (req: Request, res: Response) => {
  try {
    const { mesaId } = req.params;

    const consumos = await listarConsumosPorMesaService(mesaId);
    const total = await calcularTotalMesaService(mesaId);

    return res.json({
      ok: true,
      data: {
        consumos,
        total
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const eliminarConsumo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await eliminarConsumoService(id);

    return res.json({
      ok: true,
      message: 'consumo eliminado'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
