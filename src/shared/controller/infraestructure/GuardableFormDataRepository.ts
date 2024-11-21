import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponsePost } from '../../http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'

export class GuardableFormDataRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardar(
    formData: FormData,
    params?: ParamsType
  ): Promise<ResponseItem<T, HttpResponsePost<T>>> {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint, params)
      // const formData = this.convertirJsonAFormData(formData)
      const response: AxiosResponse = await this.httpRepository.post(
        ruta,
        formData,
        {
          headers: {
            // ...(await AxiosHttpRepository.getHeaderToken()).headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  /* convertirJsonAFormData(entidad: any, files?): FormData {
    const formData = new FormData();

    for (const key in entidad) {
      if (entidad.hasOwnProperty(key)) {
        formData.append(key, entidad[key]);
      }
    }

    if(files) formData.append('file', files[0])

    return formData
  } */
}
