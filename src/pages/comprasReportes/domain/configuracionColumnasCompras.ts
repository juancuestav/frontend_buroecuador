import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { celdaColorPorValor } from 'components/tables/domain/celdaColorPorValor'
import { CompraReporte } from './CompraReporte'

// Quasar no tiene una clase a nivel de fila (no existe `table-row-class-fn`
// en esta versión de QTable) — solo por columna, vía `classes`. Se aplica la
// misma función a todas las columnas para que la fila completa se vea
// resaltada cuando el estado es "error".
const filaErrorClass = (row: CompraReporte) =>
  row.estado === 'error' ? 'compras-reportes-fila-error' : ''

// Fondo de celda por estado, en la columna "Estado actual" (ver
// celdaColorPorValor.ts para la utilidad reutilizable). Se mapea sobre el
// `estado` real (no `estado_label`, su traducción) para no depender del
// texto mostrado.
const colorPorEstado = celdaColorPorValor<CompraReporte>(
  (row) => row.estado,
  {
    pago_recibido: 'bg-blue-grey-1 text-dark',
    reporte_generado: 'bg-orange-1 text-dark',
    reporte_entregado: 'bg-green-1 text-dark',
    error: 'bg-red-1 text-dark',
  }
)

export const configuracionColumnasCompras: ColumnConfig<CompraReporte>[] = [
  {
    name: 'cliente_nombre',
    field: 'cliente_nombre',
    label: 'Cliente',
    align: 'left',
    sortable: true,
    classes: filaErrorClass,
  },
  {
    name: 'identificacion',
    field: 'identificacion',
    label: 'Identificación',
    align: 'left',
    sortable: true,
    classes: filaErrorClass,
  },
  {
    name: 'tipo_reporte',
    field: 'tipo_reporte',
    label: 'Tipo de reporte',
    align: 'left',
    sortable: true,
    classes: filaErrorClass,
  },
  {
    name: 'fecha_recibido_fmt',
    field: 'fecha_recibido_fmt',
    label: 'Fecha de compra',
    align: 'left',
    classes: filaErrorClass,
  },
  // Nota: la columna no se llama "estado" a propósito — ese nombre tiene un
  // renderizador especial hardcodeado dentro de EssentialTablePagination.vue
  // (chips para RETRASADO/ACEPTADO/COMPLETADO/etc.) que no coincide con
  // nuestro vocabulario y dejaría la celda vacía.
  {
    name: 'estado_label',
    field: 'estado_label',
    label: 'Estado actual',
    align: 'left',
    classes: colorPorEstado,
  },
  {
    name: 'tiempo_transcurrido_fmt',
    field: 'tiempo_transcurrido_fmt',
    label: 'Tiempo transcurrido',
    align: 'left',
    classes: filaErrorClass,
  },
  {
    name: 'fecha_entregado_fmt',
    field: 'fecha_entregado_fmt',
    label: 'Fecha de entrega',
    align: 'left',
    classes: filaErrorClass,
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'center',
    classes: filaErrorClass,
  },
]
