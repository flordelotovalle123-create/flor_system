import { supabase } from '../api/supabase';
import { hashPassword } from '../utils/bcrypt';

interface CrearUsuarioData {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'camarero';
}

export const crearUsuarioService = async (data: CrearUsuarioData) => {
  const password_hash = await hashPassword(data.password);

  const { error } = await supabase.from('usuarios').insert([
    {
      nombre: data.nombre,
      email: data.email,
      password_hash,
      rol: data.rol
    }
  ]);

  if (error) {
    throw new Error(error.message);
  }
};

export const listarUsuariosService = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, rol, activo, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const actualizarUsuarioService = async (
  id: string,
  data: Partial<CrearUsuarioData>
) => {
  const updateData: any = {
    nombre: data.nombre,
    email: data.email,
    rol: data.rol
  };

  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
  }

  const { error } = await supabase
    .from('usuarios')
    .update(updateData)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const eliminarUsuarioService = async (id: string) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ activo: false })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
