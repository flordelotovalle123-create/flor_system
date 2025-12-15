import { supabase } from '../api/supabase';

interface CrearProductoData {
  nombre: string;
  precio: number;
}

export const crearProductoService = async (data: CrearProductoData) => {
  const { error } = await supabase.from('productos').insert([
    {
      nombre: data.nombre,
      precio: data.precio
    }
  ]);

  if (error) {
    throw new Error(error.message);
  }
};

export const listarProductosService = async () => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const actualizarProductoService = async (
  id: string,
  data: Partial<CrearProductoData>
) => {
  const { error } = await supabase
    .from('productos')
    .update(data)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const eliminarProductoService = async (id: string) => {
  const { error } = await supabase
    .from('productos')
    .update({ activo: false })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
