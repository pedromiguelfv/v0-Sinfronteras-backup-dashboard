'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { mockData } from '@/lib/mock-data'
import { DateRangePicker } from '@/components/date-range-picker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function HistoricalReportView() {
  const { dataHistorico } = mockData
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())

  return (
    <div className="p-6 space-y-6">
      {/* Date Range Picker */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Análisis Histórico</h2>
          <p className="text-sm text-foreground/60 mt-1">Efectividad de respaldos por servidor</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          label="Rango de análisis"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporte de Efectividad</CardTitle>
          <CardDescription>
            {startDate instanceof Date && endDate instanceof Date && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) 
              ? `Período: ${format(startDate, 'd MMM', { locale: es })} - ${format(endDate, 'd MMM yyyy', { locale: es })}`
              : 'Selecciona un rango de fechas para ver el reporte'}
          </CardDescription>
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
