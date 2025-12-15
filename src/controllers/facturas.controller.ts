import { Response } from 'express';
import { generarFacturaService } from '../services/facturas.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const generarFactura = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { mesaId } = req.params;
    const usuarioId = req.user.id;

    const factura = await generarFacturaService(mesaId, usuarioId);

    return res.status(201).json({
      ok: true,
      message: 'factura generada correctamente',
      data: factura
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
