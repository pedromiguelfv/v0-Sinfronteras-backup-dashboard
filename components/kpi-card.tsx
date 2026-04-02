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
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground/70">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          </div>
          <Icon className={`w-12 h-12 ${iconColor} opacity-80`} />
        </div>
      </CardContent>
    </Card>
  )
}
