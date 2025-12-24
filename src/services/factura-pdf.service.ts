import PDFDocument from 'pdfkit'
import { supabase } from '../api/supabase'

export const generarFacturaPDFService = async (
  facturaId: string,
  res: any
) => {
  // obtener factura
  const { data: factura, error } = await supabase
    .from('facturas')
    .select(`
      id,
      total,
      created_at,
      mesas ( numero )
    `)
    .eq('id', facturaId)
    .single()

  if (error || !factura) {
    throw new Error('factura no encontrada')
  }

  // obtener detalle
  const { data: detalles, error: detalleError } = await supabase
    .from('factura_detalles')
    .select(`
      nombre_producto,
      cantidad,
      precio_unitario,
      subtotal
    `)
    .eq('factura_id', facturaId)

  if (detalleError) throw new Error(detalleError.message)

  const doc = new PDFDocument({ margin: 40 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=factura_${factura.id}.pdf`
  )

  doc.pipe(res)

  // encabezado
  doc.fontSize(18).text('flor de loto', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(14).text(`factura #${factura.id}`, { align: 'center' })
  doc.moveDown()

  doc.fontSize(10)
    .text(`fecha: ${new Date(factura.created_at).toLocaleString()}`)
    .text(`mesa: ${factura.mesas?.[0]?.numero ?? '-'}`)
    .moveDown()

  // tabla
  doc.fontSize(12).text('detalle de consumo')
  doc.moveDown(0.5)

  detalles.forEach((d, index) => {
    doc.text(
      `${index + 1}. ${d.nombre_producto} | ` +
      `cant: ${d.cantidad} | ` +
      `precio: $${d.precio_unitario} | ` +
      `subtotal: $${d.subtotal}`
    )
  })

  doc.moveDown()
  doc
    .fontSize(14)
    .text(`total a pagar: $${factura.total}`, { align: 'right' })

  doc.end()
}
