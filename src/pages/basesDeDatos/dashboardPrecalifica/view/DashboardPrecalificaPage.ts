import { defineComponent, ref } from 'vue'

import EssentialTable from 'components/tables/view/EssentialTable.vue'
import MultiplePageLayout from 'shared/contenedor/modules/simple/view/MultiplePageLayout.vue'

import { configuracionColumnasDashboardPrecalifica } from '../domain/configuracionColumnasDashboardPrecalifica'
import { DashboardPrecalificaController } from '../infraestructure/DashboardPrecalificaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DashboardPrecalifica } from '../domain/DashboardPrecalifica'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Usuario } from 'pages/usuarios/domain/Usuario'
import { configuracionColumnasUsuariosDashboardPrecalifica } from '../domain/configuracionColumnasUsuariosDashboardPrecalifica'
import { accionesTabla } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

export default defineComponent({
  components: { MultiplePageLayout, EssentialTable },
  setup() {
    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      DashboardPrecalifica,
      new DashboardPrecalificaController()
    )
    const { listado, tabsPage } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    //const { onListado } = mixin.useHooks()

    const usuarios = ref([])

    /*onListado(() => {
      if (listado.value.length) iess.hydrate(listado.value[0])
      else iess.hydrate(new Iess())
    })*/
    const consultarUsuarios = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const response: any = await axios.get(
        axios.getEndpoint(endpoints.usuarios_dashboard_precalifica)
      )
      usuarios.value = response.data.results
    }

    /***************
     * Botones tabla
     ***************/
    const btnMasDetalles: CustomActionTable<Usuario> = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      color: 'primary',
      accion: async ({ entidad }) => {
        tabsPage.value = '2'
        console.log(entidad)
        listar({ user_id: entidad.id })
      },
    }

    consultarUsuarios()

    return {
      mixin,
      configuracionColumnasDashboardPrecalifica,
      ccUsuariosDashboardPrecalifica: [
        ...configuracionColumnasUsuariosDashboardPrecalifica,
        accionesTabla,
      ],
      listado,
      btnMasDetalles,
      usuarios,
    }
  },
})
