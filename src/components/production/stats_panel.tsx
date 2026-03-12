"use client"

/**
 * StatsPanel - Panel de estadisticas para escritorio
 * 
 * Muestra graficos de barras CSS puro (sin librerias),
 * resumen detallado y metricas de productividad.
 */

import type { ProductionEntry } from "@/src/types/production"
import { calcularTotalColor, formatearPrecio } from "@/src/types/production"

interface StatsPanelProps {
  entries: ProductionEntry[]
}

export default function StatsPanel({ entries }: StatsPanelProps) {
  // Calcular estadisticas
  const totalRegistros = entries.length
  const totalPiezas = entries.reduce((sum, e) => sum + calcularTotalColor(e), 0)
  const totalDinero = entries.reduce((sum, e) => sum + calcularTotalColor(e) * e.precio, 0)
  
  // Piezas por talla
  const piezasPorTalla = {
    S: entries.reduce((sum, e) => sum + e.tpieces.s, 0),
    M: entries.reduce((sum, e) => sum + e.tpieces.m, 0),
    L: entries.reduce((sum, e) => sum + e.tpieces.l, 0),
    XL: entries.reduce((sum, e) => sum + e.tpieces.xl, 0),
    XXL: entries.reduce((sum, e) => sum + e.tpieces.xxl, 0),
  }
  
  const maxTalla = Math.max(...Object.values(piezasPorTalla), 1)

  // Top 3 operaciones mas realizadas
  const operacionesCount: Record<string, number> = {}
  entries.forEach((e) => {
    if (e.operacion) {
      operacionesCount[e.operacion] = (operacionesCount[e.operacion] || 0) + 1
    }
  })
  const topOperaciones = Object.entries(operacionesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Promedio de piezas por dia
  const diasUnicos = new Set(entries.map((e) => e.fecha)).size
  const promedioPorDia = diasUnicos > 0 ? Math.round(totalPiezas / diasUnicos) : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Metricas principales */}
      <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Resumen de Quincena
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 px-3 py-3">
            <p className="text-xs text-muted-foreground">Registros</p>
            <p className="text-2xl font-bold text-foreground">{totalRegistros}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 px-3 py-3">
            <p className="text-xs text-muted-foreground">Piezas</p>
            <p className="text-2xl font-bold text-foreground">{totalPiezas}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 px-3 py-3">
            <p className="text-xs text-muted-foreground">Dias</p>
            <p className="text-2xl font-bold text-foreground">{diasUnicos}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 px-3 py-3">
            <p className="text-xs text-muted-foreground">Prom/dia</p>
            <p className="text-2xl font-bold text-foreground">{promedioPorDia}</p>
          </div>
        </div>
        {/* Total destacado */}
        <div className="mt-3 rounded-lg bg-primary/10 px-4 py-3 text-center border border-primary/20">
          <p className="text-xs text-primary">Total Ganado</p>
          <p className="text-xl font-bold text-primary">{formatearPrecio(totalDinero)}</p>
        </div>
      </div>

      {/* Grafico de barras - Piezas por talla */}
      {totalPiezas > 0 && (
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Piezas por Talla
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(piezasPorTalla).map(([talla, cantidad]) => (
              <div key={talla} className="flex items-center gap-2">
                <span className="w-8 text-sm font-medium text-foreground">{talla}</span>
                <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-md transition-all duration-500"
                    style={{ width: `${(cantidad / maxTalla) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium text-foreground">{cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top operaciones */}
      {topOperaciones.length > 0 && (
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Operaciones Frecuentes
          </h3>
          <div className="flex flex-col gap-2">
            {topOperaciones.map(([op, count], i) => (
              <div key={op} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-foreground" title={op}>{op}</span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
