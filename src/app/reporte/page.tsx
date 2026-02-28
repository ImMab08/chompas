"use client"

/**
 * Pagina de Reporte - Replica el formato Excel para imprimir como PDF
 * 
 * COMO FUNCIONA LA GENERACION DE PDF:
 * 
 * 1. Esta pagina lee los datos de sessionStorage (los guarda la pagina principal)
 * 2. Muestra una tabla HTML que replica EXACTAMENTE el formato Excel original
 * 3. Usa window.print() del navegador para "imprimir" la pagina
 * 4. En el dialogo de impresion, selecciona "Guardar como PDF"
 * 5. Se descarga el PDF listo para entregar
 * 
 * Los estilos @media print en globals.css se encargan de:
 * - Ocultar los botones (clase "no-print")
 * - Asegurar colores correctos en la impresion
 * - Ajustar la tabla al ancho de la pagina
 * 
 * NOTA: window.print() funciona en TODOS los navegadores modernos
 * sin necesidad de instalar nada. Es la forma mas simple y confiable
 * de generar PDFs desde una pagina web.
 */

import { useState, useEffect } from "react"
import type { ProductionEntry, OperarioInfo, Quincena } from "@/src/types/production" 
import { quincenaLabel, calcularTotalColor, calcularAcumulado, formatearPrecio } from "@/src/types/production"

