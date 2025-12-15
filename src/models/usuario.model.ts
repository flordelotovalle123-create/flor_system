export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: 'admin' | 'camarero';
  activo: boolean;
  created_at: string;
}
