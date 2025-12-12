export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  es_lider: boolean;
}

export interface LoginData {
  correo: string;
  contraseña: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}