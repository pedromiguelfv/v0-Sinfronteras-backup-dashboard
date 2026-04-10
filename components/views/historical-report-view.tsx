"use client"

import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Importamos el Gráfico y su Interfaz
import { EffectivenessChart, type DailyTrend } from "@/components/charts/effectiveness-chart"

interface HistoricalData {
  servidor: string
  total_dias_evaluados: number
  dias_exitosos: number
  dias_con_alertas: number
  porcentaje_exito: number
}

export function HistoricalReportView() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  
  const [reportData, setReportData] = useState<HistoricalData[]>([])
  const [trendData, setTrendData] = useState<DailyTrend[]>([]) // NUEVO: Estado para el gráfico
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      if (!date?.from || !date?.to) return

      setIsLoading(true)
      try {
        const fechaInicio = format(date.from, "yyyy-MM-dd")
        const fechaFin = format(date.to, "yyyy-MM-dd")
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        const response = await fetch(
          `${API_BASE}/api/backups/reporte?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
        )
        const result = await response.json()

        // 1. Cargamos la Tabla Analítica
        if (result.resumen_ejecutivo) {
          setReportData(result.resumen_ejecutivo)
        } else {
          setReportData([])
        }

        // 2. Cargamos el Gráfico de Tendencia Diaria
        if (result.tendencia_diaria) {
          setTrendData(result.tendencia_diaria)
        } else {
          setTrendData([])
        }
      } catch (error) {
        console.error("Error conectando con FastAPI:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [date])

 return (
    <div className="space-y-6 animate-in fade-in duration-500 px-4 md:px-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* El título ahora es dinámico y muestra el rango de fechas */}
          <h2 className="text-xl font-bold tracking-tight capitalize">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d 'de' MMMM", { locale: es })} al {format(date.to, "d 'de' MMMM 'de' yyyy", { locale: es })}
                </>
              ) : (
                format(date.from, "d 'de' MMMM 'de' yyyy", { locale: es })
              )
            ) : (
              "Seleccionar periodo"
            )}
          </h2>
          {/* Bajamos el título original para que quede como subtítulo explicativo */}
          <p className="text-muted-foreground text-sm">Reporte Histórico de Efectividad</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              {/* Convertimos el botón gigante en un cuadrado minimalista (h-11 w-11) */}
              <Button
                id="date"
                variant="outline"
                className="h-14 w-14 p-0"
                title="Cambiar rango de fechas"
              >
                {/* Agrandamos el ícono a h-6 w-6 igual que en el Estado Diario */}
                <CalendarIcon className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* AQUÍ INYECTAMOS EL GRÁFICO CONECTADO A LA API */}
      <EffectivenessChart data={trendData} isLoading={isLoading} />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servidor Origen</TableHead>
              <TableHead className="text-center">Días Evaluados</TableHead>
              <TableHead className="text-center">Exitosos</TableHead>
              <TableHead className="text-center">Fallos / Alertas</TableHead>
              <TableHead className="w-[30%]">Efectividad Global</TableHead>
              <TableHead className="text-right">Tendencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-500" />
                    Calculando métricas históricas...
                  </div>
                </TableCell>
              </TableRow>
            ) : reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  No hay datos registrados en el rango de fechas seleccionado.
                </TableCell>
              </TableRow>
            ) : (
              reportData.map((row, i) => {
                const isPerfect = row.porcentaje_exito === 100
                const isWarning = row.porcentaje_exito < 100 && row.porcentaje_exito >= 80
                const isCritical = row.porcentaje_exito < 80

                let progressColorClass = "bg-blue-600"
                if (isPerfect) progressColorClass = "bg-emerald-500"
                if (isWarning) progressColorClass = "bg-amber-500"
                if (isCritical) progressColorClass = "bg-red-500"

                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.servidor}</TableCell>
                    <TableCell className="text-center font-mono">{row.total_dias_evaluados}</TableCell>
                    <TableCell className="text-center font-mono text-emerald-500">{row.dias_exitosos}</TableCell>
                    <TableCell className="text-center font-mono text-red-500">{row.dias_con_alertas}</TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-full">
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div 
                              className={cn("h-full w-full flex-1 transition-all duration-1000", progressColorClass)} 
                              style={{ transform: `translateX(-${100 - row.porcentaje_exito}%)` }} 
                            />
                          </div>
                        </div>
                        <span className="w-12 text-right text-sm font-medium">
                          {row.porcentaje_exito.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      {isPerfect ? (
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10">
                          <TrendingUp className="mr-1 h-3 w-3" /> Óptimo
                        </Badge>
                      ) : isWarning ? (
                        <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50">
                          <Minus className="mr-1 h-3 w-3" /> Revisión
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
                          <TrendingDown className="mr-1 h-3 w-3" /> Crítico
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}