import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'
import { Ref, computed } from 'vue'

const store = useAuthenticationStore()
// const esAdministrador = computed(() => store.hasRole('ADMINISTRADOR'))

// State
export const menuAdministracion: Ref<MenuOption[]> = computed(() => [
  {
    header: 'Administración',
    can: store.can('acceder.modulo_administracion'),
  },
  {
    title: 'Roles',
    icon: 'bi-person-badge',
    link: 'roles',
    can: store.can('acceder.roles'),
  },
  {
    title: 'Permisos',
    link: 'permisos',
    icon: 'bi-key-fill',
    can: store.can('acceder.permisos'),
  },
  {
    title: 'Permisos en roles',
    link: 'permisos-roles',
    icon: 'bi-person-badge-fill',
    can: store.can('acceder.permisos_roles'),
  },
  {
    title: 'Permisos de usuarios',
    link: 'permisos-usuarios',
    icon: 'bi-person-lock',
    can: store.can('acceder.permisos_usuarios'),
  },
  {
    title: 'Configuración',
    icon: 'bi-gear-fill',
    link: 'configuraciones-generales',
    can: store.can('acceder.configuraciones_generales'),
  },
])
