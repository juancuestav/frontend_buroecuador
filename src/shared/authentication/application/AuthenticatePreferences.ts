import { Preferences } from '@capacitor/preferences'
import { IAuthenticate } from '../domain/Authenticate'

export class AuthenticatePreferences implements IAuthenticate {
  async saveToken(token: string) {
    await Preferences.set({
      key: 'token',
      value: token,
    })
  }

  async saveUser(user: any) {
    await Preferences.set({
      key: 'user',
      value: user,
    })
  }

  async removeToken() {
    await Preferences.remove({ key: 'token' })
  }

  async removeUser() {
    await Preferences.remove({ key: 'user' })
  }

  async getToken() {
    const { value } = await Preferences.get({ key: 'token' })
    return value
  }
}
