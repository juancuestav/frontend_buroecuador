/* eslint-disable @typescript-eslint/no-empty-function */
import { Hooks } from './hooks'

export class ActionHooks<T> extends Hooks<T> {
  onBeforeGuardar: () => void
  onGuardado: (id?: number, response_data?: any) => void
  onBeforeModificar: () => void
  onModificado: (id?: number, response_data?: any) => void
  onBeforeConsultar: () => void
  onConsultado: (entidad?: any) => void
  onReestablecer: () => void
  onListado: () => void
  onListadosCargados: () => void

  constructor() {
    super()
    this.onBeforeGuardar = () => { }
    this.onGuardado = () => { }
    this.onBeforeModificar = () => { }
    this.onModificado = () => { }
    this.onBeforeConsultar = () => { }
    this.onConsultado = () => { }
    this.onReestablecer = () => { }
    this.onListado = () => { }
    this.onListadosCargados = () => { }
  }
}
