// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import PermisoNuevoPage from 'sistema/permisos/modules/permisoNuevo/PermisoNuevoPage.vue'

// Paginas

export class PermisoModales {
  PermisoNuevoPage: ComponenteModal

  constructor() {
    this.PermisoNuevoPage = markRaw(
      new ComponenteModal('Nuevo Permiso', PermisoNuevoPage)
    )
  }
}
