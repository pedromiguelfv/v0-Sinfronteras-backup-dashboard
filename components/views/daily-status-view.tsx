'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Activity, CheckCircle2, XCircle } from 'lucide-react'
import { mockData } from '@/lib/mock-data'
import { KPICard } from '@/components/kpi-card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DailyStatusViewProps {
  selectedDate: Date
}

export function DailyStatusView({ selectedDate }: DailyStatusViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const { dataDiario, dataConfig, dataLogs } = mockData

  // Calcular KPIs
  const totalOrigins = dataConfig.filter(d => d.activated).length
  const alertCount = dataDiario.filter(d => d.estado_final.includes('Alerta')).length
  const backupCorrects = totalOrigins - alertCount
  const logCount = dataLogs.length

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Estado Global"
          description="Seguros"
          value={`${backupCorrects} / ${totalOrigins}`}
          icon={Shield}
          iconColor="text-blue-600"
          valueColor="text-foreground"
        />
        <KPICard
          title="Alertas de Riesgo"
          description="Crítica"
          value={alertCount}
          icon={AlertTriangle}
          iconColor="text-red-500"
          valueColor="text-red-500"
        />
        <KPICard
          title="Eventos del Día"
          description="Logs"
          value={logCount}
          icon={Activity}
          iconColor="text-blue-600"
          valueColor="text-foreground"
        />
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Auditoría de Respaldos</CardTitle>
          <CardDescription>Estado actual de todos los servidores monitoreados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servidor Origen</TableHead>
                  <TableHead>Última Ejecución</TableHead>
                  <TableHead className="text-center">Ubicación 1 (Local)</TableHead>
                  <TableHead className="text-center">Ubicación 2 (Local)</TableHead>
                  <TableHead className="text-center">Ubicación 3 (Nube)</TableHead>
                  <TableHead>Estado Global</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataDiario.map((row, idx) => {
                  const isAlert = row.estado_final.includes('Alerta')
                  const isSafe = row.estado_final.includes('Seguro')

                  return (
                    <TableRow
                      key={idx}
                      className={isAlert ? 'bg-red-950/20 hover:bg-red-950/30' : ''}
                    >
                      <TableCell className="font-medium">{row.servidor}</TableCell>
                      <TableCell className="text-sm">{row.ultima_ejecucion_n8n}</TableCell>
                      <TableCell className="text-center">
                        {row.ubicacion_1 === 'PRESENTE' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.ubicacion_2 === 'PRESENTE' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.ubicacion_3 === 'PRESENTE' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isSafe ? 'outline' : 'destructive'}
                          className={
                            isSafe
                              ? 'border-emerald-500 text-emerald-500 bg-transparent'
                              : 'bg-red-950 text-red-200 border-red-950'
                          }
                        >
                          {isSafe ? '✓' : '⚠'} {row.estado_final.split(':')[0]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Display */}
      {mounted && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) && (
        <div className="flex items-center justify-center text-sm text-foreground/60">
          <span className="font-medium">Datos mostrados para:</span>
          <span className="ml-2 font-semibold text-foreground">
            {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
          </span>
        </div>
      )}
    </div>
  )
}
