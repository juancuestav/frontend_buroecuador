import { Configuracion } from 'pages/configuraciones/domain/Configuracion'
import { ConfiguracionController } from 'pages/configuraciones/infraestructure/ConfiguracionController'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useConfiguracionGeneralStore = defineStore(
  'configuracion_general',
  () => {
    // State
    const configuracion: Ref<Configuracion | undefined> = ref()

    async function consultarConfiguracion() {
      const controlador = new ConfiguracionController()
      await controlador
        .listar()
        .then((response: any) => (configuracion.value = response.result[0]))
    }

    function refrescarConfiguracion() {
      consultarConfiguracion()
    }

    /* function cambiarFavicon2() {
      const rutaImagen = configuracion.value?.logo_claro
      // console.log(rutaImagen)

      if (rutaImagen) {
        const link: any =
          document.querySelector('link[rel*="icon"]') ||
          document.createElement('link')
        link.type = 'image/x-icon'
        link.rel = 'icon'
        link.href = rutaImagen
        document.getElementsByTagName('head')[0].appendChild(link)
      }
    } */

    function cambiarFavicon() {
      const rutaImagen = configuracion.value?.logo_claro

      if (rutaImagen) {
        // Intenta obtener el elemento de favicon existente
        let link: any = document.querySelector('link[rel="icon"]')

        // Si no existe, crea uno nuevo
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }

        // Asigna el tipo y la ruta de la imagen
        link.type = 'image/x-icon'
        link.href = rutaImagen
      }
    }

    return {
      configuracion,
      consultarConfiguracion,
      refrescarConfiguracion,
      cambiarFavicon,
    }
  }
)
