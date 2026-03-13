"use client";

import { IconDelete, IconEditSquare } from "@/src/shared/icons";
/**
 * DesktopTable - Tabla interactiva para vista de escritorio
 *
 * Replica la estructura del formato Excel original pero con
 * capacidad de edicion inline y mejor interactividad.
 * Solo se muestra en pantallas grandes (lg:).
 */

import {
  calcularTotalColor,
  calcularAcumulado,
  formatearPrecio,
  formatearFechaCorta,
} from "@/src/types/production";

import { DesktopTableProps } from "@/src/types/props/general_props";



export default function DesktopTable({
  entries,
  onEdit,
  onDelete,
}: DesktopTableProps) {
  if (entries.length === 0) return null;

  return (
    <div className="h-full rounded-xl border border-border bg-card shadow-sm">
      <div className="h-full overflow-x-hidden overflow-y-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="sticky top-0 w-full">
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                #
              </th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                Fecha
              </th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                OP
              </th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                REF
              </th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                Operacion
              </th>
              <th className="px-4 py-4 text-left font-semibold text-foreground">
                Color
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                S
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                M
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                L
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                XL
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                XXL
              </th>
              <th className="px-4 py-4 text-center font-semibold text-highlight-foreground bg-highlight/50">
                Total
              </th>
              <th className="px-4 py-4 text-right font-semibold text-foreground">
                Precio
              </th>
              <th className="px-4 py-4 text-right font-semibold text-primary bg-primary/5">
                Acumulado
              </th>
              <th className="px-4 py-4 text-center font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="h-full overflow-y-scroll">
            {entries.map((entry, index) => {
              const totalColor = calcularTotalColor(entry);
              const acumulado = calcularAcumulado(entries, index);
              return (
                <tr
                  key={entry.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground">
                    {formatearFechaCorta(entry.fecha)}
                  </td>
                  <td className="px-3 py-3 text-foreground">
                    {entry.op || "-"}
                  </td>
                  <td className="px-3 py-3 text-foreground">
                    {entry.ref || "-"}
                  </td>
                  <td
                    className="px-3 py-3 text-foreground max-w-45 truncate"
                    title={entry.operacion}
                  >
                    {entry.operacion || "-"}
                  </td>
                  <td className="px-3 py-3 text-foreground">
                    {entry.color || "-"}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground">
                    {entry.tpieces.s || "-"}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground">
                    {entry.tpieces.m || "-"}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground">
                    {entry.tpieces.l || "-"}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground">
                    {entry.tpieces.xl || "-"}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground">
                    {entry.tpieces.xxl || "-"}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-highlight-foreground bg-highlight/30">
                    {totalColor}
                  </td>
                  <td className="px-3 py-3 text-right text-foreground">
                    {formatearPrecio(entry.precio)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-primary bg-primary/5">
                    {formatearPrecio(acumulado)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(entry)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-blue-200 hover:text-primary transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <IconEditSquare />
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
