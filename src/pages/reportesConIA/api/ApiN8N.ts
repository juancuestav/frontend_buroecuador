import axios from 'axios'

export const ApiN8N = axios.create({
  baseURL: import.meta.env.VITE_API_N8N,
  headers: {
    Accept: 'application/json',
  },
})

/* export const generarReporte = async (data: {
  tipoIdentificacion: string
  identificacion: string
  tipoReporte: string
}) => {
  try {
    const response = await ApiN8N.post('/generar-reporte', data)
    return response
  } catch (error) {
    console.error('Error al generar el reporte:', error)
    throw error
  }
} */

export const buscarReportes = async (params: {
  tipoIdentificacion: string
  identificacion: string
}) => {
  try {
    const response = await ApiN8N.get('/buscar-reportes', { params })
    return response.data
  } catch (error) {
    console.error('Error al buscar los reportes:', error)
    throw error
  }
}
