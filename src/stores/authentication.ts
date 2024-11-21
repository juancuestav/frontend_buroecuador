/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterUser } from 'pages/sistema/authentication/register/domain/registerUser.domain'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { UserLogin } from 'src/pages/sistema/authentication/login/domain/UserLogin'
import { ApiError } from 'shared/error/domain/ApiError'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AxiosResponse } from 'axios'
import { rolesSistema } from 'config/utils'
import { AuthenticateLocalStorage } from 'shared/authentication/application/AuthenticateLocalStorage'
import { AuthenticatePreferences } from 'shared/authentication/application/AuthenticatePreferences'
import { Platform } from 'quasar'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

declare global {
  interface Window {
    plugins: any
  }
}

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axiosRepo = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false
  const authenticateLocalStorage = new AuthenticateLocalStorage()
  const authenticatePreferences = new AuthenticatePreferences()
  const cargando = new StatusEssentialLoading()

  // State
  const user = ref()
  const auth = ref(false)
  const permisos = ref()
  const configuracion = ref()
  const nombreUsuario = computed(
    () => user.value.name + ' ' + user.value.apellidos
  )
  const planPagado = ref(false)
  const token = ref()

  const isMobileVersion = ref()

  // rol
  const esCliente = computed(() =>
    user.value ? extraerRol(user.value.roles, rolesSistema.cliente) : false
  )
  const esEmpleado = computed(() =>
    user.value ? extraerRol(user.value.roles, rolesSistema.empleado) : false
  )
  const esAdministrador = computed(() =>
    user.value
      ? extraerRol(user.value.roles, rolesSistema.administrador)
      : false
  )

  // Actions
  const login = async (
    credentiales: UserLogin | RegisterUser
  ): Promise<any> => {
    try {
      const csrf_cookie = axiosRepo.getEndpoint(endpoints.csrf_cookie)
      await axiosRepo.get(csrf_cookie)

      const login = axiosRepo.getEndpoint(endpoints.login)
      const response: AxiosResponse = await axiosRepo.post(login, credentiales)

      authenticateLocalStorage.saveToken(response.data.access_token)
      authenticatePreferences.saveToken(response.data.access_token)

      // respuesta.value = respuesta.value + 'Antes de permisos - '

      // permisos.value = await getPermisos()

      // respuesta.value = respuesta.value + 'Antes de pagado - '
      // await obtenerPagado()
      // respuesta.value = respuesta.value + 'Antes de configuracion actual - '
      // await obtenerConfiguracionActual()

      setUser(response.data.modelo)

      permisos.value = response.data.modelo.permisos
      planPagado.value = response.data.modelo.pagado
      // await obtenerConfiguracionActual()
      // user.value = response.data.modelo

      return response.data.modelo
      // return await getUser()
    } catch (error: any) {
      //  respuesta.value = respuesta.value + error
      throw new ApiError(error)
      //return respuesta.value
    }
    /* finally {
      return respuesta.value
    } */
  }

  async function logout(): Promise<void> {
    // const axiosRepo = AxiosHttpRepository.getInstance()
    await axiosRepo.post('api/user/logout')
    // LocalStorage.remove('token')
    await authenticateLocalStorage.removeToken()
    await authenticatePreferences.removeToken()
    await getUser()
  }

  async function getUser() {
    try {
      const userApi = axiosRepo.getEndpoint(endpoints.api_user)
      const response: AxiosResponse = await axiosRepo.get(
        userApi,
        await getHeaderToken()
      )

      setUser(response.data)
      await authenticateLocalStorage.saveUser(response.data)
      await authenticatePreferences.saveUser(response.data)

      // if (res.data) {
      // permisos.value = await getPermisos()
      // await obtenerConfiguracionActual()
      // await obtenerPagado()
      // }
      permisos.value = response.data.permisos
      planPagado.value = response.data.pagado
      user.value = response.data

      return response.data
    } catch (e) {
      setUser(null)
    }
  }

  async function getHeaderToken() {
    let token = ''
    if (Platform.is.android || Platform.is.ios || Platform.is.capacitor) {
      token = (await authenticatePreferences.getToken()) ?? ''
    } else {
      token = (await authenticateLocalStorage.getToken()) ?? ''
    }

    return {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  }

  const setUser = (userData: any) => {
    user.value = userData
    auth.value = Boolean(userData)
  }

  function hasRole(rol: string) {
    if (user.value) return user.value.rol.split(',').includes(rol)
  }

  const actualizarContrasena = async (userLogin: UserLogin) => {
    try {
      await axiosRepo.post(
        axiosRepo.getEndpoint(endpoints.reset_password),
        userLogin
      )
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  async function isUserLoggedIn(): Promise<boolean> {
    if (!usuarioFueConsultado) {
      await getUser()
      usuarioFueConsultado = true
    }
    return auth.value
  }

  // Permisos
  /* const getPermisos = async () => {
    try {
      const pathPermisos = axiosRepo.getEndpoint(endpoints.permisos);
      const res = await axiosRepo.get<AxiosResponse>(pathPermisos);
      return res.data;
    } catch (error: any) {
      throw new ApiError(error);
    }
  }; */

  function can(permiso: string) {
    const resp = permisos.value?.indexOf('puede.' + permiso) !== -1
    return resp
  }

  function extraerRol(roles: string[], rolConsultar: string) {
    // return [user.value.rol].some((rol: string) => rol === rolConsultar)
    return roles.some((rol: string) => rol === rolConsultar)
  }

  function correoVerificado() {
    return user.value?.email_verified_at !== null
  }

  // Configuracion
  /* async function obtenerConfiguracionActual() {
    try {
      const res = await axiosRepo.get<any>(
        axiosRepo.getEndpoint(endpoints.configuraciones_generales)
      )
      configuracion.value = res.data.results
    } catch (error: any) {
      throw new ApiError(error)
    }
  } */

  // Registrar
  async function registrarUsuario(
    data: UserLogin | RegisterUser
  ): Promise<void> {
    cargando.activar()
    try {
      const axios = AxiosHttpRepository.getInstance()
      await axios.post('/api/public/registrar', data)
      return await login(data)
    } catch (error: any) {
      throw new ApiError(error)
    } finally {
      cargando.desactivar()
    }
  }

  /* async function obtenerPagado() {
    try {
      const res = await axiosRepo.get<any>(
        axiosRepo.getEndpoint(endpoints.activar_app) + '/pagado'
      )
      planPagado.value = res.data.pagado
    } catch (error: any) {
      throw new ApiError(error)
    }
  } */

  /*******
   * Init
   *******/
  // obtenerPagado()

  return {
    isMobileVersion,
    user,
    nombreUsuario,
    login,
    configuracion,
    logout,
    permisos,
    can,
    getUser,
    actualizarContrasena,
    isUserLoggedIn,
    hasRole,
    registrarUsuario,
    correoVerificado,
    planPagado,
    token,
    // getHeaderToken,
    extraerRol,
    esCliente,
    esEmpleado,
    esAdministrador,
  }
})
