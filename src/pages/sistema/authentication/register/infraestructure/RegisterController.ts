import { useAuthenticationStore } from 'stores/authentication'
import { RegisterUser } from '../domain/registerUser.domain'

export class RegisterController {
  store = useAuthenticationStore()

  async registrarUsuario(registerUser: RegisterUser): Promise<void> {
    return await this.store.registrarUsuario(registerUser)
  }
}
