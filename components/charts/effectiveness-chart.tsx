'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EffectivenessChartProps {
  data: {
    servidor: string
    porcentaje_exito: number
  }[]
  startDate: Date
  endDate: Date
}

export function EffectivenessChart({ data, startDate, endDate }: EffectivenessChartProps) {
  const getColor = (percentage: number) => {
    if (percentage === 100) return '#10b981' // Emerald (Óptimo)
    if (percentage >= 90) return '#3b82f6' // Blue (Bueno)
    if (percentage >= 70) return '#f59e0b' // Amber (Requiere revisión)
    return '#ef4444' // Red (Crítico)
  }

  const chartData = data.map((item) => ({
    name: item.servidor.length > 20 ? item.servidor.substring(0, 20) + '...' : item.servidor,
    fullName: item.servidor,
    efectividad: parseFloat(item.porcentaje_exito.toFixed(1)),
    fill: getColor(item.porcentaje_exito),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Efectividad por Servidor</CardTitle>
        <CardDescription>
          Comparativa de efectividad de respaldos en el rango seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Efectividad (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12, fill: 'var(--foreground)' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Servidor: ${label}`}
              />
              <Bar dataKey="efectividad" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
