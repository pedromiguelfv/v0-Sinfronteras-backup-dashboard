'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { ViewType, PanelTab } from '@/lib/types'

interface HeaderProps {
  activeView: ViewType
  panelTab: PanelTab
  onPanelTabChange: (tab: PanelTab) => void
  selectedDate: Date
  onSelectedDateChange: (date: Date) => void
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
}

export function Header({ 
  activeView, 
  panelTab, 
  onPanelTabChange,
  selectedDate,
  onSelectedDateChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  let headerTitle = ''
  let headerSubtitle = ''

  if (activeView === 'panel') {
    headerTitle = 'Estado de Respaldos'
    headerSubtitle = 'Vista gerencial del sistema de respaldos'
  } else if (activeView === 'audit') {
    headerTitle = 'Registro Crudo de Eventos'
    headerSubtitle = 'Auditoría detallada de logs del sistema'
  } else if (activeView === 'config') {
    headerTitle = 'Catálogo Maestro de Servidores'
    headerSubtitle = 'Administración del sistema de respaldos'
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{headerTitle}</h1>
            <p className="text-sm text-foreground/60">{headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Solo dejamos el botón de Modo Oscuro */}
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg"
                title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {activeView === 'panel' && (
          <Tabs value={panelTab} onValueChange={(value) => onPanelTabChange(value as PanelTab)}>
            <TabsList>
              <TabsTrigger value="daily">Estado Diario</TabsTrigger>
              <TabsTrigger value="historical">Reporte Histórico</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </header>
  )
}
