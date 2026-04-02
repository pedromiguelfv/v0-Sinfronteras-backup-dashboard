'use client'

import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewType } from '@/lib/types'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'panel', label: 'Panel Gerencial', icon: LayoutDashboard },
    { id: 'audit', label: 'Auditoría de Logs', icon: FileText },
    { id: 'config', label: 'Configuración', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Sinfronteras</h1>
        <p className="text-sm text-sidebar-foreground/60">Monitoreo de Backups</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
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
      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
        <p>Versión 1.0.0</p>
      </div>
    </aside>
  )
}
