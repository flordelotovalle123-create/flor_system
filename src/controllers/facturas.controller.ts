import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  generarFacturaService,
  listarFacturasService,
  detalleFacturaService
} from '../services/facturas.service';

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
      data: factura
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

/* listar facturas con o sin filtro de fechas */
export const listarFacturas = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const facturas = await listarFacturasService(
      fechaInicio ? String(fechaInicio) : undefined,
      fechaFin ? String(fechaFin) : undefined
    );

    return res.json({
      ok: true,
      data: facturas
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

/* detalle de una factura */
export const detalleFactura = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const detalles = await detalleFacturaService(id);

    return res.json({
      ok: true,
      data: detalles
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
