import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'
import { Ref, computed } from 'vue'
import { estadosVerificarCuenta } from 'config/verificarCuenta/utils'

const store = useAuthenticationStore()
// const esCliente = computed(() => store.hasRole('CLIENTE'))

// State
export const menuTrabajosEcuador: Ref<MenuOption[]> = computed(() => [
  {
    header: 'Modulos',
    can: true,
  },
  {
    title: 'Tablero',
    icon: 'bi-layers-fill',
    link: '/',
    can: store.can('tablero'),
  },
  {
    title: 'Verifica tu cuenta',
    icon: 'bi-person-workspace',
    link: 'verificar-cuenta',
    can: true, //store.can('servicios'),
  },
  {
    title: 'Aprobar verificación de cuenta',
    icon: 'bi-person-workspace',
    link: 'aprobar-verificar-cuenta',
    can: store.user?.rol === 'ADMINISTRADOR', //store.can('servicios'),
  },
  {
    title: 'Ver ofertas disponibles',
    icon: 'bi-collection',
    link: 'ofertas-disponibles',
    can: store.user?.estado_verificacion === estadosVerificarCuenta.VERIFICADO || store.user?.rol === 'ADMINISTRADOR',
  },
  {
    title: 'Usuarios',
    icon: 'bi-person-fill',
    link: 'usuarios',
    can: store.can('usuarios'),
  },
])
