import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Dashboard Monitoreo de Backups - Sinfronteras',
  description: 'Sistema de monitoreo y auditoría de respaldos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* El NAVEGADOR del usuario descargará las fuentes, Docker no hará nada aquí */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
        
        {/* Inyectamos las variables maestras de Tailwind para evitar "textos extraños" */}
        <style>{`
          :root {
            --font-sans: 'Geist', sans-serif;
            --font-mono: 'Geist Mono', monospace;
          }
          body {
            font-family: var(--font-sans);
          }
        `}</style>
      </head>
      
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}