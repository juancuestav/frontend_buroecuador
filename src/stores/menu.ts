import { defineStore } from 'pinia'
import { MenuOption } from 'shared/menu/MenuOption'
import { computed, Ref } from 'vue'
import { menuBuroCreditoEcuador } from './menuBuroCreditoEcuador'
import { menuTrabajosEcuador } from './menuTrabajosEcuador'
import { menuAdministracion } from './menuAdministracion'

export const useMenuStore = defineStore('menu', () => {
  // const store = useAuthenticationStore()
  // const esCliente = computed(() => store.hasRole('CLIENTE'))
  const mostrarBuroCreditoEcuadorEcuador = process.env.APP_ID === '1'
  const mostrarTrabajosEcuador = process.env.APP_ID === '2'

  // const appId = process.env.APP_ID

  // State
  const links: Ref<MenuOption[]> = computed(() => {
    if (mostrarBuroCreditoEcuadorEcuador)
      return [...menuBuroCreditoEcuador.value, ...menuAdministracion.value]
    if (mostrarTrabajosEcuador)
      return [...menuTrabajosEcuador.value, ...menuAdministracion.value]
    return []
  })

  return {
    links,
  }
})
