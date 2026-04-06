'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { DailyStatusView } from '@/components/views/daily-status-view'
import { HistoricalReportView } from '@/components/views/historical-report-view'
import { AuditLogsView } from '@/components/views/audit-logs-view'
import { ConfigurationView } from '@/components/views/configuration-view'
import { ViewType, PanelTab } from '@/lib/types'

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('panel')
  const [panelTab, setPanelTab] = useState<PanelTab>('daily')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState<Date>(new Date())

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeView={activeView} 
          panelTab={panelTab} 
          onPanelTabChange={setPanelTab}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <div className="flex-1 overflow-auto">
          {activeView === 'panel' && (
            <>
              {panelTab === 'daily' && <DailyStatusView selectedDate={selectedDate} />}
              {panelTab === 'historical' && <HistoricalReportView startDate={startDate} endDate={endDate} />}
            </>
          )}
          {activeView === 'audit' && <AuditLogsView selectedDate={selectedDate} />}
          {activeView === 'config' && <ConfigurationView />}
        </div>
      </main>
    </div>
  )
}
