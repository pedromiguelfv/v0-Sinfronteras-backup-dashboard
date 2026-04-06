'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { eachDayOfInterval, format, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoricalData {
  servidor: string
  porcentaje_exito: number
  [key: string]: string | number
}

interface EffectivenessChartProps {
  data: HistoricalData[]
  startDate: Date
  endDate: Date
}

export function EffectivenessChart({ data, startDate, endDate }: EffectivenessChartProps) {
  const [mounted, setMounted] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !startDate || !endDate) return

    // Validate dates
    if (!(startDate instanceof Date) || !(endDate instanceof Date) || 
        !isValid(startDate) || !isValid(endDate)) {
      setChartData([])
      return
    }

    try {
      // Generate chart data with daily effectiveness percentage
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      
      const newChartData = days.map((date) => {
        // Calculate average effectiveness for the day
        const avgEffectiveness = data.length > 0 
          ? data.reduce((sum, item) => sum + (item.porcentaje_exito || 0), 0) / data.length
          : 0
        
        return {
          date: format(date, 'd MMM', { locale: es }),
          effectiveness: Math.round(avgEffectiveness * 10) / 10,
          fullDate: format(date, 'yyyy-MM-dd'),
        }
      })

      setChartData(newChartData)
    } catch (error) {
      console.error('Error generating chart data:', error)
      setChartData([])
    }
  }, [mounted, startDate, endDate, data])

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
          <p className="text-sm text-blue-500 font-semibold">
            Efectividad: {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Efectividad</CardTitle>
          <CardDescription>Cargando gráfico...</CardDescription>
        </CardHeader>
        <CardContent className="h-80" />
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Efectividad</CardTitle>
          <CardDescription>Selecciona un rango de fechas para visualizar la tendencia</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-foreground/60">
          <p>No hay datos disponibles para el rango seleccionado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Efectividad</CardTitle>
        <CardDescription>Porcentaje promedio de efectividad por día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--foreground)"
                domain={[0, 100]}
                label={{ value: 'Efectividad (%)', angle: -90, position: 'insideLeft' }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="effectiveness"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
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
