// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { reactive, Ref, ref } from 'vue'
import { acciones } from 'config/utils'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import Pusher from 'pusher-js'

// Logica y controladores
import { Notificacion } from 'components/notificaciones/domain/Notificacion'
import { NotificacionController } from 'components/notificaciones/infraestructure/NotificacionController'


export const useNotificationRealtimeStore = defineStore('notificaciones', () => {
  // Pusher.logToConsole = true

  // Pusher
  const pusher = new Pusher(process.env.PUSHER_APP_KEY || '75be7ac21d59f7c4a627', {
    cluster: process.env.PUSHER_APP_CLUSTER || 'sa1',
  })

  // State
  const notificacion = reactive(new Notificacion())
  const notificacionReset = new Notificacion()
  const idNotificacion = ref()
  const listadoNotificaciones: Ref<Notificacion[]> = ref([])

  const { notificarAdvertencia } = useNotificaciones()
  const accionNotificacion = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  /**
   * Consulta el listado de notificaciones en la base de datos y lo agrega a una variable listadoNotificaciones.
   */
  async function all() {
    const { result } = await new NotificacionController().listar({ leida: 0 })
    listadoNotificaciones.value = result
  }

  /**
   * If the function all() throws an error, then the function listar() will catch it and execute the
   * code in the catch block, otherwise it will execute the code in the finally block.
   */
  async function listar() {
    try {
      statusLoading.activar()
      all()
    } catch (e) {
      notificarAdvertencia('Ocurrió un error al listar todas las notificaciones')
    } finally {
      statusLoading.desactivar()
    }
  }

  /**
   * Agrega un nuevo notificacion a la base de datos.
   * @param {Notificacion} notificacion
   */
  function agregar(notificacion: Notificacion) {
    listadoNotificaciones.value.unshift(notificacion)
  }
  
  /**
   * Actualiza las notificaciones obtenidas desde la base de datos.
   * @param {Notificacion} notificacion
   */
  async function actualizar() {
    await listar()
  }


  async function marcarLeida() {
    const indiceEncontrado = listadoNotificaciones.value.findIndex((v: Notificacion) => v.id === idNotificacion.value)
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.notificaciones) + '/marcar-leida/' + idNotificacion.value
    const response: AxiosResponse = await axios.post(ruta)
    if (response.data.modelo.leida) {
      listadoNotificaciones.value.splice(indiceEncontrado, 1)
    }
    return response.data.modelo
  }

  return {
    pusher,
    notificacion,
    notificacionReset,
    idNotificacion,
    listadoNotificaciones,
    accionNotificacion,
    listar,
    agregar,
    actualizar,
    marcarLeida,
  }
})
