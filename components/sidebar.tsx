'use client'

import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ChevronRight, 
  Server, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewType } from '@/lib/types'
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  // 1. Estados de memoria del Sidebar
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(activeView === 'config')

  // Opcional: Si cambian a la vista de configuración desde otro lado, abrimos el submenú
  useEffect(() => {
    if (activeView === 'config' && !isCollapsed) {
      setIsConfigOpen(true)
    }
  }, [activeView, isCollapsed])

  const navItems = [
    { id: 'panel', label: 'Panel Gerencial', icon: LayoutDashboard },
    { id: 'audit', label: 'Auditoría de Logs', icon: FileText },
  ]

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-20" : "w-64" // <--- Aquí ocurre la magia del ancho dinámico
      )}
    >
      {/* 2. HEADER DEL SIDEBAR (Logo + Botón Toggle) */}
      <div className={cn(
        "p-4 border-b border-sidebar-border flex items-center transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {/* Los textos desaparecen instantáneamente al encoger para no deformar el diseño */}
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">Sinfronteras</h1>
            <p className="text-sm text-sidebar-foreground/60 whitespace-nowrap">Monitoreo de Backups</p>
          </div>
        )}
        
        {/* Botón Gatillo */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0"
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>
      
      {/* 3. NAVEGACIÓN PRINCIPAL */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              title={isCollapsed ? item.label : undefined} // Tooltip nativo al estar colapsado
              className={cn(
                'w-full flex items-center rounded-lg text-left transition-all duration-200',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3', // Cambia el padding y centrado
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          )
        })}

        {/* 4. SUBMENÚ COLAPSABLE: CONFIGURACIÓN */}
        <Collapsible 
          // Si el menú general está colapsado, forzamos visualmente a que este submenú parezca cerrado
          open={!isCollapsed && isConfigOpen}
          onOpenChange={(open) => {
            if (isCollapsed) {
              // REGLA LÓGICA: Si está encogido y le hacen clic, primero expande el sidebar, luego abre este submenú
              setIsCollapsed(false)
              setIsConfigOpen(true)
            } else {
              // Comportamiento normal
              setIsConfigOpen(open)
            }
          }}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <button
              title={isCollapsed ? "Configuración" : undefined}
              className={cn(
                'w-full flex items-center rounded-lg text-left transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent',
                isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3',
                // Sombra de estado activo si el submenú está activo pero el panel está colapsado
                activeView === 'config' && isCollapsed ? 'bg-sidebar-primary text-sidebar-primary-foreground' : '' 
              )}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Configuración</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </button>
          </CollapsibleTrigger>
          
          {/* El contenido interno también desaparece para no sobresalir */}
          {!isCollapsed && (
            <CollapsibleContent>
              <div className="mt-1 space-y-1 overflow-hidden">
                <button
                  onClick={() => onViewChange('config' as ViewType)}
                  className={cn(
                    // 1. Redujimos pl-12 a pl-8, gap-3 a gap-2, y pr-4 a pr-2
                    'w-full flex items-center gap-2 pl-8 pr-2 py-2.5 rounded-lg text-sm text-left transition-colors',
                    activeView === 'config'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <Server className="w-4 h-4 shrink-0" />
                  {/* 2. Cambiamos whitespace-nowrap por truncate */}
                  <span className="truncate">Catálogo de Servidores</span>
                </button>
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </nav>

      {/* 5. FOOTER */}
      <div className={cn(
        "p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 overflow-hidden whitespace-nowrap",
        isCollapsed ? "text-center" : ""
      )}>
        {isCollapsed ? <p>v1.0</p> : <p>Versión 1.0.0</p>}
      </div>
    </aside>
  )
}