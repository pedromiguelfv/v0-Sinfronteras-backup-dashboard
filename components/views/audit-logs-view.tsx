'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockData } from '@/lib/mock-data'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AuditLogsViewProps {
  selectedDate: Date
}

export function AuditLogsView({ selectedDate }: AuditLogsViewProps) {
  const { dataLogs } = mockData

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Eventos del Sistema</CardTitle>
          <CardDescription>
            Registro de actividades {selectedDate instanceof Date && !isNaN(selectedDate.getTime()) ? `para ${format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Ubicación (Servidor)</TableHead>
                  <TableHead>Estado Final</TableHead>
                  <TableHead>Log del Sistema (stdout)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataLogs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-sm font-mono">{log.created_at}</TableCell>
                    <TableCell className="font-medium">{log.ubicacion}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.final_status === 'SUCCESS' ? 'default' : 'destructive'}
                        className={
                          log.final_status === 'SUCCESS'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }
                      >
                        {log.final_status}
                      </Badge>
                    </TableCell>
                    <TableCell className={log.final_status === 'ERROR' ? 'text-red-600 text-sm' : 'text-sm'}>
                      {log.stdout}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
