import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import {
  downloadFile,
  isAxiosError,
  notificarMensajesError,
} from 'shared/utils'
import { Contenedor } from '../../../application/contenedor.mixin'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { HooksSimples } from '../domain/hooksSimples'
import { acciones } from 'config/utils'

import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Referencias } from 'shared/contenedor/domain/Referencias/referencias'
import { useAuthenticationStore } from 'stores/authentication'
import { useRouter } from 'vue-router'
import { markRaw } from 'vue'
import { ParamsType } from 'config/types'
import { ArchivoController } from 'shared/archivos/infraestructure/ArchivoController'
import { Archivo } from 'shared/archivos/domain/Archivo'

export class ContenedorSimpleMixin<
  T extends EntidadAuditable
> extends Contenedor<
  T,
  Referencias,
  TransaccionSimpleController<T>,
  ArchivoController
> {
  private hooks = new HooksSimples()
  private statusEssentialLoading = new StatusEssentialLoading()

  constructor(
    entidad: Instanciable,
    controller: TransaccionSimpleController<T>,
    controllerFiles?: TransaccionSimpleController<Archivo>
  ) {
    super(entidad, controller, markRaw(new Referencias()), controllerFiles)
  }

  private async cargarVista(callback: () => Promise<void>): Promise<void> {
    try {
      this.statusEssentialLoading.activar()
      await callback()
    } catch (e) {
      throw e
    } finally {
      this.statusEssentialLoading.desactivar()
    }
  }

  useReferencias() {
    return { entidad: this.entidad as T, ...this.refs }
  }

  useComportamiento() {
    return {
      listar: this.listar.bind(this),
      listarArchivos: this.listarArchivos.bind(this),
      filtrar: this.filtrar.bind(this),
      consultar: this.consultar.bind(this),
      guardarArchivos: this.guardarArchivos.bind(this),
      guardar: this.guardar.bind(this),
      editar: this.editar.bind(this),
      editarParcial: this.editarParcial.bind(this),
      eliminar: this.eliminar.bind(this),
      eliminarArchivo: this.eliminarArchivo.bind(this),
      reestablecer: this.reestablecer.bind(this),
      obtenerListados: this.obtenerListados.bind(this),
      cargarVista: this.cargarVista.bind(this),
      setValidador: this.setValidador.bind(this),
      guardarFormData: this.guardarFormData.bind(this),
    }
  }

  useHooks() {
    return {
      onBeforeGuardar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeGuardar', callback),
      onGuardado: (callback: (id?: number, response_data?: any) => void) =>
        this.hooks.bindHook('onGuardado', callback),
      onBeforeConsultar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeConsultar', callback),
      onConsultado: (callback: (entidad?: any) => void) =>
        this.hooks.bindHook('onConsultado', callback),
      onBeforeModificar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeModificar', callback),
      onModificado: (callback: (id?: number, response_data?: any) => void) =>
        this.hooks.bindHook('onModificado', callback),
      onReestablecer: (callback: () => void) =>
        this.hooks.bindHook('onReestablecer', callback),
      onListado: (callback: () => void) =>
        this.hooks.bindHook('onListado', callback),
      onListadosCargados: (callback: () => void) =>
        this.hooks.bindHook('onListadosCargados', callback),
    }
  }

  // Consultar
  private async consultar(
    data: { [id: string]: number } | T,
    params?: ParamsType
  ) {
    //T) {

    this.hooks.onBeforeConsultar()

    if (data.id === null) {
      return this.notificaciones.notificarAdvertencia(
        'No se puede consultar el recurso con id null'
      )
    }

    // this.statusEssentialLoading.activar()
    const idEntidad = data.id
    try {
      this.cargarVista(async () => {
        const { result } = await this.controller.consultar(idEntidad, {
          ...this.argsDefault,
          ...params,
        })
        this.entidad.hydrate(result)
        this.entidad_copia.hydrate(JSON.parse(JSON.stringify(this.entidad)))
        this.refs.tabs.value = 'formulario'
        this.hooks.onConsultado(result)
      })

      // const usuario = new Usuario()
      // usuario.hydrate(result)
    } catch (error) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        await notificarMensajesError(mensajes, this.notificaciones)
      }
    } finally {
      // this.hooks.onConsultado(result)
      // this.statusEssentialLoading.desactivar()
    }
    // })

    /*const stop = watch(this.entidad, () => {
      if (this.entidad.id !== null) {
        this.hooks.onConsultado()
        stop()
      }
    })*/

    /*const stop = watchEffect(() => {
      console.log('dentrode  watch consultar')
      if (this.entidad.id !== null) {
        this.hooks.onConsultado()
        console.log('ha sido consultado mixin')
        //stop()
      }
    })*/
  }

  private async listar(params?: ParamsType, append = false) {
    this.statusEssentialLoading.activar()
    try {
      const { result, meta, response } = await this.controller.listar(params)
      // console.log(response.data)

      if (params?.hasOwnProperty('export'))
        return downloadFile(response.data, params.titulo, params.export)
      else if (result.length == 0)
        this.notificaciones.notificarInformacion(
          'Aún no se han agregado elementos.'
        )

      if (append) this.refs.listado.value.push(...result)
      else this.refs.listado.value = result

      this.refs.pagination.value.last_page = meta?.last_page
      this.refs.pagination.value.page = meta?.current_page
      this.refs.pagination.value.total = meta?.total
    } catch (error) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        console.log(mensajes)
        await notificarMensajesError(mensajes, this.notificaciones)
      }
      this.notificaciones.notificarError(error + '')
    } finally {
      this.statusEssentialLoading.desactivar()
    }

    this.hooks.onListado()
  }

  private async filtrar(uri: string) {
    this.cargarVista(async () => {
      try {
        const { result } = await this.controller.filtrar(uri)
        if (result.length == 0)
          this.notificaciones.notificarInformacion(
            'No se encontraron coincidencias.'
          )

        this.refs.listado.value = result
        this.notificaciones.notificarInformacion('Resultados encontrados.')
      } catch (error: any) {
        this.notificaciones.notificarError(error) //'Error al obtener el listado.')
      }
    })
  }

  private async reestablecer() {
    this.entidad.hydrate(this.entidad_vacia)
    this.refs.accion.value = acciones.nuevo
    this.refs.validador.value?.$reset()
    this.hooks.onReestablecer()
  }

  // Guardar
  // @noImplicitAny: false
  private async guardar(
    data: T,
    agregarAlListado = true,
    params?: ParamsType
  ): Promise<any> {
    this.statusEssentialLoading.activar()

    // aqui estaba onbeforeguardar POR EL CUESTIONARIO PSICOSOCIAL PERO EL SISTEMA YA FUNCIONA CON EL OB BEFORE GUARDAR EN LA LINEA 204

    if (!this.seCambioEntidad(this.entidad_vacia)) {
      this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
      this.statusEssentialLoading.desactivar()
      throw new Error('No se ha efectuado ningun cambio')
    }

    if (
      (this.refs.validador.value &&
        !(await this.refs.validador.value.$validate())) ||
      !(await this.ejecutarValidaciones())
    ) {
      this.notificaciones.notificarAdvertencia('Verifique el formulario')
      this.statusEssentialLoading.desactivar()
      throw new Error('Verifique el formulario')
    }
    this.hooks.onBeforeGuardar() // <- 19/02/2024 Se movio antes de las validaciones para realizar cambios en las variables, si da error, bajar

    try {
      const { response } = await this.controller.guardar(data, {
        ...params,
        ...this.argsDefault,
      })

      this.notificaciones.notificarCorrecto(response.data.mensaje)

      if (response.data.modelo) {
        if (Array.isArray(response.data.modelo)) {
          this.agregarElementosListadoActual(
            response.data.modelo,
            agregarAlListado
          )
        } else {
          this.agregarElementoListadoActual(
            response.data.modelo,
            agregarAlListado
          )
          this.entidad.hydrate(response.data.modelo)
        }
      }

      const copiaEntidad = JSON.parse(JSON.stringify(this.entidad))
      this.hooks.onGuardado(copiaEntidad.id, response.data)
      this.reestablecer() // antes estaba arriba de onGuardado
      return copiaEntidad
    } catch (error: any) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        await notificarMensajesError(mensajes, this.notificaciones)
      }

      throw error
    } finally {
      this.statusEssentialLoading.desactivar()
    }
  }

  /**
   * Funcion para eliminar un archivo relacionado a un modelo
   */
  private async eliminarArchivo(data: T, callback?: () => void) {
    this.notificaciones.confirmar('¿Está seguro que desea eliminar?', () => {
      if (data.id === null) {
        return this.notificaciones.notificarAdvertencia(
          'No se puede eliminar el recurso con id null'
        )
      }

      if (!this.controllerFiles)
        return this.notificaciones.notificarError(
          'El mixin requiere de una instancia de ArchivoController()'
        )

      this.controllerFiles
        .eliminarFile(data.id)
        .then(({ response }) => {
          this.notificaciones.notificarCorrecto(response.data.mensaje)
          this.eliminarElementoListaArchivosActual(data)
          // this.reestablecer()
          if (callback) callback()
        })
        .catch((error) => {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes, this.notificaciones)
          } else {
            this.notificaciones.notificarError(error.mensaje)
          }
        })
    })
  }
  /**
   * Funcion para listar todos los archivos relacionados a un modelo
   */
  private async listarArchivos(
    id: number,
    params?: ParamsType,
    append = false
  ) {
    this.statusEssentialLoading.activar()
    try {
      const { result } = await this.controller.listarFiles(id, params)
      if (result.length == 0)
        this.notificaciones.notificarInformacion(
          'Aún no se han agregado elementos'
        )

      if (append) this.refs.listadoArchivos.value.push(...result)
      this.refs.listadoArchivos.value = result
    } catch (error: any) {
      this.notificaciones.notificarError(error) //'Error al obtener el listado de archivos.')
    }
    this.statusEssentialLoading.desactivar()
  }

  /**
   * Aqui se guardan los archivos
   * @param data
   * @param agregarAlListado
   * @returns
   */
  private async guardarArchivos(id: number, data: T): Promise<any> {
    this.statusEssentialLoading.activar()
    try {
      const { response } = await this.controller.guardarFiles(id, data)

      this.notificaciones.notificarCorrecto(response.data.mensaje)
      // this.agregarElementoListadoArchivosActual(response.data.modelo)
      // console.log(response)

      return response
    } catch (error: any) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        await notificarMensajesError(mensajes, this.notificaciones)
      }
    } finally {
      this.statusEssentialLoading.desactivar()
    }
  }

  // Editar
  private async editar(data: T, resetOnUpdated = true, params?: ParamsType) {
    console.log('editar...')
    this.statusEssentialLoading.activar()

    if (this.entidad.id === null) {
      this.statusEssentialLoading.desactivar()
      return this.notificaciones.notificarAdvertencia(
        'No se puede editar el recurso con id null'
      )
    }

    if (!this.seCambioEntidad(this.entidad_copia)) {
      this.statusEssentialLoading.desactivar()
      return this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
    }

    this.hooks.onBeforeModificar()

    if (
      (this.refs.validador.value &&
        !(await this.refs.validador.value.$validate())) ||
      !(await this.ejecutarValidaciones())
    ) {
      this.notificaciones.notificarAdvertencia('Verifique el formulario')
      this.statusEssentialLoading.desactivar()
      throw new Error('Verifique el formulario')
    }

    this.cargarVista(async () => {
      try {
        const { response, result: modelo } = await this.controller.editar(
          data,
          {
            ...params,
            ...this.argsDefault,
          }
        )

        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.actualizarElementoListadoActual(modelo)
        this.entidad.hydrate(response.data.modelo)

        if (resetOnUpdated) {
          this.reestablecer()
        }

        const id: number = response.data.modelo.id ?? 0
        this.hooks.onModificado(id, response.data)
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, this.notificaciones)
        } else {
          this.notificaciones.notificarError(error.message)
        }
      }
    })
  }

  // Editar
  private async editarParcial(
    id: number,
    data: { [key: string]: any },
    params?: ParamsType
  ) {
    /*if (data.id === null) {
      return this.notificaciones.notificarAdvertencia(
        'No se puede editar el recurso con id null'
      )
    } */

    this.hooks.onBeforeModificar()

    return this.cargarVista(async () => {
      try {
        const { response, result: modelo } =
          await this.controller.editarParcial(id, data, {
            ...params,
            ...this.argsDefault,
          })

        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.actualizarElementoListadoActual(modelo)
        this.entidad.hydrate(response.data.modelo)

        // this.hooks.onReestablecer()
        this.reestablecer()
        this.hooks.onModificado(id, response.data)
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, this.notificaciones)
        } else {
          this.notificaciones.notificarError(error.message)
        }
        throw error
      }
    })
  }

  // Eliminar
  private async eliminar(data: T, callback?: () => void) {
    // this.verificarAutenticacion()

    this.notificaciones.confirmar('¿Esta seguro que desea eliminar?', () => {
      if (data.id === null) {
        return this.notificaciones.notificarAdvertencia(
          'No se puede eliminar el recurso con id null'
        )
      }

      this.controller
        .eliminar(data.id)
        .then(({ response }) => {
          this.notificaciones.notificarCorrecto(response.data.mensaje)
          this.eliminarElementoListaActual(data)
          this.reestablecer()
          if (callback) callback()
        })
        .catch((error) => {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes, this.notificaciones)
          } else this.notificaciones.notificarError(error.message)
        })
    })
  }

  // @noImplicitAny: false
  private setValidador(validador: any) {
    this.refs.validador.value = validador
  }

  private async verificarAutenticacion(): Promise<void> {
    const authentication = useAuthenticationStore()
    const autenticado = await authentication.isUserLoggedIn()
    const router = useRouter()

    if (!autenticado) router.replace({ name: 'Login' })
  }

  /* private descargarArchivoBinario(formato: string) {
    if (this.refs.listado.value.length !== 0) {
      const paramsListado: { [key: string]: any } = { opcion: 'print' }

      if (formato !== 'pdf') {
        paramsListado.opcion = 'export'
        paramsListado.format = formato
      }

      this.controller
        .descargarListado({ ...this.argsDefault, ...paramsListado })
        .then((data: any) => {
          this.utils.descargarArchivo(data, this.refs.catalogo, formato)
        })
        .catch(() =>
          this.notificaciones.notificarError(
            'No se consiguio obtener el archivo del servidor.'
          )
        )
    }
  } */

  /*******************
   * Seccion FormData
   *******************/
  // Guardar
  private async guardarFormData(formData: FormData) {
    this.hooks.onBeforeGuardar()

    this.cargarVista(async () => {
      try {
        const { response } = await this.controller.guardarFormData(
          formData,
          this.argsDefault
        )

        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.agregarElementoListadoActual(response.data.modelo)
        this.entidad.hydrate(response.data.modelo)
        this.hooks.onGuardado()
        this.reestablecer()
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      }
    })
  }
}
