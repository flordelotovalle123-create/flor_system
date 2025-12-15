import { Request, Response } from 'express';
import {
  crearProductoService,
  listarProductosService,
  actualizarProductoService,
  eliminarProductoService
} from '../services/productos.service';

export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, precio } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'nombre y precio son obligatorios'
      });
    }

    await crearProductoService({ nombre, precio });

    return res.status(201).json({
      ok: true,
      message: 'producto creado correctamente'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const listarProductos = async (_: Request, res: Response) => {
  try {
    const productos = await listarProductosService();

    return res.json({
      ok: true,
      data: productos
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await actualizarProductoService(id, req.body);

    return res.json({
      ok: true,
      message: 'producto actualizado'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await eliminarProductoService(id);

    return res.json({
      ok: true,
      message: 'producto desactivado'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
