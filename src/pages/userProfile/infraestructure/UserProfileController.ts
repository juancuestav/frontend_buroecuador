import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { UserProfile } from '../domain/UserProfile'
import { endpoints } from 'config/api'

export class UserProfileController extends TransaccionSimpleController<UserProfile> {
  constructor() {
    super(endpoints.user_profiles)
  }
}
