import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router'

import routes from './routes'
import { useAuthenticationStore } from 'stores/authentication'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  const authentication = useAuthenticationStore()

  Router.beforeEach(async (to, _, next) => {
    const sessionIniciada = await authentication.isUserLoggedIn()
    const correoVerificado = true //authentication.correoVerificado()

    // Si la ruta requiere autenticacion
    if (to.matched.some((ruta) => ruta.meta.requiresAuth)) {
      if (process.env.APP_ID === '1')
        routerAutenticadoBuroCreditoEcuador(
          to,
          next,
          sessionIniciada,
          correoVerificado
        )
      if (process.env.APP_ID === '2')
        routerAutenticadoTrabajosEcuador(next, sessionIniciada)
    } else if (
      sessionIniciada &&
      correoVerificado &&
      ['Login', 'ResetPassword', 'register', 'codigo_verificacion'].includes(
        to.name?.toString() ?? ''
      )
    ) {
      if (process.env.APP_ID === '1') sessionIniciadaCorreoVerificado(next)
      else {
        next('/')
      }
    } else if (
      sessionIniciada &&
      !correoVerificado &&
      ['Login', 'ResetPassword', 'register'].includes(to.name?.toString() ?? '')
    ) {
      if (process.env.APP_ID === '1') sessionIniciadaCorreoNoVerificado(next)
    } else {
      next()
    }
  })

  return Router
})

/*****************
 * Mis funciones
 *****************/
const routerAutenticadoBuroCreditoEcuador = (
  to: RouteLocationNormalized,
  next: (params?: Record<string, string>) => void,
  sessionIniciada: boolean,
  correoVerificado: boolean
) => {
  const authentication = useAuthenticationStore()
  console.log(to.name)
  if (sessionIniciada) {
    if (correoVerificado) {
      if (authentication.can('acceder.' + to.name?.toString())) {
        console.log('dentro del puede acceder')

        next()
      } else {
        console.log('dentro del else')
        sessionIniciadaCorreoVerificado(next)
        // next({ name: '404' })
      }
    } else {
      console.log('dentro de codigo verificacion')
      next({ name: 'codigo_verificacion' })
    }
  } else {
    console.log('dentro de login')
    next({ name: 'Login' })
  }
}

const routerAutenticadoTrabajosEcuador = (
  next: (params?: Record<string, string>) => void,
  sessionIniciada: boolean
) => {
  if (sessionIniciada) {
    next()
  } else {
    next({ name: 'Login' })
  }
}

// revisar logica de loginRedirect en utils.ts
const sessionIniciadaCorreoVerificado = (
  next: (params?: Record<string, string>) => void
) => {
  const authentication = useAuthenticationStore()

  if (authentication.hasRole('CLIENTE')) {
    if (!authentication.planPagado) {
      next({ name: 'activar_app' })
    } else {
      next({ name: 'archivos_reportes' })
    }
  } else if (authentication.hasRole('EMPRESA')) {
    next({ name: 'busqueda_general' })
  } else {
    next({ name: 'tablero' })
  }
}

const sessionIniciadaCorreoNoVerificado = (
  next: (params?: Record<string, string> | string) => void
) => {
  next({ name: 'codigo_verificacion' })
}
