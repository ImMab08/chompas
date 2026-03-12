"use client"

/**
 * QuincenaSelector - Selector de periodo quincenal
 * 
 * Permite al usuario navegar entre quincenas (periodos de 15 dias).
 * Usa flechas izquierda/derecha para cambiar de periodo.
 * Diseñado con botones grandes para uso facil en movil.
 */

import type { Quincena } from "@/src/types/production"
import { quincenaLabel } from "@/src/types/production"

interface QuincenaSelectorProps {
  quincena: Quincena
  onChange: (q: Quincena) => void
}

export default function QuincenaSelector({ quincena, onChange }: QuincenaSelectorProps) {

  // Navegar a la quincena anterior
  function irAnterior() {
    const q = { ...quincena }
    if (q.period === 2) {
      q.period = 1
    } else {
      q.period = 2
      q.month -= 1
      if (q.month < 1) {
        q.month = 12
        q.year -= 1
      }
    }
    onChange(q)
  }

  // Navegar a la siguiente quincena
  function irSiguiente() {
    const q = { ...quincena }
    if (q.period === 1) {
      q.period = 2
    } else {
      q.period = 1
      q.month += 1
      if (q.month > 12) {
        q.month = 1
        q.year += 1
      }
    }
    onChange(q)
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-3 shadow-sm border border-border">
      {/* Boton anterior - minimo 48px para touch */}
      <button
        onClick={irAnterior}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground active:bg-muted transition-colors cursor-pointer"
        aria-label="Quincena anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Texto de la quincena actual */}
      <p className="text-center text-base font-semibold leading-tight text-foreground">
        {quincenaLabel(quincena)}
      </p>

      {/* Boton siguiente */}
      <button
        onClick={irSiguiente}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground active:bg-muted transition-colors cursor-pointer"
        aria-label="Quincena siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
