import { boot } from 'quasar/wrappers'
import { lucideIconMap } from './lucideIconMap'

// Reemplaza los íconos bi-* (Bootstrap Icons) por su equivalente de Lucide
// en toda la app, sin tocar los cientos de usos existentes de
// `<q-icon name="bi-...">` / `icon="bi-..."`: Quasar resuelve cada nombre
// de ícono a través de este único punto de intercepción global.
// Los íconos de marca (facebook/twitter/instagram/whatsapp) no existen en
// Lucide, así que quedan sin mapear a propósito y siguen renderizando con
// bootstrap-icons (extra que se mantiene instalado como respaldo).
export default boot(({ app }) => {
  app.config.globalProperties.$q.iconMapFn = (iconName: string) => {
    const mapped = lucideIconMap[iconName]
    return mapped ? { icon: mapped } : undefined
  }
})
