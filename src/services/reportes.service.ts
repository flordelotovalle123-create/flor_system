import PDFDocument from 'pdfkit';
import { supabase } from '../api/supabase';

const generarReporte = async (
  fechaInicio: string,
  fechaFin: string,
  titulo: string,
  res: any
) => {
  const { data, error } = await supabase
    .from('facturas')
    .select('id, total, created_at')
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin);

  if (error) throw new Error(error.message);

  const totalVentas = data.reduce(
    (sum, f) => sum + Number(f.total),
    0
  );

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text(titulo);
  doc.moveDown();

  data.forEach((f, index) => {
    doc
      .fontSize(12)
      .text(
        `${index + 1}. fecha: ${new Date(f.created_at).toLocaleDateString()} - total: $${f.total}`
      );
  });

  doc.moveDown();
  doc.fontSize(14).text(`total vendido: $${totalVentas}`);

  doc.end();
};

export const reporteDiarioService = async (res: any) => {
  const hoy = new Date().toISOString().split('T')[0];
  await generarReporte(
    `${hoy} 00:00:00`,
    `${hoy} 23:59:59`,
    'reporte diario',
    res
  );
};

export const reporteSemanalService = async (res: any) => {
  const hoy = new Date();
  const inicio = new Date(hoy.setDate(hoy.getDate() - 7))
    .toISOString();

  await generarReporte(
    inicio,
    new Date().toISOString(),
    'reporte semanal',
    res
  );
};

export const reporteMensualService = async (res: any) => {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    .toISOString();

  await generarReporte(
    inicio,
    new Date().toISOString(),
    'reporte mensual',
    res
  );
};
