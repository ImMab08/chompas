"use client"

/**
 * QuincenaSummary - Resumen de la quincena
 * 
 * Muestra el total de registros, piezas y acumulado en tarjetas.
 * Aparece al tope de la lista como un dashboard rapido.
 */

import type { ProductionEntry } from "@/src/types/production"
import { calcularTotalColor, formatearPrecio } from "@/src/types/production"

interface QuincenaSummaryProps {
  entries: ProductionEntry[]
}

export default function QuincenaSummary({ entries }: QuincenaSummaryProps) {
  const totalRegistros = entries.length
  const totalPiezas = entries.reduce((sum, e) => sum + calcularTotalColor(e), 0)
  const totalDinero = entries.reduce((sum, e) => sum + calcularTotalColor(e) * e.precio, 0)

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl bg-card px-3 py-3 text-center shadow-sm border border-border">
        <p className="text-xs font-medium text-muted-foreground">Registros</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{totalRegistros}</p>
      </div>
      <div className="rounded-xl bg-card px-3 py-3 text-center shadow-sm border border-border">
        <p className="text-xs font-medium text-muted-foreground">Piezas</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{totalPiezas}</p>
      </div>
      <div className="rounded-xl bg-primary/10 px-3 py-3 text-center shadow-sm border border-primary/20">
        <p className="text-xs font-medium text-primary">Total</p>
        <p className="mt-1 text-lg font-bold text-primary leading-tight">{formatearPrecio(totalDinero)}</p>
      </div>
    </div>
  )
}
