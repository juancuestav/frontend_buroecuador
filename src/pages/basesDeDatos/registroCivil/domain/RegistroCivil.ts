import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RegistroCivil extends EntidadAuditable {
  cedula: string | null = null
  cedula_conyugue: string | null = null
  apellidos_nombres: string | null = null
  sexo: string | null = null
  condicion: string | null = null
  fecha_nacimiento: string | null = null
  pais: string | null = null
  estado_civil: string | null = null
  conyugue: string | null = null
  apellidos_nombres_padre: string | null = null
  pais_padre: string | null = null
  cedula_padre: string | null = null
  apellidos_nombres_madre: string | null = null
  pais_madre: string | null = null
  cedula_madre: string | null = null
  direccion: string | null = null
  fecha_matrimonio: string | null = null
  puesto_ocupacion: string | null = null
  instruccion: string | null = null
  fecha_emision: string | null = null
  codigo_dactilar: string | null = null
}
