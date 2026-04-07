"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Activity, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import type { DailyData } from "@/lib/types"

export function DailyStatusView() {
  // 1. ESTADOS DE REACT (Variables dinámicas)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [totalOrigins, setTotalOrigins] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 2. EL MOTOR DE EXTRACCIÓN (Llamadas a la API)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Formateamos la fecha seleccionada para Python (YYYY-MM-DD)
        const dateStr = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
        const API_BASE = "http://127.0.0.1:8000"

        // Disparamos las 3 peticiones en paralelo para que sea súper rápido
        const [resConsolidado, resLogs, resConfig] = await Promise.all([
          fetch(`${API_BASE}/api/backups/consolidado?fecha=${dateStr}`),
          fetch(`${API_BASE}/api/backups/logs?fecha=${dateStr}`),
          fetch(`${API_BASE}/api/config/locations`)
        ])

        const dataConsolidado = await resConsolidado.json()
        const dataLogs = await resLogs.json()
        const dataConfig = await resConfig.json()

        // Actualizamos las variables con la Realidad de la BD
        if (dataConsolidado.datos) setDailyData(dataConsolidado.datos)
        if (dataLogs.total_registros !== undefined) setTotalLogs(dataLogs.total_registros)
        if (dataConfig.datos) {
          // Filtramos solo los servidores que están activados
          const activeOrigins = dataConfig.datos.filter((loc: any) => loc.activated).length
          setTotalOrigins(activeOrigins)
        }
      } catch (error) {
        console.error("Error conectando con FastAPI:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [date]) // Cada vez que el usuario cambie el DatePicker, este bloque se repite solo.

  // 3. MATEMÁTICA DE LOS KPIs
  const criticalAlerts = dailyData.filter((d) => d.estado_final.includes("Alerta")).length
  const successfulBackups = Math.max(0, totalOrigins - criticalAlerts)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estado de Respaldos Diarios</h2>
          <p className="text-muted-foreground">Vista gerencial del sistema de respaldos</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

 <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Estado Global"
          value={`${successfulBackups} / ${totalOrigins}`}
          subtitle="Seguros"
          icon={ShieldCheck}
          iconColor="text-blue-500"
        />
        <KPICard
          title="Alertas de Riesgo"
          value={criticalAlerts.toString()}
          subtitle="Crítica"
          icon={AlertTriangle}
          iconColor="text-red-500"
          valueColor={criticalAlerts > 0 ? "text-red-500" : "text-emerald-500"}
        />
        <KPICard
          title="Eventos del Día"
          value={totalLogs.toString()}
          subtitle="Logs"
          icon={Activity}
          iconColor="text-slate-500"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servidor Origen</TableHead>
              <TableHead>Fecha/Hora Backup</TableHead>
              <TableHead>Última Ejecución n8n</TableHead>
              <TableHead className="text-center">Ubicación 1 (Local)</TableHead>
              <TableHead className="text-center">Ubicación 2 (Local)</TableHead>
              <TableHead className="text-center">Ubicación 3 (Nube)</TableHead>
              <TableHead>Estado Global</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-500" />
                    Cargando auditoría desde Supabase...
                  </div>
                </TableCell>
              </TableRow>
            ) : dailyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No hay datos registrados para esta fecha.
                </TableCell>
              </TableRow>
            ) : (
              dailyData.map((row, i) => {
                const isSeguro = row.estado_final.includes("Seguro")
                const isNoRegistrado = row.estado_final.includes("No Registrado")

                return (
                  <TableRow
                    key={i}
                    className={cn(
                      !isSeguro && !isNoRegistrado && "bg-red-950/10 hover:bg-red-950/20",
                      isNoRegistrado && "bg-amber-950/10 hover:bg-amber-950/20",
                    )}
                  >
                    <TableCell className="font-medium">{row.servidor}</TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">{row.fecha_hora_backup || "No registrado"}</TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">{row.ultima_ejecucion_n8n}</TableCell>
                    <TableCell className="text-center">
                      {row.ubicacion_1 === "PRESENTE" ? (
                        <CheckCircle2 className="inline-block h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="inline-block h-5 w-5 text-slate-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.ubicacion_2 === "PRESENTE" ? (
                        <CheckCircle2 className="inline-block h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="inline-block h-5 w-5 text-slate-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.ubicacion_3 === "PRESENTE" ? (
                        <CheckCircle2 className="inline-block h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="inline-block h-5 w-5 text-slate-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      {isSeguro ? (
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10">
                          ✓ Seguro
                        </Badge>
                      ) : isNoRegistrado ? (
                        <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50">
                          ⚠ No Registrado
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
                          ⚠ Incompleto
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