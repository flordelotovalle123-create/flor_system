import PDFDocument from 'pdfkit'
import { supabase } from '../api/supabase'

const generarReportePDF = async (
  fechaInicio: string,
  fechaFin: string,
  titulo: string,
  res: any
) => {
  const { data, error } = await supabase
    .from('facturas')
    .select(`
      id,
      total,
      created_at,
      mesas ( numero )
    `)
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  const totalVentas = data.reduce(
    (sum, f) => sum + Number(f.total),
    0
  )

  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${titulo.replace(/\s/g, '_')}.pdf`
  )

  doc.pipe(res)

  doc.fontSize(18).text('flor de loto', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(14).text(titulo, { align: 'center' })
  doc.moveDown()

  doc
    .fontSize(10)
    .text(`desde: ${fechaInicio}`)
    .text(`hasta: ${fechaFin}`)
    .moveDown()

  doc.fontSize(12).text('detalle de facturas')
  doc.moveDown(0.5)

  data.forEach((f, index) => {
    doc.text(
      `${index + 1}. factura #${f.id} | mesa ${f.mesas?.[0]?.numero ?? '-'} | ` +
      `${new Date(f.created_at).toLocaleString()} | total: $${f.total}`
    )
  })

  doc.moveDown()
  doc
    .fontSize(14)
    .text(`total vendido: $${totalVentas}`, { align: 'right' })

  doc.end()
}

export const reporteDiarioService = async (res: any) => {
  const hoy = new Date().toISOString().split('T')[0]

  await generarReportePDF(
    `${hoy}T00:00:00`,
    `${hoy}T23:59:59`,
    'reporte diario',
    res
  )
}

export const reporteSemanalService = async (
  fechaInicio: string,
  fechaFin: string,
  res: any
) => {
  await generarReportePDF(
    fechaInicio,
    fechaFin,
    'reporte semanal',
    res
  )
}

export const reporteMensualService = async (res: any) => {
  const hoy = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    .toISOString()

  await generarReportePDF(
    inicio,
    new Date().toISOString(),
    'reporte mensual',
    res
  )
}
