export interface DetalleTransaccion {
  id?: number;
  transaccion_id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaccion {
  id?: number;
  vale_id: number;
  total: number;
  fecha: string;
  created_at?: string;
  updated_at?: string;
  detalles?: DetalleTransaccion[];
}