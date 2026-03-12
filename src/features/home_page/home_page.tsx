"use client";

/**
 * Pagina principal - Control de Produccion
 *
 * Diseño responsivo:
 * - MOVIL: Tarjetas apiladas, boton flotante abajo
 * - ESCRITORIO: Layout de 3 columnas (sidebar izq + tabla central + stats derecha)
 */

import { useState, useEffect, useCallback } from "react";
import type {
  ProductionEntry,
  OperarioInfo,
  Quincena,
} from "@/src/types/production";
import { quincenaActual, calcularAcumulado } from "@/src/types/production";
import {
  guardarEntradas,
  cargarEntradas,
  guardarOperario,
  cargarOperario,
} from "@/src/lib/production-storage";

import QuincenaSelector from "@/src/components/production/quincena_selector";
import OperarioConfig from "@/src/components/production/operario_config";
import QuincenaSummary from "@/src/components/production/quincena_summary";
import EntryCard from "@/src/components/production/entry_card";
import EntryForm from "@/src/components/production/entry_form";
import DesktopTable from "@/src/components/production/desktop_table";
import StatsPanel from "@/src/components/production/stats_panel";
import { Header } from "@/src/shared/header";
import { IconAdd } from "@/src/shared/icons";

export function HomePage() {
  const [quincena, setQuincena] = useState<Quincena>(quincenaActual());
  const [operario, setOperario] = useState<OperarioInfo>({
    nombre: "",
    cedula: "",
  });
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [formEntry, setFormEntry] = useState<
    ProductionEntry | null | undefined
  >(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOperario(cargarOperario());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setEntries(cargarEntradas(quincena));
    }
  }, [quincena, loaded]);

  const persistEntries = useCallback(
    (newEntries: ProductionEntry[]) => {
      setEntries(newEntries);
      guardarEntradas(quincena, newEntries);
    },
    [quincena],
  );

  function handleSaveOperario(info: OperarioInfo) {
    setOperario(info);
    guardarOperario(info);
  }

  function handleNuevo() {
    setFormEntry(null);
    setShowForm(true);
  }

  function handleEditar(entry: ProductionEntry) {
    setFormEntry(entry);
    setShowForm(true);
  }

  function handleSaveEntry(entry: ProductionEntry) {
    const existe = entries.findIndex((e) => e.id === entry.id);
    let newEntries: ProductionEntry[];
    if (existe >= 0) {
      newEntries = [...entries];
      newEntries[existe] = entry;
    } else {
      newEntries = [...entries, entry];
    }
    persistEntries(newEntries);
    setShowForm(false);
    setFormEntry(undefined);
  }

  function handleConfirmDelete() {
    if (deleteId) {
      const newEntries = entries.filter((e) => e.id !== deleteId);
      persistEntries(newEntries);
      setDeleteId(null);
    }
  }

  function handleVerReporte() {
    sessionStorage.setItem("reporte_quincena", JSON.stringify(quincena));
    sessionStorage.setItem("reporte_operario", JSON.stringify(operario));
    sessionStorage.setItem("reporte_entries", JSON.stringify(entries));
    window.open("/reporte", "_blank");
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* === HEADER === */}
      <Header handleNuevo={handleNuevo} />

      {/* === MOBILE LAYOUT === */}
      <div className="lg:hidden pb-28">
        <div className="mx-auto max-w-lg px-4 py-4 flex flex-col gap-4">
          <QuincenaSelector quincena={quincena} onChange={setQuincena} />
          <OperarioConfig operario={operario} onSave={handleSaveOperario} />
          {entries.length > 0 && <QuincenaSummary entries={entries} />}

          {entries.length > 0 && (
            <button
              onClick={handleVerReporte}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-base font-medium text-primary active:bg-primary/10 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Ver Reporte / Imprimir PDF
            </button>
          )}

          {entries.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border bg-card px-6 py-12 text-center">
              <svg
                className="mx-auto mb-3 text-muted-foreground"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p className="text-base font-medium text-foreground">
                No hay registros
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Toca el boton de abajo para agregar tu primer registro
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

        {/* Boton flotante movil */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto max-w-lg">
            <button
              onClick={handleNuevo}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground active:opacity-90 transition-opacity"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar Registro
            </button>
          </div>
        </div>
      </div>

      {/* === DESKTOP LAYOUT === */}
      <div className="hidden lg:flex h-full overflow-hidden">
        <div className="mx-auto max-w-400 flex h-full px-6 py-6 overflow-hidden">
          <div className="flex gap-6 h-full overflow-hidden">
            <div className="w-auto shrink-0 flex flex-col gap-4 overflow-hidden">
              <QuincenaSelector quincena={quincena} onChange={setQuincena} />
              <div className="h-full overflow-hidden">
                {entries.length === 0 ? (
                  <div className="w-full h-full min-w-225 rounded-xl border-2 border-dashed border-border bg-card px-8 py-16 text-center flex flex-col items-center justify-center space-y-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-secondary rounded-xl">
                      <IconAdd width={50} height={50} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        No hay registros en esta quincena
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Haz clic en &quot;Nuevo reporte&quot; para comenzar
                      </p>
                      <button
                        onClick={handleNuevo}
                        className="cursor-pointer mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <IconAdd />
                        Agregar Primer Registro
                      </button>
                    </div>
                  </div>
                ) : (
                  <DesktopTable
                    entries={entries}
                    onEdit={handleEditar}
                    onDelete={(id) => setDeleteId(id)}
                  />
                )}
              </div>
            </div>

            {/* Sidebar Derecho - Stats */}
            <aside className="w-72 shrink-0">
              {entries.length > 0 ? (
                <StatsPanel entries={entries} />
              ) : (
                <div className="rounded-xl bg-card p-4 shadow-sm border border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Las estadisticas aparecen cuando agregues registros
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* === MODALES === */}

      {/* Formulario */}
      {showForm && (
        <EntryForm
          entry={formEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false);
            setFormEntry(undefined);
          }}
        />
      )}

      {/* Confirmar eliminacion */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">
              Eliminar registro
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {
                "Esta segura de que desea eliminar este registro? Esta accion no se puede deshacer."
              }
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-destructive px-4 py-3 text-base font-medium text-destructive-foreground hover:opacity-90 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
