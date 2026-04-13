'use client'

import React, { useState, useEffect } from "react"
import { format } from "date-fns" 
import { 
  Plus, 
  Loader2, 
  Server, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Pencil // <-- Añadimos el ícono del lápiz
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Interfaz para el Catálogo de Servidores
interface ServerLocation {
  id: number
  location: string
  activated: boolean
  created_at: string
}

export function ConfigurationView() {
  const [locations, setLocations] = useState<ServerLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newLocationName, setNewLocationName] = useState("")
  
  // NUEVOS ESTADOS: Para controlar el modal de edición
  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: null as number | null,
    location: ''
  })
  const [isUpdatingName, setIsUpdatingName] = useState(false)

  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  // 1. Cargar el catálogo al montar el componente
  const fetchLocations = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/config/locations`)
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setLocations(data)
      } else if (data && data.datos && Array.isArray(data.datos)) {
        setLocations(data.datos)
      } else {
        setLocations([])
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor de configuración."
      })
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // 2. Función para Agregar Nuevo Servidor
  const handleAddServer = async () => {
    if (!newLocationName.trim()) return

    setIsAdding(true)
    try {
      const res = await fetch(`${API_BASE}/api/config/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: newLocationName,
          activated: true
        })
      })

      if (res.ok) {
        toast({ title: "Éxito", description: "Servidor registrado correctamente." })
        setNewLocationName("")
        fetchLocations() 
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo registrar el servidor." })
    } finally {
      setIsAdding(false)
    }
  }

  // 3. Función para Activar/Desactivar (Toggle)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/api/config/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activated: !currentStatus })
      })

      if (res.ok) {
        setLocations(locations.map(loc => 
          loc.id === id ? { ...loc, activated: !currentStatus } : loc
        ))
        toast({ 
          title: "Estado actualizado", 
          description: `El servidor ahora está ${!currentStatus ? 'activo' : 'inactivo'}.` 
        })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cambiar el estado." })
    }
  }

  // 4. NUEVAS FUNCIONES: Abrir modal y Guardar edición de nombre
  const openEditModal = (id: number, currentLocation: string) => {
    setEditModal({ isOpen: true, id, location: currentLocation })
  }

  const handleUpdateName = async () => {
    if (!editModal.id || !editModal.location.trim()) return

    setIsUpdatingName(true)
    try {
      const res = await fetch(`${API_BASE}/api/config/locations/${editModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: editModal.location })
      })

      if (!res.ok) throw new Error('Error al actualizar el nombre')

      // Actualización optimista en el estado local
      setLocations(locations.map(loc => 
        loc.id === editModal.id 
          ? { ...loc, location: editModal.location.toUpperCase() } 
          : loc
      ))
      
      toast({
        title: "Servidor actualizado",
        description: "El nombre se ha modificado correctamente.",
      })
      
      setEditModal({ isOpen: false, id: null, location: '' })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el servidor. Intenta nuevamente.",
      })
    } finally {
      setIsUpdatingName(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 px-4 md:px-6 pb-6 relative">
      
      {/* HEADER UNIFICADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Catálogo Maestro de Servidores</h2>
          <p className="text-muted-foreground text-sm">Gestión de nodos y estados de auditoría</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-11 gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Nuevo Servidor</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Servidor</DialogTitle>
                <DialogDescription>
                  Añade un nuevo nodo al ecosistema de respaldos. Se activará automáticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre / Ubicación del Servidor</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej: 809 PDV AYACUCHO" 
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    className="uppercase"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddServer} 
                  disabled={isAdding || !newLocationName}
                  className="w-full sm:w-auto"
                >
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Servidor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="h-11 w-11 p-0" onClick={fetchLocations} title="Actualizar datos">
            <RefreshCw className={isLoading ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
          </Button>
        </div>
      </div>

      {/* TABLA DE CONFIGURACIÓN */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre del Servidor</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-500" />
                    Sincronizando catálogo...
                  </div>
                </TableCell>
              </TableRow>
            ) : locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  No se encontraron servidores registrados.
                </TableCell>
              </TableRow>
            ) : (
              locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{loc.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">{loc.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">
                    {loc.created_at ? format(new Date(loc.created_at), "yyyy-MM-dd") : 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    {loc.activated ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/50 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/30 gap-1">
                        <XCircle className="h-3 w-3" /> Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* INTEGRACIÓN DEL BOTÓN DE EDICIÓN JUNTO AL SWITCH */}
                    <div className="flex justify-end items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => openEditModal(loc.id, loc.location)}
                        title="Editar nombre"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Switch 
                        checked={loc.activated}
                        onCheckedChange={() => handleToggleStatus(loc.id, loc.activated)}
                        title={loc.activated ? "Desactivar servidor" : "Activar servidor"}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* NUEVO: MODAL DE EDICIÓN DE SERVIDOR */}
      <Dialog 
        open={editModal.isOpen} 
        onOpenChange={(open) => {
          if (!open) setEditModal({ isOpen: false, id: null, location: '' })
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Nombre del Servidor</DialogTitle>
            <DialogDescription>
              Modifica la ubicación de este registro sin alterar su historial de reportes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nueva ubicación / Nombre</Label>
              <Input
                id="edit-name"
                value={editModal.location}
                onChange={(e) => setEditModal(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ej. 801 PDV RMS"
                className="uppercase"
                disabled={isUpdatingName}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditModal({ isOpen: false, id: null, location: '' })}
              disabled={isUpdatingName}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateName} 
              disabled={isUpdatingName || !editModal.location.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdatingName ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}