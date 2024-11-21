import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { ParamsType } from 'config/types'

export class ConsultableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async consultar(id: number, params?: ParamsType): Promise<ResponseItem<T, HttpResponseGet<T>>> {
    try {
      const endpoint = {
        endpoint: this.endpoint,
        id,
      }
      const ruta = this.httpRepository.getEndpoint(endpoint, params)
      const response: any = await this.httpRepository.get(ruta)
      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: any) {
      throw new ApiError(error)
    }
  }
}
