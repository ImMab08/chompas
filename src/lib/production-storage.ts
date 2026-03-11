/**
 * production-storage.ts
 * 
 * Utilidades para guardar y cargar datos en localStorage.
 * 
 * NOTA PARA TU HIJO: Cuando implementes el login y la base de datos,
 * reemplaza estas funciones por llamadas a tu API/backend.
 * La interfaz (los nombres de funcion y sus tipos) se mantiene igual,
 * solo cambia la implementacion interna.
 */

import type { ProductionEntry, OperarioInfo, Quincena } from "@/src/types/production"
import { quincenaKey } from "@/src/types/production"

const ENTRIES_PREFIX = "produccion_entries_"
const OPERARIO_KEY = "produccion_operario"

/**
 * Guarda las entradas de una quincena
 */
export function guardarEntradas(q: Quincena, entries: ProductionEntry[]): void {
  if (typeof window === "undefined") return
  const key = ENTRIES_PREFIX + quincenaKey(q)
  localStorage.setItem(key, JSON.stringify(entries))
}

/**
 * Carga las entradas de una quincena
 */
export function cargarEntradas(q: Quincena): ProductionEntry[] {
  if (typeof window === "undefined") return []
  const key = ENTRIES_PREFIX + quincenaKey(q)
  const data = localStorage.getItem(key)
  if (!data) return []
  try {
    return JSON.parse(data) as ProductionEntry[]
  } catch {
    return []
  }
}

/**
 * Guarda los datos del operario
 */
export function guardarOperario(info: OperarioInfo): void {
  if (typeof window === "undefined") return
  localStorage.setItem(OPERARIO_KEY, JSON.stringify(info))
}

/**
 * Carga los datos del operario
 */
export function cargarOperario(): OperarioInfo {
  if (typeof window === "undefined") return { nombre: "", cedula: "" }
  const data = localStorage.getItem(OPERARIO_KEY)
  if (!data) return { nombre: "", cedula: "" }
  try {
    return JSON.parse(data) as OperarioInfo
  } catch {
    return { nombre: "", cedula: "" }
  }
}
