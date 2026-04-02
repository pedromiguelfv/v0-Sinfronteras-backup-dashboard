'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { mockData } from '@/lib/mock-data'

export function HistoricalReportView() {
  const { dataHistorico } = mockData

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análisis Histórico</CardTitle>
          <CardDescription>Efectividad de respaldos por servidor (últimos 31 días)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servidor</TableHead>
                  <TableHead className="text-center">Días Evaluados</TableHead>
                  <TableHead className="text-center">Exitosos</TableHead>
                  <TableHead className="text-center">Fallos</TableHead>
                  <TableHead>Efectividad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataHistorico.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{row.servidor}</TableCell>
                    <TableCell className="text-center">{row.total_dias_evaluados}</TableCell>
                    <TableCell className="text-center text-emerald-600 font-medium">
                      {row.dias_exitosos}
                    </TableCell>
                    <TableCell className="text-center text-red-600 font-medium">
                      {row.dias_con_alertas}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress
                            value={row.porcentaje_exito}
                            className="h-2"
                          />
                        </div>
                        <span className="text-sm font-medium min-w-fit">
                          {row.porcentaje_exito.toFixed(1)}%
                        </span>
                      </div>
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
