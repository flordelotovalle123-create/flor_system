import { supabase } from '../api/supabase';

export const listarMesasService = async () => {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('numero');

  if (error) throw new Error(error.message);
  return data;
};

export const ocuparMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .update({ estado: 'ocupada' })
    .eq('id', mesaId);

  if (error) throw new Error(error.message);
};

export const liberarMesaService = async (mesaId: string) => {
  const { error } = await supabase
    .from('mesas')
    .update({ estado: 'libre' })
    .eq('id', mesaId);

  if (error) throw new Error(error.message);
};
