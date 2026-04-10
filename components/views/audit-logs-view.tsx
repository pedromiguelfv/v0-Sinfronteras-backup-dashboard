'use client'

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  CalendarIcon, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Database,
  MapPin,
  Clock,
  HardDrive
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Tipado exacto basado en la respuesta de tu API
interface AuditLog {
  id: number
  created_at: string
  location: string
  fecha_schedule_trigger: string
  hora_schedule_trigger: string
  local_path: string
  remote_path: string
  db_name: string
  final_status: string
  final_keyword: string
  final_message: string
  directory: string
  filename: string
  size_mb: string
  stdout: string
  location_1: string
  location_2: string
  location_3: string
}

export function AuditLogsView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para controlar qué filas están expandidas
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  // Conexión a la API y Ordenamiento
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const dateStr = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

        const res = await fetch(`${API_BASE}/api/backups/logs?fecha=${dateStr}`)
        const data = await res.json()

        if (data.datos) {
          // ORDENAMIENTO: Ordenamos por ID de menor a mayor (Ascendente)
          const sortedLogs = data.datos.sort((a: AuditLog, b: AuditLog) => a.id - b.id)
          setLogs(sortedLogs)
          setTotalRegistros(data.total_registros || 0)
        } else {
          setLogs([])
          setTotalRegistros(0)
        }
      } catch (error) {
        console.error("Error conectando con FastAPI:", error)
        setLogs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [date])

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  const getStatusBadge = (status: string) => {
    if (!status) return <span className="text-xs text-muted-foreground">N/A</span>
    if (status.includes("SUCCESS") || status.includes("true") || status.includes("✅")) {
      return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/50">{status}</Badge>
    }
    if (status.includes("ERROR") || status.includes("false") || status.includes("❌")) {
      return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/50">{status}</Badge>
    }
    return <Badge variant="outline" className="text-slate-400">{status}</Badge>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 px-4 md:px-6 pb-6">
      
      {/* HEADER UNIFICADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight capitalize">
            {date ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "Cargando fecha..."}
          </h2>
          <p className="text-muted-foreground text-sm">
            Auditoría detallada de ejecución de respaldos {totalRegistros > 0 && `(${totalRegistros} eventos)`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 w-11 p-0" title="Cambiar fecha">
                <CalendarIcon className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Nombres exactos de la API en el orden inicial */}
              <TableHead className="w-[80px]">id</TableHead>
              <TableHead>created_at</TableHead>
              <TableHead>location</TableHead>
              <TableHead>db_name</TableHead>
              <TableHead>final_status</TableHead>
              <TableHead className="text-right">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-500" />
                    Cargando logs de auditoría...
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  No hay logs registrados para esta fecha.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedRows.has(log.id)
                
                return (
                  <React.Fragment key={log.id}>
                    {/* FILA RESUMEN (Clickeable) */}
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleRow(log.id)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">{log.id}</TableCell>
                      <TableCell className="font-mono text-xs">{log.created_at ? log.created_at.split('.')[0] : "N/A"}</TableCell>
                      <TableCell className="font-medium text-sm">{log.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs text-blue-400 bg-blue-400/10 border-blue-400/20">
                          {log.db_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.final_status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* FILA EXPANDIDA (Detalles) - Muestra el resto de columnas con sus nombres exactos */}
                    {isExpanded && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={6} className="p-0 border-b">
                          <div className="p-4 md:p-6 grid gap-6 md:grid-cols-2 animate-in slide-in-from-top-2 duration-200">
                            
                            {/* Columna Izquierda: El resto de los campos ordenados */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">fecha_schedule_trigger</span>
                                  <span className="text-xs font-medium">{log.fecha_schedule_trigger || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">hora_schedule_trigger</span>
                                  <span className="text-xs font-medium">{log.hora_schedule_trigger || "N/A"}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">local_path</span>
                                  <code className="text-xs break-all text-emerald-400 bg-background px-2 py-1 rounded border block">
                                    {log.local_path || "N/A"}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">remote_path</span>
                                  <code className="text-xs break-all text-blue-400 bg-background px-2 py-1 rounded border block">
                                    {log.remote_path || "N/A"}
                                  </code>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">final_keyword</span>
                                  <span className="text-xs">{log.final_keyword || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">size_mb</span>
                                  <span className="text-xs">{log.size_mb ? `${log.size_mb} MB` : "N/A"}</span>
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] font-mono text-muted-foreground block mb-1">final_message</span>
                                <span className="text-xs text-red-400">{log.final_message || "N/A"}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">directory</span>
                                  <span className="text-xs">{log.directory || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">filename</span>
                                  <span className="text-xs">{log.filename || "N/A"}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 p-3 bg-background border rounded-md">
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">location_1</span>
                                  {getStatusBadge(log.location_1)}
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">location_2</span>
                                  {getStatusBadge(log.location_2)}
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-muted-foreground block mb-1">location_3</span>
                                  {getStatusBadge(log.location_3)}
                                </div>
                              </div>
                            </div>

                            {/* Columna Derecha: stdout exacto */}
                            <div className="space-y-2 h-full">
                              <span className="text-[10px] font-mono text-muted-foreground block mb-1 flex items-center gap-1">
                                <Terminal className="h-3 w-3" /> stdout
                              </span>
                              <div className="rounded-md bg-[#0d1117] border border-slate-800 p-4 h-[350px] overflow-auto">
                                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                                  {log.stdout || "N/A"}
                                </pre>
                              </div>
                            </div>

                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}