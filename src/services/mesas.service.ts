import { supabase } from '../api/supabase'

/* =========================
   listar mesas visibles
   ========================= */
export const listarMesasService = async () => {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .or(
      // mesas normales siempre
      // mesas temporales solo si NO estan cerradas
      'es_temporal.eq.false,and(es_temporal.eq.true,estado.neq.cerrada)'
    )
    .order('numero')

  if (error) throw new Error(error.message)
  return data
}

/* =========================
   ocupar mesa
   ========================= */
export const ocuparMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .update({ estado: 'ocupada' })
    .eq('id', mesaId)

  if (error) throw new Error(error.message)
}

/* =========================
   liberar mesa normal
   ========================= */
export const liberarMesaService = async (mesaId: string) => {
  const { data, error } = await supabase
    .from('mesas')
    .select('es_temporal')
    .eq('id', mesaId)
    .single()

  if (error) throw new Error(error.message)

  // mesas temporales no se liberan
  if (data?.es_temporal) return

  const { error: updateError } = await supabase
    .from('mesas')
    .update({ estado: 'libre' })
    .eq('id', mesaId)

  if (updateError) throw new Error(updateError.message)
}

/* =========================
   cerrar mesa temporal (nuevo)
   ========================= */
export const cerrarMesaTemporalService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .update({
      estado: 'cerrada'
    })
    .eq('id', mesaId)

  if (error) throw new Error(error.message)
}

/* =========================
   crear mesa
   ========================= */
export const crearMesaService = async (
  numero: number,
  estado: 'libre' | 'ocupada',
  esTemporal: boolean
) => {
  const { data, error } = await supabase
    .from('mesas')
    .insert({
      numero,
      estado,
      es_temporal: esTemporal
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/* =========================
   eliminar mesa (solo uso manual / admin)
   ========================= */
export const eliminarMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .delete()
    .eq('id', mesaId)

  if (error) throw new Error(error.message)
}
