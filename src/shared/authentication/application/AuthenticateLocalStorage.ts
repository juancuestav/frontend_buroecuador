import { LocalStorage } from 'quasar'
import { IAuthenticate } from '../domain/Authenticate'

export class AuthenticateLocalStorage implements IAuthenticate {
  async saveToken(token: string) {
    LocalStorage.set('token', token)
  }

  async saveUser(user: any) {
    LocalStorage.set('user', user)
  }

  async removeToken() {
    LocalStorage.remove('token')
  }

  async removeUser() {
    LocalStorage.remove('user')
  }

  async getToken(): Promise<any> {
    return LocalStorage.getItem('token')
  }
}
