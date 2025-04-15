import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { IessController } from '../infraestructure/IessController'
import { defineComponent, ref } from 'vue'
import { Iess } from '../domain/Iess'

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
    const mixin = new ContenedorSimpleMixin(Iess, new IessController())
    const { entidad: iess, listado } = mixin.useReferencias()
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
      if (listado.value.length) iess.hydrate(listado.value[0])
      else iess.hydrate(new Iess())

      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Búsqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      iess,
      listado,
      listar,
      busqueda: ref(),
      buscar,
    }
  },
})
