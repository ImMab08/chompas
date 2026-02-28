"use client"

/**
 * EntryCard - Tarjeta que muestra una entrada de produccion
 * 
 * Diseño tipo tarjeta para movil. Muestra resumen de la entrada
 * con opcion de editar o eliminar. 
 * Los campos calculados (total, acumulado) se muestran resaltados.
 */

import type { ProductionEntry } from "@/src/types/production"
import { calcularTotalColor, formatearFechaCorta, formatearPrecio } from "@/src/types/production"

interface EntryCardProps {
  entry: ProductionEntry
  index: number
  acumulado: number
  onEdit: (entry: ProductionEntry) => void
  onDelete: (id: string) => void
}

export default function EntryCard({ entry, index, acumulado, onEdit, onDelete }: EntryCardProps) {
  const totalColor = calcularTotalColor(entry)

  // Nombres cortos de tallas para mostrar solo las que tienen valor
  const tallas = [
    { label: "S", value: entry.tpieces.s },
    { label: "M", value: entry.tpieces.m },
    { label: "L", value: entry.tpieces.l },
    { label: "XL", value: entry.tpieces.xl },
    { label: "XXL", value: entry.tpieces.xxl },
  ].filter(t => t.value > 0)

  return (
    <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Encabezado de la tarjeta */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">{entry.operacion || "Sin operacion"}</p>
            <p className="text-sm text-muted-foreground">
              {formatearFechaCorta(entry.fecha)}
              {entry.op && (" \u00B7 OP: " + entry.op)}
              {entry.ref && (" \u00B7 Ref: " + entry.ref)}
            </p>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="px-4 py-3">
        {/* Color */}
        {entry.color && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Color:</span>
            <span className="text-sm font-medium text-foreground">{entry.color}</span>
          </div>
        )}

        {/* Tallas con piezas */}
        {tallas.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tallas.map(t => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-foreground">{t.label}</span>
                <span className="text-muted-foreground">{":" + t.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Valores calculados - resaltados */}
        <div className="flex flex-wrap gap-2">
          <div className="rounded-lg bg-highlight px-3 py-2">
            <p className="text-xs text-highlight-foreground">Total</p>
            <p className="text-lg font-bold text-highlight-foreground">{totalColor}</p>
          </div>
          <div className="rounded-lg bg-highlight px-3 py-2">
            <p className="text-xs text-highlight-foreground">Precio</p>
            <p className="text-lg font-bold text-highlight-foreground">{formatearPrecio(entry.precio)}</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-xs text-primary">Acumulado</p>
            <p className="text-lg font-bold text-primary">{formatearPrecio(acumulado)}</p>
          </div>
        </div>

        {/* Observacion */}
        {entry.observacion && (
          <p className="mt-2 text-sm italic text-muted-foreground">
            {entry.observacion}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex border-t border-border">
        <button
          onClick={() => onEdit(entry)}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-primary active:bg-accent transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => onDelete(entry.id)}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-destructive active:bg-destructive/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  )
}
