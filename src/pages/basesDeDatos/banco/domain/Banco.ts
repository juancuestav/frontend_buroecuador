import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Banco extends EntidadAuditable {
  fecha: string | null = null
  tipo: string | null = null
  cedula_ruc: string | null = null
  nombre: string | null = null
  cod_entida: string | null = null
  entnombre: string | null = null
  enttipo: string | null = null
  vinculacio: string | null = null
  riesgo: string | null = null
  campo_1: string | null = null
  calificaci: string | null = null
  saldo_vige: string | null = null
  no_dvenga: string | null = null
  saldo_0_1: string | null = null
  saldo_1_2: string | null = null
  saldo_2_3: string | null = null
  saldo_3_6: string | null = null
  saldo_6_9: string | null = null
  saldo_9_12: string | null = null
  saldo_12_2: string | null = null
  saldo_24_3: string | null = null
  mas_36: string | null = null
  judicial: string | null = null
  castigo: string | null = null
  mora: string | null = null
  saldo_mora: string | null = null
  banco: string | null = null
  tipo_banco: string | null = null
}
