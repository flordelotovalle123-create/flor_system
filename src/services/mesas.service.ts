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

  const { error: updateError } = await supabase
    .from('mesas')
    .update({ estado: 'libre' })
    .eq('id', mesaId)

  if (updateError) throw new Error(updateError.message)
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
   se consulta en la base de datos si ya hay una mesa temporal libre,
    en caso de no estarlo, se crea una nueva.
   ========================= */
export const buscarMesaTemporalLibreService = async () => {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('es_temporal', true)
    .eq('estado', 'libre')
    .order('numero')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message)
  }

  return data ?? null
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
