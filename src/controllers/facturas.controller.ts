import { Response } from 'express';
import { generarFacturaService } from '../services/facturas.service';
import { AuthRequest } from '../middlewares/auth.middleware';

/* generar factura */
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

/* listar facturas (admin) */
export const listarFacturas = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    return res.json({
      ok: true,
      data: []
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

/* detalle factura */
export const detalleFactura = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    return res.json({
      ok: true,
      id
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
