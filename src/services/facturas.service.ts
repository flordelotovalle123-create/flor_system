import { supabase } from '../api/supabase';
import { liberarMesaService } from './mesas.service';

export const generarFacturaService = async (
  mesaId: string,
  usuarioId: string
) => {
  // obtener consumos
  const { data: consumos, error } = await supabase
    .from('mesa_consumos')
    .select(`
      id,
      cantidad,
      precio_unitario,
      subtotal,
      productos ( id, nombre )
    `)
    .eq('mesa_id', mesaId);

  if (error || !consumos || consumos.length === 0) {
    throw new Error('la mesa no tiene consumos');
  }

  // calcular total
  const total = consumos.reduce(
    (sum, c) => sum + Number(c.subtotal),
    0
  );

  // crear factura
  const { data: factura, error: facturaError } = await supabase
    .from('facturas')
    .insert([
      {
        mesa_id: mesaId,
        usuario_id: usuarioId,
        total
      }
    ])
    .select()
    .single();

  if (facturaError) throw new Error(facturaError.message);

  // insertar detalle factura
  const detalles = consumos.map((c: any) => ({
    factura_id: factura.id,
    producto_id: c.productos.id,
    nombre_producto: c.productos.nombre,
    cantidad: c.cantidad,
    precio_unitario: c.precio_unitario,
    subtotal: c.subtotal
  }));

  const { error: detalleError } = await supabase
    .from('factura_detalles')
    .insert(detalles);

  if (detalleError) throw new Error(detalleError.message);

  // eliminar consumos
  const { error: deleteError } = await supabase
    .from('mesa_consumos')
    .delete()
    .eq('mesa_id', mesaId);

  if (deleteError) throw new Error(deleteError.message);

  // liberar mesa
  await liberarMesaService(mesaId);

  return factura;
};
export const listarFacturasService = async (p0: string | undefined, p1: string | undefined) => {
  const { data, error } = await supabase
    .from('facturas')
    .select(`
      id,
      total,
      created_at,
      mesas ( numero ),
      usuarios ( nombre )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const detalleFacturaService = async (facturaId: string) => {
  const { data, error } = await supabase
    .from('factura_detalles')
    .select('*')
    .eq('factura_id', facturaId);

  if (error) throw new Error(error.message);
  return data;
};