export default function ReportePage() {
  const [quincena, setQuincena] = useState<Quincena | null>(null)
  const [operario, setOperario] = useState<OperarioInfo | null>(null)
  const [entries, setEntries] = useState<ProductionEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Leer datos de sessionStorage (puestos por la pagina principal)
    const qData = sessionStorage.getItem("reporte_quincena")
    const oData = sessionStorage.getItem("reporte_operario")
    const eData = sessionStorage.getItem("reporte_entries")

    if (qData) setQuincena(JSON.parse(qData))
    if (oData) setOperario(JSON.parse(oData))
    if (eData) setEntries(JSON.parse(eData))
    setLoaded(true)
  }, [])

  function handlePrint() {
    window.print()
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando reporte...</p>
      </div>
    )
  }

  if (!quincena || !operario || entries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6">
        <p className="text-center text-base text-foreground">
          No hay datos para mostrar. Vuelve a la pagina principal y selecciona "Ver Reporte".
        </p>
        <a
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-base font-medium text-primary-foreground"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  // Formatear fecha de DD/MM/YYYY
  function formatFecha(fecha: string) {
    const parts = fecha.split("-")
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  // Calcular totales generales
  const totalGeneralPiezas = entries.reduce((sum, e) => sum + calcularTotalColor(e), 0)
  const totalGeneralDinero = entries.reduce((sum, e) => sum + calcularTotalColor(e) * e.precio, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <a
          href="/"
          className="flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground active:bg-muted transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver
        </a>
        <button
          onClick={handlePrint}
          className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground active:opacity-90 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir / PDF
        </button>
      </div>

      {/* Instrucciones (no se imprime) */}
      <div className="no-print mx-auto max-w-3xl px-4 py-3">
        <div className="rounded-xl bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
          <p className="font-medium">Como guardar como PDF:</p>
          <p className="mt-1 text-muted-foreground">
            {"Toca \"Imprimir / PDF\" > en el dialogo selecciona \"Guardar como PDF\" como destino > toca \"Guardar\""}
          </p>
        </div>
      </div>

      {/* Tabla tipo Excel para impresion */}
      <div className="mx-auto max-w-5xl px-2 py-4 overflow-x-auto">
        <table className="w-full border-collapse border border-foreground/80 text-xs" style={{ minWidth: 700 }}>
          {/* Encabezado principal */}
          <thead>
            <tr>
              <th
                colSpan={14}
                className="border border-foreground/80 bg-card px-2 py-2 text-center text-sm font-bold text-foreground"
              >
                CONTROL DE PRODUCCION
              </th>
            </tr>
            <tr>
              <th
                colSpan={14}
                className="border border-foreground/80 bg-card px-2 py-1.5 text-center text-sm font-semibold text-foreground"
              >
                {quincenaLabel(quincena!).toUpperCase()}
              </th>
            </tr>
            {/* Fila operario y cedula */}
            <tr>
              <th colSpan={2} className="border border-foreground/80 bg-muted px-2 py-1.5 text-left text-xs font-semibold text-foreground">
                OPERARIO
              </th>
              <th colSpan={3} className="border border-foreground/80 bg-card px-2 py-1.5 text-left text-xs font-medium text-foreground">
                {operario!.nombre}
              </th>
              <th colSpan={1} className="border border-foreground/80 bg-muted px-2 py-1.5 text-left text-xs font-semibold text-foreground">
                CEDULA
              </th>
              <th colSpan={3} className="border border-foreground/80 bg-card px-2 py-1.5 text-left text-xs font-medium text-foreground">
                {operario!.cedula}
              </th>
              <th colSpan={5} className="border border-foreground/80 bg-card px-2 py-1.5" />
            </tr>
            {/* Fila de encabezados de columnas */}
            <tr className="bg-muted">
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground w-[70px]">
                FECHA
              </th>
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground w-[40px]">
                OP
              </th>
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground w-[40px]">
                REF
              </th>
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground min-w-[100px]">
                OPERACION
              </th>
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground w-[60px]">
                COLOR
              </th>
              <th colSpan={5} className="border border-foreground/80 px-1.5 py-1 text-center font-semibold text-foreground">
                TALLA
              </th>
              <th rowSpan={2} className="border border-foreground/80 bg-muted px-1.5 py-1.5 text-center font-semibold text-foreground w-[50px]">
                TOTAL{"\n"}COLOR
              </th>
              <th rowSpan={2} className="border border-foreground/80 bg-muted px-1.5 py-1.5 text-center font-semibold text-foreground w-[60px]">
                PRECIO
              </th>
              <th rowSpan={2} className="border border-foreground/80 bg-muted px-1.5 py-1.5 text-center font-semibold text-foreground w-[80px]">
                ACUMULADO
              </th>
              <th rowSpan={2} className="border border-foreground/80 px-1.5 py-1.5 text-center font-semibold text-foreground min-w-[80px]">
                OBSERVACION
              </th>
            </tr>
            {/* Sub-encabezado de tallas */}
            <tr className="bg-muted">
              <th className="border border-foreground/80 px-1 py-1 text-center font-medium text-foreground w-[35px]">
                <div>2-4</div>
                <div className="text-muted-foreground">S</div>
              </th>
              <th className="border border-foreground/80 px-1 py-1 text-center font-medium text-foreground w-[35px]">
                <div>6-8</div>
                <div className="text-muted-foreground">M</div>
              </th>
              <th className="border border-foreground/80 px-1 py-1 text-center font-medium text-foreground w-[35px]">
                <div>10-12</div>
                <div className="text-muted-foreground">L</div>
              </th>
              <th className="border border-foreground/80 px-1 py-1 text-center font-medium text-foreground w-[35px]">
                <div>14-16</div>
                <div className="text-muted-foreground">XL</div>
              </th>
              <th className="border border-foreground/80 px-1 py-1 text-center font-medium text-foreground w-[35px]">
                <div>18</div>
                <div className="text-muted-foreground">XXL</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry, i) => {
              const totalColor = calcularTotalColor(entry)
              const acum = calcularAcumulado(entries, i)
              return (
                <tr key={entry.id} className={i % 2 === 0 ? "bg-card" : "bg-secondary/50"}>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {formatFecha(entry.fecha)}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.op}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.ref}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-left text-foreground">
                    {entry.operacion}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.color}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.tpieces.s || ""}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.tpieces.m || ""}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.tpieces.l || ""}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.tpieces.xl || ""}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-center text-foreground">
                    {entry.tpieces.xxl || ""}
                  </td>
                  <td className="border border-foreground/80 bg-muted/60 px-1.5 py-1.5 text-center font-bold text-foreground">
                    {totalColor}
                  </td>
                  <td className="border border-foreground/80 bg-muted/60 px-1.5 py-1.5 text-right font-medium text-foreground">
                    {formatearPrecio(entry.precio)}
                  </td>
                  <td className="border border-foreground/80 bg-muted/60 px-1.5 py-1.5 text-right font-bold text-foreground">
                    {formatearPrecio(acum)}
                  </td>
                  <td className="border border-foreground/80 px-1.5 py-1.5 text-left text-foreground">
                    {entry.observacion}
                  </td>
                </tr>
              )
            })}

            {/* Fila de totales */}
            <tr className="bg-primary/10 font-bold">
              <td colSpan={10} className="border border-foreground/80 px-2 py-2 text-right text-foreground">
                TOTALES:
              </td>
              <td className="border border-foreground/80 px-1.5 py-2 text-center text-foreground">
                {totalGeneralPiezas}
              </td>
              <td className="border border-foreground/80 px-1.5 py-2 text-center text-foreground" />
              <td className="border border-foreground/80 px-1.5 py-2 text-right text-primary">
                {formatearPrecio(totalGeneralDinero)}
              </td>
              <td className="border border-foreground/80" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Boton fijo abajo en movil (no se imprime) */}
      <div className="no-print fixed bottom-0 left-0 right-0 border-t border-border bg-card px-4 py-3">
        <div className="mx-auto max-w-lg">
          <button
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground active:opacity-90 transition-opacity"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>
    </div>
  )
}
