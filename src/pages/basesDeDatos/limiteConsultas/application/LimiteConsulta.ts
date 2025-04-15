export class LimiteConsulta {
  consultasRealizadas: number = 0
  consultasPermitidas: number = 0

  consultarCantidadesRealizadasPermitidas() {
    this.consultasRealizadas = 0
    this.consultasPermitidas = 0
  }

  incrementarConsultasRealizadas() {
    this.consultasRealizadas++
    console.log(this.consultasRealizadas)
  }
}
