import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class VerificaCuenta extends EntidadAuditable {
  documento_identidad_anverso: string | null
  documento_identidad_reverso: string | null
  documento_identidad_selfie: string | null
  user_id: number | null

  constructor() {
    super()
    this.documento_identidad_anverso = null
    this.documento_identidad_reverso = null
    this.documento_identidad_selfie = null
    this.user_id = null
  }
}
