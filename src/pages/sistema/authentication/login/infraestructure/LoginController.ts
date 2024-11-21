import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  /* async login(userLogin: UserLogin): Promise<void> {
    return this.store
      .login(userLogin)
      .then(() => {
        if (this.store.hasRole('CLIENTE')) {
          if (!this.store.planPagado) {
            this.Router.replace('/score-crediticio')
          } else {
            this.Router.replace('/activar-app')
          }
        } else {
          this.Router.replace('/')
        }
      })
      .catch((e: ApiError) => {
        throw e
      })
  } */
  respuesta = ref('Vacio - ')

  async login(userLogin: UserLogin): Promise<any> {
    // console.log('sesion')
    try {
      this.respuesta.value = this.respuesta.value + 'Antes de solicitar - '
      const user: any = await this.store.login(userLogin)
      console.log(user)
      /* console.log('respuesta response')
      console.log(response)*/
      this.respuesta.value = this.respuesta.value + 'Despues de solicitar - '
      // const roles = [user.rol]
      /* if (this.store.extraerRol(roles, 'CLIENTE')) {
        this.respuesta.value = this.respuesta.value + 'Es un cliente - '
        // console.log('es cliente')
        if (!this.store.planPagado) {
          this.respuesta.value = this.respuesta.value + 'Esta pagado - '
          this.Router.replace('/score-crediticio')
        } else {
          this.respuesta.value = this.respuesta.value + 'NO esta pagado - '
          this.Router.replace('/activar-app')
        }
      } else {
        this.respuesta.value = this.respuesta.value + 'Es admin - '
        // console.log('NO es cliente')
        this.Router.replace('/')
      } */

      return user
    } catch (error) {
      this.respuesta.value = this.respuesta.value + error
      return this.respuesta
      //throw error
    } /*finally {
      return this.respuesta
    }*/
  }

  async logout(): Promise<void> {
    return this.store
      .logout()
      .then(() => {
        this.Router.replace({ name: 'Login' })
      })
      .catch((e) => alert(e))
  }

  constructor() {
    /* watch(
      computed(() => this.store.user),
      () => {
        if (!!this.store.user.id && this.store.extraerRol('CLIENTE')) {
          console.log('es cliente')
          if (!this.store.planPagado) {
            this.Router.replace('/score-crediticio')
          } else {
            this.Router.replace('/activar-app')
          }
        } else {
          console.log('NO es cliente')
          this.Router.replace('/')
        }
      }
    ) */
  }
}
