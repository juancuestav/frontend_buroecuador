import { ParamsType } from 'config/types'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import {
  HttpResponseGet,
  HttpResponseList,
} from 'shared/http/domain/HttpResponse'

import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'

export class ListableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async listar<C = T>(args?: ParamsType) {
    return this.httpRepository
      .get<HttpResponseGet<HttpResponseList<C>>>(
        this.httpRepository.getEndpoint(this.endpoint, args), { responseType: args?.export ? 'blob' : 'json' }
      )
      .then((response: HttpResponseGet) => {
        return {
          response,
          result: response.data.data ?? response.data.results,
          meta: response.data.meta
        }
      })
      .catch((error) => {
        console.log(error)
        throw new ApiError(error)
      })
  }
}
