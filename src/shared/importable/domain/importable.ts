// import { TypeColumn } from '../../componentes/tablas/types'

import { tipos } from 'components/tables/domain/ColumnConfig'

export type ColumnKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | 'AA'
  | 'AB'
  | 'AC'
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AH'
  | 'AI'
  | 'AJ'
  | 'AK'

export class columnaImportable<T> {
  columna?: ColumnKey
  field: keyof T
  descripcion: string
  obligatorio: boolean
  type: tipos

  constructor(
    columna: ColumnKey,
    field: keyof T,
    descripcion: string,
    obligatorio = false,
    type: tipos = 'text'
  ) {
    this.columna = columna
    this.field = field
    this.descripcion = descripcion
    this.obligatorio = obligatorio
    this.type = type
  }
}

export interface Importable<T> {
  obtenerPlantillaImportable(): columnaImportable<T>[]
}
