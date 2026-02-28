/**
 * Tipos para el Control de Produccion
 * 
 * Estos tipos definen la estructura de datos que replica
 * el formato Excel que se usa en la fabrica de costura.
 */

// Cada fila del formato de produccion
export interface ProductionEntry {
  id: string
  fecha: string          // Formato: "YYYY-MM-DD"
  op: string             // Orden de produccion
  ref: string            // Referencia del producto
  operacion: string      // Tipo de operacion (ej: "Cerrar costado")
  color: string          // Color de la prenda
  tpieces: {
    s: number            // Talla 2-4 / S
    m: number            // Talla 6-8 / M
    l: number            // Talla 10-12 / L
    xl: number           // Talla 14-16 / XL
    xxl: number          // Talla 18 / XXL
  }
  precio: number         // Precio por pieza
  observacion: string    // Notas adicionales
}

// Informacion del operario
export interface OperarioInfo {
  nombre: string
  cedula: string
}

// Quincena (periodo de 15 dias)
export interface Quincena {
  year: number
  month: number          // 1-12
  period: 1 | 2          // 1 = primera quincena (1-15), 2 = segunda (16-fin)
}

// Funciones helper

/**
 * Calcula el total de piezas de una entrada (suma de todas las tallas)
 */
export function calcularTotalColor(entry: ProductionEntry): number {
  const { s, m, l, xl, xxl } = entry.tpieces
  return s + m + l + xl + xxl
}

/**
 * Calcula el acumulado (suma corrida de totalColor * precio)
 * para un listado de entradas hasta el indice dado
 */
export function calcularAcumulado(entries: ProductionEntry[], index: number): number {
  let acumulado = 0
  for (let i = 0; i <= index; i++) {
    acumulado += calcularTotalColor(entries[i]) * entries[i].precio
  }
  return acumulado
}

/**
 * Genera un ID unico simple (sin librerias externas)
 */
export function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

/**
 * Formatea un numero como moneda colombiana
 */
export function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

/**
 * Genera la llave de almacenamiento para una quincena
 */
export function quincenaKey(q: Quincena): string {
  return `${q.year}-${String(q.month).padStart(2, '0')}-${q.period}`
}

/**
 * Obtiene el texto legible de la quincena (ej: "1a. Quincena de Febrero 2026")
 */
export function quincenaLabel(q: Quincena): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return `${q.period === 1 ? '1a' : '2a'}. Quincena de ${meses[q.month - 1]} ${q.year}`
}

/**
 * Obtiene la quincena actual basada en la fecha de hoy
 */
export function quincenaActual(): Quincena {
  const hoy = new Date()
  return {
    year: hoy.getFullYear(),
    month: hoy.getMonth() + 1,
    period: hoy.getDate() <= 15 ? 1 : 2,
  }
}

/**
 * Formatea una fecha de "YYYY-MM-DD" a "DD/MM" para mostrar en tarjetas
 */
export function formatearFechaCorta(fecha: string): string {
  const parts = fecha.split('-')
  return `${parts[2]}/${parts[1]}`
}
