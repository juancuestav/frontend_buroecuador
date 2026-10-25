import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CodigoVerificacion extends EntidadAuditable {
  id: number | null
  descripcion: string | null
  codigo: string | null
  activo: boolean
  un_solo_uso: boolean
  codigo_enmascarado: string | null
  ultimo_uso_at: string | null
  creado_por: string | null

  constructor() {
    super()
    this.id = null
    this.descripcion = null
    this.codigo = null
    this.activo = true
    this.un_solo_uso = false
    this.codigo_enmascarado = null
    this.ultimo_uso_at = null
    this.creado_por = null
  }
}
