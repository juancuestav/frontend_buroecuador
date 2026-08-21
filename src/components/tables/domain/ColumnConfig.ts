import { SelectOption } from './SelectOption'

export type tipos = 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search' | 'imagen' | 'datetime' | 'toggle' | 'select_multiple' // | 'file'
type align = 'left' | 'center' | 'right'
type operadores = '<' | '<=' | '>' | '>=' | 'start' | 'end' | 'like' | '!=' | '='

export interface ColumnConfig<T> {
  id?: number
  name: keyof T
  field: keyof T
  label: string
  min?:number
  max?:number
  align?: align
  // Clases CSS por celda de esta columna, según el QTable nativo de Quasar
  // (prop `classes` de cada columna, no existe un equivalente a nivel de fila).
  classes?: string | ((row: any) => string)
  sortable?: boolean
  visible?: boolean
  print?: boolean
  style?: string
  type?: tipos
  error?: boolean
  editable?: boolean
  options?: SelectOption[]
  hint?: string,
  requerido?: boolean
  filtrar?: boolean
  default?: boolean
  placeholder?: string
  // accept?: string
  filtro?: (val, update) => void
  operador?: operadores
}
