export type ViewType = 'panel' | 'audit' | 'config'
export type PanelTab = 'daily' | 'historical'

export interface DailyStatus {
  servidor: string
  ultima_ejecucion_n8n: string
  fecha_hora_backup: string
  ubicacion_1: 'PRESENTE' | 'FALTANTE'
  ubicacion_2: 'PRESENTE' | 'FALTANTE'
  ubicacion_3: 'PRESENTE' | 'FALTANTE'
  estado_final: string
}

export interface HistoricalData {
  servidor: string
  total_dias_evaluados: number
  dias_exitosos: number
  dias_con_alertas: number
  porcentaje_exito: number
  estado_tendencia: string
}

export interface LogEntry {
  id: number
  created_at: string
  ubicacion: string
  final_status: 'SUCCESS' | 'ERROR'
  stdout: string
}

export interface ServerConfig {
  id: number
  location: string
  activated: boolean
}
