export interface Vale {
  id?: number;
  codigo: string;
  user_id: number;
  servicio_id: number;
  fecha_emision: string;
  fecha_vigencia: string;
  monto_inicial: number;
  monto_usado: number;
  estado: 'activo' | 'usado' | 'vencido';
  es_adicional: boolean;
  motivo_adicional?: string;
  created_at?: string;
  updated_at?: string;
  saldo_disponible?: number;
}