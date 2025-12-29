import { supabase } from '../api/supabase'

export const generarVentaRapidaService = async (
  items: { producto_id: string; cantidad: number }[],
  usuarioId: string
) => {
  let total = 0
  const detalles = []

  for (const item of items) {
    const { data: producto } = await supabase
      .from('productos')
      .select('nombre, precio')
      .eq('id', item.producto_id)
      .single()

    if (!producto) throw new Error('producto no encontrado')

    const subtotal = producto.precio * item.cantidad
    total += subtotal

    detalles.push({
      producto_id: item.producto_id,
      nombre_producto: producto.nombre,
      cantidad: item.cantidad,
      precio_unitario: producto.precio,
      subtotal
    })
  }

  const { data: factura } = await supabase
    .from('facturas')
    .insert({
      usuario_id: usuarioId,
      total,
      tipo: 'rapida',
      mesa_id: null
    })
    .select()
    .single()

  await supabase
    .from('factura_detalles')
    .insert(
      detalles.map(d => ({
        ...d,
        factura_id: factura.id
      }))
    )

  return factura
}
