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

// Definimos el "molde" de los datos que nos enviará Python
interface HistoricalData {
  servidor: string
  total_dias_evaluados: number
  dias_exitosos: number
  dias_con_alertas: number
  porcentaje_exito: number
  estado_tendencia: string
}

export function HistoricalReportView() {
  // 1. ESTADOS DE REACT
  // Por defecto, calculamos la efectividad de los últimos 7 días
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  
  const [reportData, setReportData] = useState<HistoricalData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. EL MOTOR DE EXTRACCIÓN (Llamada a la API de Reportes)
  useEffect(() => {
    const fetchReport = async () => {
      // Solo hacemos la petición si el usuario ha seleccionado ambas fechas (Inicio y Fin)
      if (!date?.from || !date?.to) return

      setIsLoading(true)
      try {
        const fechaInicio = format(date.from, "yyyy-MM-dd")
        const fechaFin = format(date.to, "yyyy-MM-dd")
        const API_BASE = "http://127.0.0.1:8000"

        // Disparamos la petición al Endpoint de Reportes
        const response = await fetch(
          `${API_BASE}/api/backups/reporte?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
        )
        const result = await response.json()

        // Tu API de Python llama al array "resumen_ejecutivo", no "datos"
        if (result.resumen_ejecutivo) {
          setReportData(result.resumen_ejecutivo)
        } else if (result.datos) { 
          // Por si acaso en el futuro lo estandarizas
          setReportData(result.datos)
        } else {
          setReportData([])
        }
      } catch (error) {
        console.error("Error conectando con FastAPI (Reporte Histórico):", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [date]) // Este código se repite solo cada vez que el calendario cambia

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reporte Histórico de Efectividad</h2>
          <p className="text-muted-foreground">Analítica de rendimiento por servidor en el tiempo</p>
        </div>
        
        {/* SELECTOR DE RANGO DE FECHAS */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", { locale: es })
                  )
                ) : (
                  <span>Seleccionar rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2} // Muestra 2 meses juntos para facilitar la selección
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* TABLA ANALÍTICA */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servidor Origen</TableHead>
              <TableHead className="text-center">Días Evaluados</TableHead>
              <TableHead className="text-center">Exitosos</TableHead>
              <TableHead className="text-center">Fallos / Alertas</TableHead>
              <TableHead className="w-[30%]">Efectividad</TableHead>
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
                // LÓGICA DE NEGOCIO PARA COLORES
                const isPerfect = row.porcentaje_exito === 100
                const isWarning = row.porcentaje_exito < 100 && row.porcentaje_exito >= 80
                const isCritical = row.porcentaje_exito < 80

                // Decidimos el color de la barra de progreso
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
                    
                    {/* COLUMNA ESTRELLA: BARRA DE PROGRESO DE EFECTIVIDAD */}
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

                    {/* TENDENCIA VISUAL (BADGES) */}
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