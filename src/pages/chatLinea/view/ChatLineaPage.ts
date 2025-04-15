// Dependencias
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { defineComponent } from 'vue'

import CalloutComponent from 'components/CalloutComponent.vue'

export default defineComponent({
  components: { CalloutComponent },
  setup() {
    // const store = useAuthenticationStore()
    const store = useConfiguracionGeneralStore()

    function abrirWhatsapp() {
      const celular = store.configuracion?.whatsapp ?? ''

      const phone = '593' + celular.substring(1, celular.length)
      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}&text=Quiero%20mas%20informacion%20de%20mi%20buro%20de%20credito%20`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}&text=Quiero%20mas%20informacion%20de%20mi%20buro%20de%20credito%20`
      }

      window.open(url, '_blank')
    }

    return {
      abrirWhatsapp,
    }
  },
})
