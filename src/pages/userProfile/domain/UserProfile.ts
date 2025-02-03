import { Usuario } from 'pages/usuarios/domain/Usuario'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class UserProfile extends EntidadAuditable {
  puntuacion: number = 0
  user: number = 0
  usuarios: Usuario[] = []
  
  constructor() {
    super()
  }
}
