export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  categoria: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}