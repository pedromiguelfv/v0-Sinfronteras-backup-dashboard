export const mockData = {
  dataDiario: [
    {
      servidor: "SERVIDOR CENTRAL",
      ultima_ejecucion_n8n: "13:41:00",
      fecha_hora_backup: "2026-04-01 13:41:10",
      ubicacion_1: "PRESENTE",
      ubicacion_2: "PRESENTE",
      ubicacion_3: "PRESENTE",
      estado_final: "Seguro (3/3 Ubicaciones)"
    },
    {
      servidor: "SERVIDOR SAP",
      ultima_ejecucion_n8n: "07:30:15",
      fecha_hora_backup: "2026-04-01 07:30:00",
      ubicacion_1: "PRESENTE",
      ubicacion_2: "FALTANTE",
      ubicacion_3: "PRESENTE",
      estado_final: "Alerta: Backup Incompleto"
    },
    {
      servidor: "SERVIDOR CEDI",
      ultima_ejecucion_n8n: "08:11:58",
      fecha_hora_backup: "2026-04-01 08:11:00",
      ubicacion_1: "FALTANTE",
      ubicacion_2: "FALTANTE",
      ubicacion_3: "FALTANTE",
      estado_final: "Alerta: Backup Incompleto"
    },
    {
      servidor: "801 PDV CENTRO DE MODA",
      ultima_ejecucion_n8n: "13:30:45",
      fecha_hora_backup: "2026-04-01 13:30:00",
      ubicacion_1: "PRESENTE",
      ubicacion_2: "PRESENTE",
      ubicacion_3: "PRESENTE",
      estado_final: "Seguro (3/3 Ubicaciones)"
    }
  ],

  dataHistorico: [
    {
      servidor: "SERVIDOR SAP",
      total_dias_evaluados: 31,
      dias_exitosos: 31,
      dias_con_alertas: 0,
      porcentaje_exito: 100.0,
      estado_tendencia: "Óptimo"
    },
    {
      servidor: "SERVIDOR CENTRAL",
      total_dias_evaluados: 31,
      dias_exitosos: 28,
      dias_con_alertas: 3,
      porcentaje_exito: 90.3,
      estado_tendencia: "Requiere Revisión"
    },
    {
      servidor: "801 PDV CENTRO DE MODA",
      total_dias_evaluados: 31,
      dias_exitosos: 15,
      dias_con_alertas: 16,
      porcentaje_exito: 48.3,
      estado_tendencia: "Crítico"
    }
  ],

  dataLogs: [
    {
      id: 55,
      created_at: "2026-03-30 17:31:15",
      ubicacion: "801 PDV CENTRO DE MODA",
      final_status: "SUCCESS",
      stdout: "Réplica confirmada en destino local y nube."
    },
    {
      id: 56,
      created_at: "2026-03-30 17:32:00",
      ubicacion: "SERVIDOR CEDI",
      final_status: "ERROR",
      stdout: "Timeout connection to storage server."
    },
    {
      id: 57,
      created_at: "2026-03-30 17:35:10",
      ubicacion: "SERVIDOR CENTRAL",
      final_status: "SUCCESS",
      stdout: "Proceso completado exitosamente."
    }
  ],

  dataConfig: [
    { id: 1, location: "SERVIDOR CENTRAL", activated: true },
    { id: 2, location: "SERVIDOR SAP", activated: true },
    { id: 3, location: "801 PDV CENTRO DE MODA", activated: true },
    { id: 4, location: "SERVIDOR VIEJO (FUERA DE SERVICIO)", activated: false }
  ]
}
