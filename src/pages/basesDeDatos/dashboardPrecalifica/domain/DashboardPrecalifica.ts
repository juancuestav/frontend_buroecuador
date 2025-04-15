import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DashboardPrecalifica extends EntidadAuditable {
  tabla: string | null = null
  parametros: string | null = null
  usuario: string | null = null
  ip_usuario: string | null = null
  created_at: string | null = null
  tipo: string | null = null
}
