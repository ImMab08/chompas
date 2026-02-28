"use client"

/**
 * Pagina principal - Control de Produccion
 * 
 * Esta es la vista principal de la app. Aqui tu mama:
 * 1. Ve la quincena actual (puede navegar entre quincenas)
 * 2. Ve sus datos de operario
 * 3. Ve un resumen rapido (registros, piezas, total)
 * 4. Ve la lista de registros como tarjetas
 * 5. Puede agregar, editar y eliminar registros
 * 6. Puede generar el reporte en PDF (ir a pagina de impresion)
 * 
 * Todo se guarda en localStorage por ahora.
 * Cuando hagas el login, reemplaza las funciones de storage.
 */

import { useState, useEffect, useCallback } from "react"
import type { ProductionEntry, OperarioInfo, Quincena } from "@/src/types/production"
import { quincenaActual, calcularAcumulado } from "@/src/types/production"
import { guardarEntradas, cargarEntradas, guardarOperario, cargarOperario } from "@/src/lib/production-storage"
import QuincenaSelector from "@/src/components/production/QuincenaSelector"
import OperarioConfig from "@/src/components/production/OperarioConfig"
import QuincenaSummary from "@/src/components/production/QuincenaSummary"
import EntryCard from "@/src/components/production/EntryCard"
import EntryForm from "@/src/components/production/EntryForm"

export default function HomePage() {
  // Estado de la quincena seleccionada
  const [quincena, setQuincena] = useState<Quincena>(quincenaActual())
  // Datos del operario
  const [operario, setOperario] = useState<OperarioInfo>({ nombre: "", cedula: "" })
  // Lista de entradas de produccion para la quincena actual
  const [entries, setEntries] = useState<ProductionEntry[]>([])
  // Control del formulario (null = cerrado, undefined = nuevo, entry = editar)
  const [formEntry, setFormEntry] = useState<ProductionEntry | null | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  // Dialogo de confirmacion para eliminar
  const [deleteId, setDeleteId] = useState<string | null>(null)
  // Flag para saber si ya se cargo del storage
  const [loaded, setLoaded] = useState(false)

  // Cargar datos al montar y al cambiar de quincena
  useEffect(() => {
    setOperario(cargarOperario())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      setEntries(cargarEntradas(quincena))
    }
  }, [quincena, loaded])

  // Guardar entradas cuando cambian
  const persistEntries = useCallback(
    (newEntries: ProductionEntry[]) => {
      setEntries(newEntries)
      guardarEntradas(quincena, newEntries)
    },
    [quincena]
  )

  // Guardar operario
  function handleSaveOperario(info: OperarioInfo) {
    setOperario(info)
    guardarOperario(info)
  }

  // Abrir formulario para nueva entrada
  function handleNuevo() {
    setFormEntry(null)
    setShowForm(true)
  }

  // Abrir formulario para editar
  function handleEditar(entry: ProductionEntry) {
    setFormEntry(entry)
    setShowForm(true)
  }

  // Guardar entrada (nueva o editada)
  function handleSaveEntry(entry: ProductionEntry) {
    const existe = entries.findIndex((e) => e.id === entry.id)
    let newEntries: ProductionEntry[]
    if (existe >= 0) {
      // Edicion: reemplazar
      newEntries = [...entries]
      newEntries[existe] = entry
    } else {
      // Nueva: agregar al final
      newEntries = [...entries, entry]
    }
    persistEntries(newEntries)
    setShowForm(false)
    setFormEntry(undefined)
  }

  // Confirmar eliminacion
  function handleConfirmDelete() {
    if (deleteId) {
      const newEntries = entries.filter((e) => e.id !== deleteId)
      persistEntries(newEntries)
      setDeleteId(null)
    }
  }

  // Ir a la pagina de reporte para imprimir/PDF
  function handleVerReporte() {
    // Guardamos los datos en sessionStorage para que la pagina de reporte los lea
    sessionStorage.setItem("reporte_quincena", JSON.stringify(quincena))
    sessionStorage.setItem("reporte_operario", JSON.stringify(operario))
    sessionStorage.setItem("reporte_entries", JSON.stringify(entries))
    window.open("/reporte", "_blank")
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* Header fijo */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <h1 className="text-center text-lg font-bold text-foreground">
          Control de Produccion
        </h1>
      </header>

      {/* Contenido principal */}
      <div className="mx-auto max-w-lg px-4 py-4 flex flex-col gap-4">
        {/* Selector de quincena */}
        <QuincenaSelector quincena={quincena} onChange={setQuincena} />

        {/* Datos del operario */}
        <OperarioConfig operario={operario} onSave={handleSaveOperario} />

        {/* Resumen */}
        {entries.length > 0 && <QuincenaSummary entries={entries} />}

        {/* Boton generar reporte */}
        {entries.length > 0 && (
          <button
            onClick={handleVerReporte}
            className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-base font-medium text-primary active:bg-primary/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Ver Reporte / Imprimir PDF
          </button>
        )}

        {/* Lista de entradas */}
        {entries.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card px-6 py-12 text-center">
            <svg className="mx-auto mb-3 text-muted-foreground" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p className="text-base font-medium text-foreground">No hay registros</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Toca el boton de abajo para agregar tu primer registro de produccion
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={i}
                acumulado={calcularAcumulado(entries, i)}
                onEdit={handleEditar}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Boton flotante para agregar nuevo registro */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto max-w-lg">
          <button
            onClick={handleNuevo}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground active:opacity-90 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Registro
          </button>
        </div>
      </div>

      {/* Formulario full-screen */}
      {showForm && (
        <EntryForm
          entry={formEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false)
            setFormEntry(undefined)
          }}
        />
      )}

      {/* Dialogo de confirmacion de eliminacion */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Eliminar registro</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Esta segura de que desea eliminar este registro? Esta accion no se puede deshacer."}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground active:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-destructive px-4 py-3 text-base font-medium text-destructive-foreground active:opacity-90 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
