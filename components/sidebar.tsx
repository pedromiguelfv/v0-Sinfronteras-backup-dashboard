'use client'

import { LayoutDashboard, FileText, Settings, ChevronRight, Server } from 'lucide-react'
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
  // 1. Dejamos solo los botones de navegación directa en el array
  const navItems = [
    { id: 'panel', label: 'Panel Gerencial', icon: LayoutDashboard },
    { id: 'audit', label: 'Auditoría de Logs', icon: FileText },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Sinfronteras</h1>
        <p className="text-sm text-sidebar-foreground/60">Monitoreo de Backups</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {/* 2. Renderizamos los ítems principales */}
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* 3. Renderizamos el Submenú Colapsable para Configuración */}
        <Collapsible 
          className="group/collapsible"
          defaultOpen={activeView === 'config'} // Se abre automáticamente si estamos en la vista
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configuración</span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => onViewChange('config' as ViewType)}
                className={cn(
                  'w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-lg text-sm text-left transition-colors',
                  activeView === 'config'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Server className="w-4 h-4" />
                <span>Catálogo de Servidores</span>
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
        <p>Versión 1.0.0</p>
      </div>
    </aside>
  )
}