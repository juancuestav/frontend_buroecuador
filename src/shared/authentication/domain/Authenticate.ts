export interface IAuthenticate {
  saveToken(token: string): Promise<void>
  saveUser(user: string): Promise<void>
  removeToken(): Promise<void>
}
