"use client"

/**
 * OperarioConfig - Muestra y permite editar los datos del operario
 * 
 * El usuario puede tocar "Editar" para cambiar nombre y cedula.
 * Los datos se guardan en localStorage (luego en tu base de datos).
 */

import { useState } from "react"
import type { OperarioInfo } from "@/src/types/production"

interface OperarioConfigProps {
  operario: OperarioInfo
  onSave: (info: OperarioInfo) => void
}

export default function OperarioConfig({ operario, onSave }: OperarioConfigProps) {
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(operario.nombre)
  const [cedula, setCedula] = useState(operario.cedula)

  function guardar() {
    onSave({ nombre: nombre.trim(), cedula: cedula.trim() })
    setEditando(false)
  }

  function cancelar() {
    setNombre(operario.nombre)
    setCedula(operario.cedula)
    setEditando(false)
  }

  // Modo edicion: muestra formulario
  if (editando) {
    return (
      <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Datos del Operario
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              placeholder="Ej: Maria Lopez"
            />
          </div>
          <div>
            <label htmlFor="cedula" className="mb-1 block text-sm font-medium text-foreground">
              Cedula
            </label>
            <input
              id="cedula"
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              placeholder="Ej: 31.981.223"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelar}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-base font-medium text-foreground active:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground active:opacity-90 transition-opacity"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modo visualizacion
  return (
    <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-sm border border-border">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">Operario</p>
        <p className="truncate text-base font-semibold text-foreground">
          {operario.nombre || "Sin configurar"}
        </p>
        {operario.cedula && (
          <p className="text-sm text-muted-foreground">
            {"C.C. " + operario.cedula}
          </p>
        )}
      </div>
      <button
        onClick={() => setEditando(true)}
        className="ml-3 shrink-0 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground active:bg-muted transition-colors"
      >
        Editar
      </button>
    </div>
  )
}
