'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DateRangePickerProps {
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
  label?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label = 'Rango de fechas'
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [monthStart, setMonthStart] = useState(new Date(startDate.getFullYear(), startDate.getMonth()))
  const [monthEnd, setMonthEnd] = useState(new Date(endDate.getFullYear(), endDate.getMonth()))

  const handleStartMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(monthStart)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setMonthStart(newMonth)
  }

  const handleEndMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(monthEnd)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setMonthEnd(newMonth)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          📅{' '}
          {startDate instanceof Date && !isNaN(startDate.getTime())
            ? format(startDate, 'dd MMM', { locale: es })
            : 'Inicio'}{' '}
          -{' '}
          {endDate instanceof Date && !isNaN(endDate.getTime())
            ? format(endDate, 'dd MMM yyyy', { locale: es })
            : 'Fin'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-semibold text-foreground">{label}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false)
              }}
              className="text-xs"
            >
              Cerrar
            </Button>
          </div>

          {/* Dual Calendar Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date Calendar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-medium text-foreground/70">Desde</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartMonth('prev')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartMonth('next')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-foreground/50 text-center">
                {format(monthStart, 'MMMM yyyy', { locale: es })}
              </p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) onStartDateChange(date)
                }}
                month={monthStart}
                onMonthChange={setMonthStart}
                disabled={(date) => date > endDate}
                className="scale-90 origin-top-left -ml-3"
              />
            </div>

            {/* End Date Calendar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-medium text-foreground/70">Hasta</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEndMonth('prev')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEndMonth('next')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-foreground/50 text-center">
                {format(monthEnd, 'MMMM yyyy', { locale: es })}
              </p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  if (date) onEndDateChange(date)
                }}
                month={monthEnd}
                onMonthChange={setMonthEnd}
                disabled={(date) => date < startDate}
                className="scale-90 origin-top-right -mr-3"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-border pt-3">
            <div className="text-xs text-foreground/70 space-y-1">
              <p>
                <strong>Desde:</strong> {format(startDate, 'EEEE, d MMMM yyyy', { locale: es })}
              </p>
              <p>
                <strong>Hasta:</strong> {format(endDate, 'EEEE, d MMMM yyyy', { locale: es })}
              </p>
              <p className="text-foreground/50 mt-2">
                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} días
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
