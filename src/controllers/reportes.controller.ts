import { Response } from 'express';
import {
  reporteDiarioService,
  reporteSemanalService,
  reporteMensualService
} from '../services/reportes.service';

export const reporteDiario = async (_: any, res: Response) => {
  await reporteDiarioService(res);
};

export const reporteSemanal = async (_: any, res: Response) => {
  await reporteSemanalService(res);
};

export const reporteMensual = async (_: any, res: Response) => {
  await reporteMensualService(res);
};
