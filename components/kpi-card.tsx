'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  description: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  valueColor?: string
}

export function KPICard({ 
  title, 
  description, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  valueColor = 'text-foreground'
}: KPICardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        {/* Cambiamos text-sm por text-lg (más grande) y aumentamos el grosor a font-bold */}
        <CardTitle className="text-lg font-bold text-foreground/80">{title}</CardTitle>
        
        {/* Le damos un poco más de presencia al subtítulo (descripción) */}
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            {/* Cambiamos text-3xl por text-5xl para hacer los números mucho más grandes */}
            {/* Agregamos tracking-tighter para que los caracteres no se separen demasiado */}
            <p className={`text-4xl font-bold tracking-tighter ${valueColor}`}>{value}</p>
          </div>
          {/* El ícono se mantiene o se puede subir ligeramente a w-14 h-14 para balancear el número grande */}
          <Icon className={`w-14 h-14 ${iconColor} opacity-80`} />
        </div>
      </CardContent>
    </Card>
  )
}