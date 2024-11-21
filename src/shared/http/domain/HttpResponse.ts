/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpResponseGet<T = any> {
  status: number
  data: T
}

export interface ResponseData<T> {
  mensaje: string
  errores: string
  modelo: T
}

export interface HttpResponsePost<T = any> {
  status: number
  data: ResponseData<T>
  // mensaje: string
}

export interface HttpResponseList<T = any> {
  count: number
  next: null | string
  previous: null | string
  results: T[]
}

export interface HttpResponsePut<T = any> {
  status: number
  data: ResponseData<T>
  // mensaje: string
}

export interface HttpResponseDelete<T = any> {
  status: number
  data: ResponseData<T>
  // mensaje: string
}
