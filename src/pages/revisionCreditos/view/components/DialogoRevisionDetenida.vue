<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="dialogo-detenida">
      <q-card-section class="row items-center no-wrap bg-orange-8 text-white">
        <q-icon
          name="bi-exclamation-octagon-fill"
          size="28px"
          class="q-mr-sm"
        />
        <div class="text-subtitle1 text-bold">Validación no cumplida</div>
      </q-card-section>

      <q-card-section>
        <div class="text-weight-medium q-mb-xs">{{ tituloPaso }}</div>
        <div
          v-for="v in fallidas"
          :key="v.clave"
          class="text-caption text-negative q-mb-xs"
        >
          <q-icon name="bi-x-circle-fill" class="q-mr-xs" />{{ v.detalle }}
        </div>

        <!-- Con permiso para continuar -->
        <div
          v-if="revision?.puede_continuar"
          class="text-caption text-blue-grey-7 q-mt-sm"
        >
          Puede continuar con las siguientes validaciones. El perfil seguirá
          constando como <b>no califica</b>.
        </div>
        <!-- Sin permiso: la revisión termina aquí -->
        <div v-else class="text-caption text-blue-grey-7 q-mt-sm">
          La revisión termina en este paso: el perfil <b>no califica</b>.
        </div>

        <div v-if="error" class="text-caption text-negative q-mt-sm">
          <q-icon name="bi-exclamation-triangle-fill" class="q-mr-xs" />
          {{ error }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          flat
          no-caps
          :label="revision?.puede_continuar ? 'Terminar revisión' : 'Cerrar'"
          color="blue-grey-7"
          :disable="cargando"
          @click="emit('update:modelValue', false)"
        />
        <q-btn
          v-if="revision?.puede_continuar"
          unelevated
          no-caps
          color="orange-8"
          icon-right="bi-arrow-right"
          label="Continuar"
          :loading="cargando"
          @click="emit('confirmar')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NOMBRE_PASO, RevisionCredito } from '../../domain/RevisionCredito'

const props = defineProps<{
  modelValue: boolean
  revision: RevisionCredito | null
  cargando?: boolean
  error?: string | null
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', valor: boolean): void
  (e: 'confirmar'): void
}>()

const tituloPaso = computed(() =>
  props.revision?.paso_detenido
    ? `No cumple: ${NOMBRE_PASO[props.revision.paso_detenido]}`
    : ''
)

const fallidas = computed(() =>
  (props.revision?.validaciones ?? []).filter(
    (v) => v.estado === 'no_cumple' && v.detalle
  )
)
</script>

<style scoped>
.dialogo-detenida {
  width: 440px;
  max-width: 92vw;
  /* Fondo sólido: sin el efecto vidrio global de .q-card */
  background: #fff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* En tema oscuro, fondo sólido oscuro para mantener la legibilidad */
:global(.body--dark) .dialogo-detenida {
  background: #1d1d1d;
}
</style>
