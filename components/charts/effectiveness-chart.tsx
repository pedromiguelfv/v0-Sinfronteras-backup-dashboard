'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from "lucide-react"

// Estructura de datos que nos envía Python
export interface DailyTrend {
  date: string
  effectiveness: number
  fullDate: string
}

interface EffectivenessChartProps {
  data: DailyTrend[]
  isLoading: boolean
}

export function EffectivenessChart({ data, isLoading }: EffectivenessChartProps) {
  // Estado para evitar errores de hidratación entre Servidor y Cliente con Recharts
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
          <p className="text-sm text-blue-600 font-semibold">
            Efectividad: {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  // Prevenir renderizado hasta que el componente esté montado en el cliente
  if (!mounted) return null

  // Estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Efectividad</CardTitle>
          <CardDescription>Calculando métricas diarias desde el servidor...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
             <p className="text-muted-foreground animate-pulse">Procesando tendencia...</p>
        </CardContent>
      </Card>
    )
  }

  // Estado sin datos
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Efectividad</CardTitle>
          <CardDescription>Selecciona un rango de fechas para visualizar la tendencia</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-foreground/60">
          <p>No hay datos estadísticos para el rango seleccionado.</p>
        </CardContent>
      </Card>
    )
  }

  // Renderizado del Gráfico Limpio
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Efectividad</CardTitle>
        <CardDescription>Porcentaje promedio de éxito global por día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#888888"
                domain={[0, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="effectiveness"
                stroke="#2563eb" // blue-600 de Tailwind
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}