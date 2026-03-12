"use client"

/**
 * DesktopTable - Tabla interactiva para vista de escritorio
 * 
 * Replica la estructura del formato Excel original pero con
 * capacidad de edicion inline y mejor interactividad.
 * Solo se muestra en pantallas grandes (lg:).
 */

import type { ProductionEntry } from "@/src/types/production" 
import { calcularTotalColor, calcularAcumulado, formatearPrecio, formatearFechaCorta } from "@/src/types/production" 

interface DesktopTableProps {
  entries: ProductionEntry[]
  onEdit: (entry: ProductionEntry) => void
  onDelete: (id: string) => void
}

export default function DesktopTable({ entries, onEdit, onDelete }: DesktopTableProps) {
  if (entries.length === 0) return null

  return (
    <div className="h-full rounded-xl border border-border bg-card shadow-sm">
      <div className="h-full overflow-x-hidden overflow-y-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="sticky top-0 w-full">
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-4 text-left font-semibold text-foreground">#</th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">Fecha</th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">OP</th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">REF</th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">Operacion</th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">Color</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">S</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">M</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">L</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">XL</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">XXL</th>
              <th className="px-4 py-4 text-center font-semibold text-highlight-foreground bg-highlight/50">Total</th>
              <th className="px-4 py-4 text-right font-semibold text-foreground">Precio</th>
              <th className="px-4 py-4 text-right font-semibold text-primary bg-primary/5">Acumulado</th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="h-full overflow-y-scroll">
            {entries.map((entry, index) => {
              const totalColor = calcularTotalColor(entry)
              const acumulado = calcularAcumulado(entries, index)
              return (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground">{index + 1}</td>
                  <td className="px-3 py-3 font-medium text-foreground">{formatearFechaCorta(entry.fecha)}</td>
                  <td className="px-3 py-3 text-foreground">{entry.op || "-"}</td>
                  <td className="px-3 py-3 text-foreground">{entry.ref || "-"}</td>
                  <td className="px-3 py-3 text-foreground max-w-45 truncate" title={entry.operacion}>
                    {entry.operacion || "-"}
                  </td>
                  <td className="px-3 py-3 text-foreground">{entry.color || "-"}</td>
                  <td className="px-2 py-3 text-center text-foreground">{entry.tpieces.s || "-"}</td>
                  <td className="px-2 py-3 text-center text-foreground">{entry.tpieces.m || "-"}</td>
                  <td className="px-2 py-3 text-center text-foreground">{entry.tpieces.l || "-"}</td>
                  <td className="px-2 py-3 text-center text-foreground">{entry.tpieces.xl || "-"}</td>
                  <td className="px-2 py-3 text-center text-foreground">{entry.tpieces.xxl || "-"}</td>
                  <td className="px-3 py-3 text-center font-bold text-highlight-foreground bg-highlight/30">
                    {totalColor}
                  </td>
                  <td className="px-3 py-3 text-right text-foreground">{formatearPrecio(entry.precio)}</td>
                  <td className="px-3 py-3 text-right font-bold text-primary bg-primary/5">
                    {formatearPrecio(acumulado)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(entry)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
