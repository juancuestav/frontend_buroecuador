import { useAuthenticationStore } from 'stores/authentication'

const store = useAuthenticationStore()

// Buro de credito ecuador
export const loginRedirect = (roles: string[], router) => {
  console.log(roles)
  if (store.extraerRol(roles, 'CLIENTE')) {
    /****************************
     * Seccion Buro (si funciona)
     ****************************/
    if (!store.planPagado) {
      router.replace('/activar-app')
    } else {
      router.replace('/archivos-reportes')
    }
  } else if (store.extraerRol(roles, 'EMPRESA')) {
    router.replace({ name: 'busqueda_general' })
  } else {
    router.replace('/')
  }
}
