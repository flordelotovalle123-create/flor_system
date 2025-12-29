import { supabase } from '../api/supabase'
import { ocuparMesaService, liberarMesaService } from './mesas.service'

interface AgregarConsumoData {
  mesa_id: string
  producto_id: string
  cantidad: number
  comentario?: string
}

export const agregarConsumoService = async (data: AgregarConsumoData) => {
  // buscar consumo existente
  const { data: existente } = await supabase
    .from('mesa_consumos')
    .select('*')
    .eq('mesa_id', data.mesa_id)
    .eq('producto_id', data.producto_id)
    .single()

  // obtener precio del producto
  const { data: producto, error } = await supabase
    .from('productos')
    .select('precio')
    .eq('id', data.producto_id)
    .single()

  if (error || !producto) {
    throw new Error('producto no encontrado')
  }

  const precio_unitario = producto.precio

  if (existente) {
    const nuevaCantidad = existente.cantidad + data.cantidad

    await supabase
      .from('mesa_consumos')
      .update({
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * precio_unitario,
        comentario: data.comentario ?? existente.comentario
      })
      .eq('id', existente.id)
  } else {
    await supabase.from('mesa_consumos').insert([
      {
        mesa_id: data.mesa_id,
        producto_id: data.producto_id,
        cantidad: data.cantidad,
        precio_unitario,
        subtotal: data.cantidad * precio_unitario,
        comentario: data.comentario ?? null
      }
    ])
  }

  await ocuparMesaService(data.mesa_id)
}

// En consumos.service.ts, modifica la función:

export const actualizarCantidadService = async (
  consumoId: string,
  cantidad: number,
  comentario?: string  // AÑADE ESTE PARÁMETRO
) => {
  // si baja a 0 o menos, se elimina
  if (cantidad <= 0) {
    await eliminarConsumoService(consumoId)
    return
  }

  const { data, error } = await supabase
    .from('mesa_consumos')
    .select('precio_unitario, mesa_id')
    .eq('id', consumoId)
    .single()

  if (error || !data) {
    throw new Error('consumo no encontrado')
  }

  // Actualiza tanto cantidad como comentario
  await supabase
    .from('mesa_consumos')
    .update({
      cantidad,
      subtotal: cantidad * data.precio_unitario,
      comentario: comentario ?? null  // AÑADE ESTA LÍNEA
    })
    .eq('id', consumoId)
}

export const listarConsumosPorMesaService = async (mesaId: string) => {
  const { data, error } = await supabase
    .from('mesa_consumos')
    .select(`
      id,
      cantidad,
      subtotal,
      comentario,
      productos (
        id,
        nombre,
        precio
      )
    `)
    .eq('mesa_id', mesaId)

  if (error) throw new Error(error.message)

  return data.map(item => ({
    id: item.id,
    producto: item.productos,
    cantidad: item.cantidad,
    subtotal: item.subtotal,
    comentario: item.comentario
  }))
}

export const eliminarConsumoService = async (consumoId: string) => {
  // obtener mesa para verificar si queda vacia
  const { data } = await supabase
    .from('mesa_consumos')
    .select('mesa_id')
    .eq('id', consumoId)
    .single()

  await supabase
    .from('mesa_consumos')
    .delete()
    .eq('id', consumoId)

  if (data?.mesa_id) {
    await calcularTotalMesaService(data.mesa_id)
  }
}

export const calcularTotalMesaService = async (mesaId: string) => {
  const { data } = await supabase
    .from('mesa_consumos')
    .select('subtotal')
    .eq('mesa_id', mesaId)

  if (!data || data.length === 0) {
    await liberarMesaService(mesaId)
    return 0
  }

  return data.reduce((sum, item) => sum + Number(item.subtotal), 0)
}

export const eliminarConsumosPorMesaService = async (mesaId: string) => {
  await supabase
    .from('mesa_consumos')
    .delete()
    .eq('mesa_id', mesaId)
}
