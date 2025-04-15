import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { BancoController } from '../infraestructure/BancoController'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'
import { Banco } from '../domain/Banco'

import LimiteConsultas from 'pages/basesDeDatos/limiteConsultas/view/LimiteConsultaComponent.vue'
import { useLimiteConsultaStore } from 'stores/limiteConsulta'

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
    const mixin = new ContenedorSimpleMixin(Banco, new BancoController())
    const { entidad: banco, listado } = mixin.useReferencias()
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
      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Búsqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      banco,
      listado,
      listar,
      busqueda: ref(),
      buscar,
    }
  },
})
