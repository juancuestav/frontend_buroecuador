import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ArchivoReporte extends EntidadAuditable {
  titulo: string | null
  user: number | null
  subido_por_user: number | null
  reporte: number | null
  archivos: number | null
  usuarios: any[]

  constructor() {
    super()
    this.titulo = null
    this.user = null
    this.subido_por_user = null
    this.reporte = null
    this.archivos = null
    this.usuarios = []
  }
}
