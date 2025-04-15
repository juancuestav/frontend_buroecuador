// Dependencias
import { configuracionColumnasRegistroCivil } from '../domain/configuracionColumnasRegistroCivil'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import LimiteConsultas from 'pages/basesDeDatos/limiteConsultas/view/LimiteConsultaComponent.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RegistroCivil } from '../domain/RegistroCivil'
import { RegistroCivilController } from '../infraestructure/RegistroCivilController'
import { useLimiteConsultaStore } from 'stores/limiteConsulta'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    EssentialTablePagination,
    LimiteConsultas,
  },
  setup() {
    /*********
     * Stores
     *********/
    const limiteConsultaStore = useLimiteConsultaStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      RegistroCivil,
      new RegistroCivilController()
    )
    const { entidad: registroCivil, listado } = mixin.useReferencias()
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
      if (listado.value.length) registroCivil.hydrate(listado.value[0])
      else registroCivil.hydrate(new RegistroCivil())

      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Busqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      registroCivil,
      listado,
      configuracionColumnasRegistroCivil,
      listar,
      busqueda: ref(),
      buscar,
    }
  },
})
