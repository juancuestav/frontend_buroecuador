import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CompraReporte extends EntidadAuditable {
  cliente_nombre: string | null
  identificacion: string | null
  tipo_identificacion: 'cedula' | 'ruc' | null
  tipo_reporte: 'normal' | 'gold' | 'premium' | 'empresa' | null
  telefono: string | null
  concepto_original: string | null
  estado:
    | 'pago_recibido'
    | 'reporte_generado'
    | 'reporte_entregado'
    | 'error'
    | null
  fecha_recibido: string | null
  fecha_generado: string | null
  fecha_entregado: string | null
  fecha_actualizacion: string | null
  reporte_referencia: number | null
  nombre_archivo: string | null
  ruta_archivo: string | null
  enviado_wa: boolean | null
  fecha_envio_wa: string | null
  reporte_telefono_cliente: string | null

  // Campos derivados, calculados en el listado tras cada carga (no vienen de
  // la API): EssentialTablePagination lee `row[col.name]` directo en su celda
  // por defecto, sin soportar columnas con formato vía función.
  estado_label: string | null
  fecha_recibido_fmt: string | null
  fecha_entregado_fmt: string | null
  tiempo_transcurrido_fmt: string | null

  // Placeholder requerido por EssentialTablePagination para renderizar la
  // columna de botones de acciones (no lee datos reales de este campo).
  acciones: string | null

  constructor() {
    super()
    this.cliente_nombre = null
    this.identificacion = null
    this.tipo_identificacion = null
    this.tipo_reporte = null
    this.telefono = null
    this.concepto_original = null
    this.estado = null
    this.fecha_recibido = null
    this.fecha_generado = null
    this.fecha_entregado = null
    this.fecha_actualizacion = null
    this.reporte_referencia = null
    this.nombre_archivo = null
    this.ruta_archivo = null
    this.enviado_wa = null
    this.fecha_envio_wa = null
    this.reporte_telefono_cliente = null
    this.estado_label = null
    this.fecha_recibido_fmt = null
    this.fecha_entregado_fmt = null
    this.tiempo_transcurrido_fmt = null
    this.acciones = null
  }
}
