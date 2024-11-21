import { useCargandoStore } from 'stores/cargando'
import { useQuasar, QSpinnerOval } from 'quasar'
import { computed, ComputedRef } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  $q = useCargandoStore().$q ?? useQuasar()

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
  }

  waitBackground = 'bg-desenfoque'
  activar(): void {
    // this.store.activarCargando()
    this.$q?.loading?.show({
      delay: 400, // ms
      spinner: QSpinnerOval,
      spinnerColor: 'white',
      message: '<span class="text-white">La operación está en progreso.<br/><br/><small class="text-grey-8 text-bold q-py-xs q-px-sm ' + this.waitBackground + ' rounded-card">Espere por favor...</small></span>',
      html: true,
    })
  }

  desactivar(): void {
    this.$q.loading.hide()
    // this.store.desactivarCargando()
  }
}
