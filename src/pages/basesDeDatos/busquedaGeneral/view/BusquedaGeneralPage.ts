import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { BusquedaGeneralController } from '../infraestructure/BusquedaGeneralController'
import { BusquedaGeneral } from '../domain/BusquedaGeneral'
import { defineComponent, ref } from 'vue'
import { RegistroCivil } from 'pages/basesDeDatos/registroCivil/domain/RegistroCivil'
import { Banco } from 'pages/basesDeDatos/banco/domain/Banco'
import { Iess } from 'pages/basesDeDatos/iess/domain/Iess'
import { Sri } from 'pages/basesDeDatos/sri/domain/Sri'
import { Ant } from 'pages/basesDeDatos/ant/domain/Ant'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasBanco } from '../domain/configuracionColumnasBanco'

// Components
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import LimiteConsultas from 'pages/basesDeDatos/limiteConsultas/view/LimiteConsultaComponent.vue'
import { useLimiteConsultaStore } from 'stores/limiteConsulta'

export default defineComponent({
  components: { EssentialTable, LimiteConsultas },
  setup() {
    /*********
     * Stores
     *********/
    const limiteConsultaStore = useLimiteConsultaStore()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      BusquedaGeneral,
      new BusquedaGeneralController()
    )
    const { entidad: general, listado } = mixin.useReferencias()
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

    const descargarReportePdf = (busqueda) => {
      if (!busqueda) return notificarAdvertencia('Ingrese el número de cedula')
      listar({
        search: busqueda,
        export: 'pdf',
        titulo: 'Reporte precalificación ' + busqueda,
      })
    }

    onListado(() => {
      if (listado.value.length) {
        const registroCivil =
          listado.value[0].registro_civil ?? new RegistroCivil()
        const banco = listado.value[0].banco ?? new Banco()
        const iess = listado.value[0].iess ?? new Iess()
        const sri = listado.value[0].sri ?? new Sri()
        const ant = listado.value[0].ant ?? new Ant()

        general.hydrate({
          registroCivil,
          banco,
          iess,
          sri,
          ant,
        })
      } else general.hydrate(new BusquedaGeneral())

      limiteConsultaStore.incrementarConsultasRealizadas()
      notificarInformacion('Busqueda finalizada')
    })

    /*******
     * Init
     *******/
    limiteConsultaStore.consultarCantidadesRealizadasPermitidas()

    return {
      mixin,
      general,
      listado,
      listar,
      busqueda: ref(),
      buscar,
      descargarReportePdf,
      columnasBanco: configuracionColumnasBanco,
    }
  },
})
