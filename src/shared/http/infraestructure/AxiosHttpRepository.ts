import { AuthenticateLocalStorage } from 'shared/authentication/application/AuthenticateLocalStorage'
import { AuthenticatePreferences } from 'shared/authentication/application/AuthenticatePreferences'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpRepository } from '../domain/HttpRepository'
import { Endpoint } from '../domain/Endpoint'
import { Platform } from 'quasar'

// SINGLETON
export class AxiosHttpRepository implements HttpRepository {
  private static instance: AxiosHttpRepository
  private static axiosInst: AxiosInstance
  static authenticateLocalStorage = new AuthenticateLocalStorage()
  static authenticatePreferences = new AuthenticatePreferences()
  static token = ''
  static config

  private constructor() {}

  private static async initialize(): Promise<void> {
    this.axiosInst = axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json',
        // Authorization: `Bearer ${this.token}`,
      },
    })
  }

  public static getInstance(): AxiosHttpRepository {
    this.getHeaderToken()
    if (!this.instance) {
      this.initialize()
      this.instance = new AxiosHttpRepository()
    }

    // Agregar un interceptor para actualizar el token dinámicamente en cada solicitud
    this.axiosInst.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${this.token}`
      return config
    })

    return this.instance
    // AxiosHttpRepository.config = AxiosHttpRepository.getHeaderToken()
  }

  static async getHeaderToken() {
    if (Platform.is.android || Platform.is.ios || Platform.is.capacitor) {
      this.token = (await this.authenticatePreferences.getToken()) ?? ''
    } else {
      this.token = (await this.authenticateLocalStorage.getToken()) ?? ''
    }
  }

  async post<HttpResponse>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.post(url, data, options)
  }

  async get<HttpResponse>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse> {
    // const header = await AxiosHttpRepository.getHeaderToken()
    return AxiosHttpRepository.axiosInst.get(url, options)
  }

  async put<HttpResponse>(url: string, data: any): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.put(
      url,
      data
      // await AxiosHttpRepository.getHeaderToken()
    )
  }

  delete<HttpResponse>(url: string): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.delete(url, AxiosHttpRepository.config)
  }

  patch<HttpResponse>(url: string, data: any): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.patch(
      url,
      data,
      AxiosHttpRepository.config
    )
  }

  public getEndpoint(
    endpoint: Endpoint | { endpoint: Endpoint; id: number | null },
    args?: Record<string, any>
  ): string {
    let accessor: string
    let includeApiPath: boolean
    // si recibe un endpoint
    if (endpoint instanceof Endpoint) {
      accessor = endpoint.accessor
      includeApiPath = endpoint.includeApiPath
    }
    // si recibe un endpoint y una id
    else {
      accessor = `${endpoint.endpoint.accessor}/${endpoint.id || ''}`
      includeApiPath = endpoint.endpoint.includeApiPath
    }

    if (includeApiPath || includeApiPath === undefined) {
      accessor = `api/${accessor}`
    }

    if (args) accessor += this.mapearArgumentos(args)
    return accessor
  }

  public mapearArgumentos(args: Record<string, any>): string {
    const query: any = []

    // comprueba si el valor es valido
    for (const key in args)
      if (args[key] !== null && args[key] !== undefined) {
        query.push(`${key}=${args[key]}`)
      }
    return `?${query.join('&')}`
  }
}
