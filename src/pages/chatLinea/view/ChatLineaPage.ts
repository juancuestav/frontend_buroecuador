// Dependencias
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { defineComponent } from 'vue'

import CalloutComponent from 'components/CalloutComponent.vue'

export default defineComponent({
  components: { CalloutComponent },
  setup() {
    const store = useConfiguracionGeneralStore()

    function abrirWhatsapp() {
      const phone = store.configuracion?.whatsapp ?? ''
      const message = store.configuracion?.mensaje_whatsapp ?? ''

      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`
      }

      window.open(url, '_blank')
    }

    function abrirWhatsappSolucionesEmpresas() {
      const phone = store.configuracion?.whatsapp_soluciones_empresas ?? ''
      const message =
        store.configuracion?.mensaje_whatsapp_soluciones_empresas ?? ''

      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`
      }

      window.open(url, '_blank')
    }

    return {
      abrirWhatsapp,
      abrirWhatsappSolucionesEmpresas,
    }
  },
})
