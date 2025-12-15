import { Request, Response } from 'express';
import { listarMesasService } from '../services/mesas.service';

export const listarMesas = async (_: Request, res: Response) => {
  try {
    const mesas = await listarMesasService();

    return res.json({
      ok: true,
      data: mesas
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};
