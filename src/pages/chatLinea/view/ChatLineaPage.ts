// Dependencias
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // const store = useAuthenticationStore()
    const store = useConfiguracionGeneralStore()

    function abrirWhatsapp() {
      const celular = store.configuracion?.whatsapp ?? ''

      const phone = '593' + celular.substring(1, celular.length)
      let url: string

      if (window.innerWidth < 768) {
        url = `https://api.whatsapp.com/send?phone=${phone}`
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}`
      }

      window.open(url, '_blank')
    }

    return {
      abrirWhatsapp,
    }
  },
})