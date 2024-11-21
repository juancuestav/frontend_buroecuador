export class RegisterUser {
  name: string | null
  apellidos: string | null
  password: string | null
  password_confirmation: string | null
  email: string | null

  constructor() {
    this.name = null
    this.apellidos = null
    this.password = null
    this.password_confirmation = null // only validation
    this.email = null
  }
}
