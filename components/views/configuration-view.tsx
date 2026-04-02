'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import { mockData } from '@/lib/mock-data'

export function ConfigurationView() {
  const [servers, setServers] = useState(mockData.dataConfig)
  const [open, setOpen] = useState(false)
  const [newServer, setNewServer] = useState({ name: '' })

  const toggleServer = (id: number) => {
    setServers(servers.map(s => s.id === id ? { ...s, activated: !s.activated } : s))
  }

  const handleAddServer = () => {
    if (newServer.name.trim()) {
      const allIds = servers.map(s => s.id)
      const newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1
      setServers([...servers, { id: newId, location: newServer.name, activated: true }])
      setNewServer({ name: '' })
      setOpen(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Catálogo de Servidores</h2>
          <p className="text-sm text-foreground/60">Gestiona los servidores monitoreados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar Servidor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Servidor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Servidor</Label>
                <Input
                  id="name"
                  placeholder="Ej: SERVIDOR NUEVO"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ name: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddServer}>Crear Servidor</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servidores Configurados</CardTitle>
          <CardDescription>Estado operativo y configuración de cada servidor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ubicación (Servidor)</TableHead>
                  <TableHead>Estado Operativo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-mono text-sm">{server.id}</TableCell>
                    <TableCell className="font-medium">{server.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={server.activated}
                          onCheckedChange={() => toggleServer(server.id)}
                        />
                        <span className="text-sm font-medium">
                          {server.activated ? (
                            <span className="text-emerald-600">Monitoreando</span>
                          ) : (
                            <span className="text-gray-500">Inactivo (Soft Delete)</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
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
