import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AntController } from '../infraestructure/AntController'
import { defineComponent, ref } from 'vue'
import { Ant } from '../domain/Ant'
import { useNotificaciones } from 'shared/notificaciones'
import { useLimiteConsultaStore } from 'stores/limiteConsulta'

import LimiteConsultas from 'pages/basesDeDatos/limiteConsultas/view/LimiteConsultaComponent.vue'

export default defineComponent({
  components: { LimiteConsultas },
  setup() {
    /*********
     * Stores
     *********/
    const limiteConsultaStore = useLimiteConsultaStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ant, new AntController())
    const { entidad: ant, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { onListado } = mixin.useHooks()

    /************
     * Variables
     ************/
    const { notificarAdvertencia, notificarInformacion } = useNotificaciones()

    const buscarPorCedula = (busqueda) => {
      if (!busqueda) return notificarAdvertencia('Ingrese el número de cedula')
      if (
        limiteConsultaStore.consultasRealizadas >=
        limiteConsultaStore.consultasPermitidas
      )
        return notificarAdvertencia(
          'Ha alcanzado el <b>límite de consultas disponibles</b>. Por favor, <b>contáctenos si desea ampliar su cuota</b>.'
        )
      listar({ cedula: busqueda })
    }

    const buscarPorPlaca = (busqueda) => {
      if (!busqueda) return notificarAdvertencia('Ingrese el número de cedula')
      if (
        limiteConsultaStore.consultasRealizadas >=
        limiteConsultaStore.consultasPermitidas
      )
        return notificarAdvertencia(
          'Ha alcanzado el <b>límite de consultas disponibles</b>. Por favor, <b>contáctenos si desea ampliar su cuota</b>.'
        )
      listar({ placa: busqueda })
    }

    onListado(() => {
      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Busqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      ant,
      listado,
      listar,
      busqueda: ref(),
      buscarPorCedula,
      buscarPorPlaca,
      modoBusqueda: ref('CEDULA'),
    }
  },
})
