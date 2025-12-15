import { Request, Response } from 'express';
import { loginService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'email y password son obligatorios'
      });
    }

    const result = await loginService({ email, password });

    return res.json({
      ok: true,
      message: 'login exitoso',
      data: result
    });
  } catch (error: any) {
    return res.status(401).json({
      ok: false,
      message: error.message
    });
  }
};
