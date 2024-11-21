import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Usuario extends EntidadAuditable {
  name: string | null
  apellidos: string | null
  celular: string | null
  email: string | null
  email_verified_at: string | null
  tipo_identificacion: number | null
  identificacion: string | null
  password: string | null
  password_confirmation: string | null
  direccion: string | null
  codigo_verificacion: string | null
  edad: string | null
  rol: []
  puede_recibir_notificaciones: boolean
  created_at: string | null
  verificado: boolean
  codigo_reclutador: string | null
  roles: []
  permisos: []

  constructor() {
    super()
    this.name = null
    this.apellidos = null
    this.celular = null
    this.email = null
    this.email_verified_at = null
    this.tipo_identificacion = null
    this.identificacion = null
    this.password = null
    this.password_confirmation = null
    this.direccion = null
    this.codigo_verificacion = null
    this.edad = null
    this.rol = []
    this.puede_recibir_notificaciones = false
    this.created_at = null
    this.verificado = false
    this.codigo_reclutador = null
    this.roles = []
    this.permisos = []
  }
}
