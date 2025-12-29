import { supabase } from '../api/supabase';

export const listarMesasService = async () => {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .or(
      'es_temporal.eq.false,and(es_temporal.eq.true,estado.eq.ocupada)'
    )
    .order('numero')

  if (error) throw new Error(error.message)
  return data
}


export const ocuparMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .update({ estado: 'ocupada' })
    .eq('id', mesaId);

  if (error) throw new Error(error.message);
};

export const liberarMesaService = async (mesaId: string) => {
  // solo liberamos mesas normales
  const { data } = await supabase
    .from('mesas')
    .select('es_temporal')
    .eq('id', mesaId)
    .single();

  if (data?.es_temporal) return;

  const { error } = await supabase
    .from('mesas')
    .update({ estado: 'libre' })
    .eq('id', mesaId);

  if (error) throw new Error(error.message);
};
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
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const eliminarMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .delete()
    .eq('id', mesaId)

  if (error) throw new Error(error.message)
}

