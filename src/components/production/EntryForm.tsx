"use client"

/**
 * EntryForm - Formulario para agregar o editar una entrada de produccion
 * 
 * Se muestra como un panel completo en movil (full-screen bottom sheet).
 * Campos grandes y agrupados logicamente para facil uso.
 * 
 * COMO FUNCIONA:
 * - Si recibes un "entry" en props, es modo edicion
 * - Si no, es modo creacion y se usan valores por defecto
 * - onSave envia la entrada completa al componente padre
 * - onCancel cierra el formulario sin guardar
 */

import { useState } from "react"
import type { ProductionEntry } from "@/src/types/production"
import { generarId } from "@/src/types/production"

interface EntryFormProps {
  entry?: ProductionEntry | null
  onSave: (entry: ProductionEntry) => void
  onCancel: () => void
}

// Fecha de hoy en formato "YYYY-MM-DD" para el campo date
function fechaHoy(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function EntryForm({ entry, onSave, onCancel }: EntryFormProps) {
  // Si es edicion, usamos los datos existentes; si es nuevo, valores vacios
  const [fecha, setFecha] = useState(entry?.fecha || fechaHoy())
  const [op, setOp] = useState(entry?.op || "")
  const [ref, setRef] = useState(entry?.ref || "")
  const [operacion, setOperacion] = useState(entry?.operacion || "")
  const [color, setColor] = useState(entry?.color || "")
  const [s, setS] = useState(entry?.tpieces.s || 0)
  const [m, setM] = useState(entry?.tpieces.m || 0)
  const [l, setL] = useState(entry?.tpieces.l || 0)
  const [xl, setXl] = useState(entry?.tpieces.xl || 0)
  const [xxl, setXxl] = useState(entry?.tpieces.xxl || 0)
  const [precio, setPrecio] = useState(entry?.precio || 0)
  const [observacion, setObservacion] = useState(entry?.observacion || "")

  const totalPiezas = s + m + l + xl + xxl

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nuevaEntrada: ProductionEntry = {
      id: entry?.id || generarId(),
      fecha,
      op: op.trim(),
      ref: ref.trim(),
      operacion: operacion.trim(),
      color: color.trim(),
      tpieces: { s, m, l, xl, xxl },
      precio,
      observacion: observacion.trim(),
    }
    onSave(nuevaEntrada)
  }

  // Clases reutilizables para inputs - tipografia grande y areas de toque amplias
  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
  const labelClass = "mb-1 block text-sm font-medium text-foreground"

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header fijo */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 items-center gap-1 rounded-lg px-3 text-base font-medium text-muted-foreground active:bg-muted transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Cancelar
        </button>
        <h2 className="text-base font-bold text-foreground">
          {entry ? "Editar Registro" : "Nuevo Registro"}
        </h2>
        <div className="w-20" /> {/* Spacer para centrar el titulo */}
      </header>

      {/* Formulario con scroll */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-5 flex flex-col gap-5">

          {/* SECCION: Datos Generales */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Datos Generales
            </legend>
            <div className="flex flex-col gap-3">
              {/* Fecha */}
              <div>
                <label htmlFor="fecha" className={labelClass}>Fecha</label>
                <input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* OP y REF en fila */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="op" className={labelClass}>OP</label>
                  <input
                    id="op"
                    type="text"
                    value={op}
                    onChange={(e) => setOp(e.target.value)}
                    className={inputClass}
                    placeholder="Orden"
                  />
                </div>
                <div>
                  <label htmlFor="ref" className={labelClass}>REF</label>
                  <input
                    id="ref"
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    className={inputClass}
                    placeholder="Referencia"
                  />
                </div>
              </div>

              {/* Operacion */}
              <div>
                <label htmlFor="operacion" className={labelClass}>Operacion</label>
                <input
                  id="operacion"
                  type="text"
                  value={operacion}
                  onChange={(e) => setOperacion(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Cerrar costado, Pegar cuello..."
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className={labelClass}>Color</label>
                <input
                  id="color"
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Azul, Rojo, Negro..."
                />
              </div>
            </div>
          </fieldset>

          {/* SECCION: Tallas (Piezas por talla) */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Piezas por Talla
            </legend>
            <div className="grid grid-cols-5 gap-2">
              {([
                { id: "s", label: "2-4\nS", value: s, setter: setS },
                { id: "m", label: "6-8\nM", value: m, setter: setM },
                { id: "l", label: "10-12\nL", value: l, setter: setL },
                { id: "xl", label: "14-16\nXL", value: xl, setter: setXl },
                { id: "xxl", label: "18\nXXL", value: xxl, setter: setXxl },
              ] as const).map((talla) => (
                <div key={talla.id} className="flex flex-col items-center">
                  <label htmlFor={`talla-${talla.id}`} className="mb-1 text-center text-xs font-medium text-muted-foreground whitespace-pre-line leading-tight">
                    {talla.label}
                  </label>
                  <input
                    id={`talla-${talla.id}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={talla.value || ""}
                    onChange={(e) => talla.setter(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-input bg-background py-3 text-center text-lg font-bold text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            {/* Total de piezas en vivo */}
            <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-highlight px-4 py-2">
              <span className="text-sm font-medium text-highlight-foreground">Total piezas:</span>
              <span className="text-xl font-bold text-highlight-foreground">{totalPiezas}</span>
            </div>
          </fieldset>

          {/* SECCION: Precio */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Precio
            </legend>
            <div>
              <label htmlFor="precio" className={labelClass}>Precio por pieza ($)</label>
              <input
                id="precio"
                type="number"
                inputMode="numeric"
                min={0}
                value={precio || ""}
                onChange={(e) => setPrecio(parseInt(e.target.value) || 0)}
                className={inputClass}
                placeholder="0"
              />
            </div>
            {totalPiezas > 0 && precio > 0 && (
              <div className="mt-2 rounded-lg bg-primary/10 px-4 py-2 text-center">
                <span className="text-sm text-primary">Subtotal: </span>
                <span className="text-base font-bold text-primary">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(totalPiezas * precio)}
                </span>
              </div>
            )}
          </fieldset>

          {/* SECCION: Observacion */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Observacion
            </legend>
            <textarea
              id="observacion"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={2}
              className={inputClass + " resize-none"}
              placeholder="Notas adicionales (opcional)"
            />
          </fieldset>

        </div>

        {/* Boton guardar fijo abajo */}
        <div className="sticky bottom-0 border-t border-border bg-card px-4 py-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground active:opacity-90 transition-opacity"
          >
            {entry ? "Guardar Cambios" : "Agregar Registro"}
          </button>
        </div>
      </form>
    </div>
  )
}
