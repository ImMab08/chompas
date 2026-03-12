"use client";

/**
 * Pagina de Reporte - Replica el formato Excel para imprimir como PDF
 */

import { useState, useEffect } from "react";
import type {
  ProductionEntry,
  OperarioInfo,
  Quincena,
} from "@/src/types/production";
import {
  quincenaLabel,
  calcularTotalColor,
  calcularAcumulado,
  formatearPrecio,
} from "@/src/types/production";
import Link from "next/link";

export function ReportePage() {
  const [quincena, setQuincena] = useState<Quincena | null>(null);
  const [operario, setOperario] = useState<OperarioInfo | null>(null);
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // --- CONFIGURACIÓN DE IMPRESIÓN ---
  // Ajusta este número según los márgenes de la impresora. 
  // 15 o 16 suele encajar perfecto en una hoja Horizontal (Landscape).
  const MIN_FILAS = 17; 

  useEffect(() => {
    const qData = sessionStorage.getItem("reporte_quincena");
    const oData = sessionStorage.getItem("reporte_operario");
    const eData = sessionStorage.getItem("reporte_entries");

    if (qData) setQuincena(JSON.parse(qData));
    if (oData) setOperario(JSON.parse(oData));
    if (eData) setEntries(JSON.parse(eData));
    setLoaded(true);
  }, []);

  function handlePrint() {
    window.print();
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        <p>Cargando reporte...</p>
      </div>
    );
  }

  if (!quincena || !operario || entries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-center text-base text-black">
          No hay datos para mostrar. Vuelve a la pagina principal y selecciona
          &quot;Ver Reporte&quot;.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-blue-600 px-6 py-3 text-base font-medium text-white"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  function formatFecha(fecha: string) {
    const parts = fecha.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  const totalGeneralPiezas = entries.reduce(
    (sum, e) => sum + calcularTotalColor(e),
    0,
  );
  const totalGeneralDinero = entries.reduce(
    (sum, e) => sum + calcularTotalColor(e) * e.precio,
    0,
  );

  // Calcular cuántas filas vacías necesitamos para llenar la hoja
  const filasFaltantes = entries.length < MIN_FILAS ? MIN_FILAS - entries.length : 0;
  const filasVacias = Array.from({ length: filasFaltantes });

  return (
    <div className="min-h-screen bg-white">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <Link
          href="/"
          className="flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver
        </Link>
        <button
          onClick={handlePrint}
          className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition-opacity active:opacity-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir / PDF
        </button>
      </div>

      {/* Tabla tipo Excel para impresion */}
      <div className="mx-auto max-w-5xl overflow-x-auto px-2 py-6">
        <table
          className="w-full border-collapse border border-black text-xs text-black"
          style={{
            minWidth: 800,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <thead>
            {/* ... Tu THEAD queda exactamente igual al anterior ... */}
            <tr>
              <th colSpan={14} className="border border-black bg-[#E2E8F0] py-1.5 text-center text-sm font-bold uppercase">
                CONTROL DE PRODUCCIÓN
              </th>
            </tr>
            <tr>
              <th colSpan={14} className="border border-black bg-[#E2E8F0] py-1 text-center text-xs font-bold uppercase">
                {quincenaLabel(quincena!).toUpperCase()}
              </th>
            </tr>
            <tr>
              <th colSpan={3} className="border border-black px-2 py-1 text-left text-xs font-bold uppercase">OPERARIO</th>
              <th colSpan={1} className="border border-black px-2 py-1 text-left text-xs font-bold uppercase">CÉDULA</th>
              <th colSpan={6} rowSpan={2} className="border border-black py-1 text-center text-xs font-bold uppercase">TALLA</th>
              <th rowSpan={4} className="border border-black bg-[#E2E8F0] px-1 py-1 text-center text-[10px] font-bold uppercase leading-tight w-13.75">TOTAL<br />COLOR</th>
              <th rowSpan={4} className="border border-black px-1 py-1 text-center text-[10px] font-bold uppercase w-18.75">PRECIO</th>
              <th rowSpan={4} className="border border-black bg-[#E2E8F0] px-1 py-1 text-center text-[10px] font-bold uppercase w-21.25">ACUMULADO</th>
              <th rowSpan={4} className="border border-black px-1 py-1 text-center text-[10px] font-bold uppercase min-w-22.5">OBSERVACIÓN</th>
            </tr>
            <tr>
              <th colSpan={3} className="border border-black px-2 py-1 text-left text-xs font-medium">{operario!.nombre}</th>
              <th colSpan={1} className="border border-black px-2 py-1 text-left text-xs font-medium">{operario!.cedula}</th>
            </tr>
            <tr>
              <th rowSpan={2} className="border border-black px-1 py-1 text-center text-[10px] font-bold w-18.75">FECHA</th>
              <th rowSpan={2} className="border border-black px-1 py-1 text-center text-[10px] font-bold w-11.25">OP</th>
              <th rowSpan={2} className="border border-black px-1 py-1 text-center text-[10px] font-bold w-11.25">REF</th>
              <th rowSpan={2} className="border border-black px-1 py-1 text-center text-[10px] font-bold min-w-25">OPERACIÓN</th>
              <th rowSpan={2} className="border border-black px-1 py-1 text-center text-[10px] font-bold w-16.25">COLOR</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold w-8.75">2-4</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold w-8.75">6-8</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold w-8.75">10-12</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold w-8.75">14-16</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold w-8.75">18</th>
            </tr>
            <tr>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold">S</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold">M</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold">L</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold">XL</th>
              <th className="border border-black px-1 py-0.5 text-center text-[10px] font-bold">XXL</th>
            </tr>
          </thead>

          <tbody>
            {/* 1. RENDERIZAR DATOS REALES */}
            {entries.map((entry, i) => {
              const totalColor = calcularTotalColor(entry);
              const acum = calcularAcumulado(entries, i);
              return (
                <tr key={entry.id} className="h-7">
                  <td className="border border-black px-1.5 py-1 text-center">{formatFecha(entry.fecha)}</td>
                  <td className="border border-black px-1.5 py-1 text-center">{entry.op}</td>
                  <td className="border border-black px-1.5 py-1 text-center">{entry.ref}</td>
                  <td className="border border-black px-1.5 py-1 text-left">{entry.operacion}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.color}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.tpieces.s || ""}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.tpieces.m || ""}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.tpieces.l || ""}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.tpieces.xl || ""}</td>
                  <td className="border border-black px-4 py-1 text-center">{entry.tpieces.xxl || ""}</td>
                  <td className="border border-black bg-[#E2E8F0] px-1.5 py-1 text-center font-bold">{totalColor}</td>
                  <td className="border border-black px-1.5 py-1 text-right font-medium">{formatearPrecio(entry.precio)}</td>
                  <td className="border border-black bg-[#E2E8F0] px-1.5 py-1 text-right font-bold">{formatearPrecio(acum)}</td>
                  <td className="border border-black px-1.5 py-1 text-left">{entry.observacion}</td>
                </tr>
              );
            })}

            {/* 2. RENDERIZAR FILAS VACÍAS (RELLENO) */}
            {filasVacias.map((_, index) => (
              <tr key={`empty-${index}`} className="h-7">
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black bg-[#E2E8F0] px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
                <td className="border border-black bg-[#E2E8F0] px-1.5 py-1"></td>
                <td className="border border-black px-1.5 py-1"></td>
              </tr>
            ))}

            {/* Fila de totales finales */}
            <tr className="bg-[#f8fafc] font-bold h-7.5">
              <td colSpan={10} className="border border-black px-2 py-1 text-left uppercase">
                TOTALES:
              </td>
              <td className="border border-black px-1.5 py-1 text-center text-[11px]">
                {totalGeneralPiezas}
              </td>
              <td className="border border-black px-1.5 py-1 text-center" />
              <td className="border border-black px-1.5 py-1 text-right text-[11px]">
                {formatearPrecio(totalGeneralDinero)}
              </td>
              <td className="border border-black" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Boton fijo abajo en movil (no se imprime) */}
      <div className="no-print fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 sm:hidden">
        {/* ... (mismo botón móvil de antes) ... */}
      </div>
    </div>
  );
}