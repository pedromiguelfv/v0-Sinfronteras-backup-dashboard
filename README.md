# Dashboard Monitoreo de Backups - Sinfronteras

Sistema de monitoreo y auditoría de respaldos empresarial con tema oscuro/claro, diseñado con React, Next.js, Tailwind CSS y componentes de shadcn/ui.

## Características Principales

### 🎯 Panel Gerencial
- **Estado Diario**: Vista en tiempo real del estado de respaldos con KPIs
  - Estado Global (Servidores Seguros / Total)
  - Alertas de Riesgo (Crítica)
  - Eventos del Día (Logs totales)
  - Tabla de auditoría con estado visual de ubicaciones

- **Reporte Histórico**: Análisis de efectividad a 31 días
  - Tabla analítica con días evaluados, exitosos y fallos
  - Barra de progreso de efectividad visual

### 📋 Auditoría de Logs
- Tabla técnica de eventos del sistema
- Registros completos con timestamp, ubicación, estado y stdout
- Resaltado visual de errores en rojo

### ⚙️ Configuración
- Catálogo maestro de servidores
- Switches interactivos para activar/desactivar monitoreo
- Formulario modal para agregar nuevos servidores
- Estado visual "Monitoreando" o "Inactivo"

### 🌓 Tema Oscuro/Claro
- Toggle en esquina superior derecha
- Tema oscuro por defecto
- Paleta de colores azul corporativo

## Estructura del Proyecto

```
app/
├── layout.tsx          # Layout raíz con ThemeProvider
├── page.tsx            # Página principal con navegación
└── globals.css         # Estilos globales y tokens de diseño

components/
├── sidebar.tsx         # Navegación lateral
├── header.tsx          # Encabezado con fecha y tema
├── kpi-card.tsx        # Componente reutilizable para KPIs
└── views/
    ├── daily-status-view.tsx
    ├── historical-report-view.tsx
    ├── audit-logs-view.tsx
    └── configuration-view.tsx

lib/
├── mock-data.ts        # Datos de ejemplo
├── types.ts            # Tipos TypeScript
└── utils.ts            # Utilidades (cn function)
```

## Datos de Ejemplo

El proyecto incluye datos mock completos para demostración:
- 4 servidores configurados
- Registros de estado diario
- Histórico de 31 días
- Logs de auditoría

## Tecnologías

- **Frontend**: React 19, Next.js 16
- **Estilos**: Tailwind CSS 4, shadcn/ui
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Tema**: next-themes
- **Validación**: TypeScript

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

## Componentes Principales

- `Sidebar`: Navegación entre vistas (Panel, Auditoría, Configuración)
- `Header`: Encabezado con selector de fecha y toggle de tema
- `DailyStatusView`: KPIs y tabla de estado diario
- `HistoricalReportView`: Análisis histórico con progreso visual
- `AuditLogsView`: Registro técnico de eventos
- `ConfigurationView`: Gestión de servidores monitoreados

## Diseño

La interfaz sigue principios de diseño corporativo con:
- Paleta neutral con acentos azules
- Layout lateral fijo para navegación
- Tarjetas KPI con iconos representativos
- Tablas limpias y legibles
- Indicadores visuales claros (colores, iconos)

## Próximas Mejoras

- Integración con API real de datos
- Gráficos históricos con Recharts
- Exportación de reportes
- Notificaciones en tiempo real
- Filtros avanzados en auditoría
