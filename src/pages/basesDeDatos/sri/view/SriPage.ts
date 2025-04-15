import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SriController } from '../infraestructure/SriController'
import { defineComponent, ref } from 'vue'
import { Sri } from '../domain/Sri'

import LimiteConsultas from 'pages/basesDeDatos/limiteConsultas/view/LimiteConsultaComponent.vue'
import { useLimiteConsultaStore } from 'stores/limiteConsulta'
import { useNotificaciones } from 'shared/notificaciones'

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
    const mixin = new ContenedorSimpleMixin(Sri, new SriController())
    const { entidad: sri, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { onListado } = mixin.useHooks()

    /************
     * Variables
     ************/
    const { notificarAdvertencia, notificarInformacion } = useNotificaciones()

    const buscar = (busqueda) => {
      if (!busqueda) return notificarAdvertencia('Ingrese el número de cedula')
      if (
        limiteConsultaStore.consultasRealizadas >=
        limiteConsultaStore.consultasPermitidas
      )
        return notificarAdvertencia(
          'Ha alcanzado el <b>límite de consultas disponibles</b>. Por favor, <b>contáctenos si desea ampliar su cuota</b>.'
        )
      listar({ search: busqueda })
    }

    onListado(() => {
      if (listado.value.length) sri.hydrate(listado.value[0])
      else sri.hydrate(new Sri())

      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Busqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      sri,
      listado,
      listar,
      busqueda: ref(),
      buscar,
    }
  },
})
