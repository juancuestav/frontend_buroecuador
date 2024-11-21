import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AprobarVerificarCuenta extends EntidadAuditable {
  documento_identidad_anverso: string | null
  documento_identidad_reverso: string | null
  documento_identidad_selfie: string | null
  user_id: number | null
  usuario: string | null
  estado_verificacion: string | null

  constructor() {
    super()
    this.documento_identidad_anverso = null
    this.documento_identidad_reverso = null
    this.documento_identidad_selfie = null
    this.user_id = null
    this.usuario = null
    this.estado_verificacion = null
  }
}
