import { useAuthenticationStore } from 'stores/authentication'

const store = useAuthenticationStore()

// Buro de credito ecuador
export const loginRedirect = (roles: string[], router) => {
  if (store.extraerRol(roles, 'CLIENTE')) {
    /****************************
     * Seccion Buro (si funciona)
     ****************************/
    if (!store.planPagado) {
      router.replace('/activar-app')
    } else {
      router.replace('/archivos-reportes')
    }
  } else {
    router.replace('/')
  }
}
