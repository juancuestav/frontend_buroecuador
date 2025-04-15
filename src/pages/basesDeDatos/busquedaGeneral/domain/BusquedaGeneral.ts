import { Ant } from 'pages/basesDeDatos/ant/domain/Ant'
import { Banco } from 'pages/basesDeDatos/banco/domain/Banco'
import { Iess } from 'pages/basesDeDatos/iess/domain/Iess'
import { RegistroCivil } from 'pages/basesDeDatos/registroCivil/domain/RegistroCivil'
import { Sri } from 'pages/basesDeDatos/sri/domain/Sri'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BusquedaGeneral extends EntidadAuditable {
  registroCivil: RegistroCivil = new RegistroCivil()
  banco: Banco[] = []
  iess: Iess = new Iess()
  sri: Sri = new Sri()
  ant: Ant[] = []
}
