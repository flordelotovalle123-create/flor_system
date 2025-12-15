import { supabase } from '../api/supabase';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

interface LoginData {
  email: string;
  password: string;
}

export const loginService = async ({ email, password }: LoginData) => {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('activo', true)
    .single();

  if (error || !usuario) {
    throw new Error('credenciales invalidas');
  }

  const passwordValida = await comparePassword(
    password,
    usuario.password_hash
  );

  if (!passwordValida) {
    throw new Error('credenciales invalidas');
  }

  const token = generateToken({
    id: usuario.id,
    rol: usuario.rol
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  };
};
