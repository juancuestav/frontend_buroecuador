import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Iess extends EntidadAuditable {
  identificacion: string | null = null
  codigo_division_politica: string | null = null
  ruc_empleador: string | null = null
  codigo_sucursal: string | null = null
  tipo_empresa: string | null = null
  nombre_empleador: string | null = null
  telefono_sucursal: string | null = null
  direccion_sucursal: string | null = null
  fax_sucursal: string | null = null
  nombre_empleado: string | null = null
  direccion_empleado: string | null = null
  telefono_empleado: string | null = null
  celular_empleado: string | null = null
  correo_empleado: string | null = null
  sueldo_empleado: string | null = null
  fecha_ingreso_empleado: string | null = null
  fecha_salida_empleado: string | null = null
  cargo_empleado: string | null = null
}
