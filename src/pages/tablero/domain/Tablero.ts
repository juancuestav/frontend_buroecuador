import { Hidratable } from 'shared/entidad/domain/Hidratable'

export class Tablero extends Hidratable {
  usuariosVerificados: number
  usuariosNoVerificados: number
  usuariosConectados: number
  usuariosConectadosDia: number
  usuariosConectadosMes: number
  usuarioConPlanesPagados: number
  usuarioConPlanesNoPagados: number
  serviciosActivos: number
  planesActivos: number
  pedidos: number
  reportes: number
  clicks_payphone: number

  constructor() {
    super()
    this.usuariosVerificados = 0
    this.usuariosNoVerificados = 0
    this.usuariosConectados = 0
    this.usuariosConectadosDia = 0
    this.usuariosConectadosMes = 0
    this.usuarioConPlanesPagados = 0
    this.usuarioConPlanesNoPagados = 0
    this.serviciosActivos = 0
    this.planesActivos = 0
    this.pedidos = 0
    this.reportes = 0
    this.clicks_payphone = 0
  }
}
