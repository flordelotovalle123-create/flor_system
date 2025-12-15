import { Request, Response } from 'express';
import {
  crearUsuarioService,
  listarUsuariosService,
  actualizarUsuarioService,
  eliminarUsuarioService
} from '../services/usuarios.service';

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        ok: false,
        message: 'todos los campos son obligatorios'
      });
    }

    await crearUsuarioService({ nombre, email, password, rol });

    return res.status(201).json({
      ok: true,
      message: 'usuario creado correctamente'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const listarUsuarios = async (_: Request, res: Response) => {
  try {
    const usuarios = await listarUsuariosService();

    return res.json({
      ok: true,
      data: usuarios
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await actualizarUsuarioService(id, req.body);

    return res.json({
      ok: true,
      message: 'usuario actualizado'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await eliminarUsuarioService(id);

    return res.json({
      ok: true,
      message: 'usuario desactivado'
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};
