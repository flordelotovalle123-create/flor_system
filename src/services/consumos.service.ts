import { supabase } from '../api/supabase';
import { ocuparMesaService } from './mesas.service';

interface AgregarConsumoData {
  mesa_id: string;
  producto_id: string;
  cantidad: number;
}

export const agregarConsumoService = async (
  data: AgregarConsumoData
) => {
  // obtener precio del producto
  const { data: producto, error } = await supabase
    .from('productos')
    .select('precio')
    .eq('id', data.producto_id)
    .single();

  if (error || !producto) {
    throw new Error('producto no encontrado');
  }

  const precio_unitario = producto.precio;
  const subtotal = precio_unitario * data.cantidad;

  // insertar consumo
  const { error: insertError } = await supabase
    .from('mesa_consumos')
    .insert([
      {
        mesa_id: data.mesa_id,
        producto_id: data.producto_id,
        cantidad: data.cantidad,
        precio_unitario,
        subtotal
      }
    ]);

  if (insertError) throw new Error(insertError.message);

  // marcar mesa como ocupada
  await ocuparMesaService(data.mesa_id);
};

export const listarConsumosPorMesaService = async (
  mesaId: string
) => {
  const { data, error } = await supabase
    .from('mesa_consumos')
    .select(`
      id,
      cantidad,
      precio_unitario,
      subtotal,
      productos ( nombre )
    `)
    .eq('mesa_id', mesaId);

  if (error) throw new Error(error.message);
  return data;
};

export const eliminarConsumoService = async (consumoId: string) => {
  const { error } = await supabase
    .from('mesa_consumos')
    .delete()
    .eq('id', consumoId);

  if (error) throw new Error(error.message);
};

export const calcularTotalMesaService = async (mesaId: string) => {
  const { data, error } = await supabase
    .from('mesa_consumos')
    .select('subtotal')
    .eq('mesa_id', mesaId);

  if (error) throw new Error(error.message);

  const total = data.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0
  );

  return total;
};
