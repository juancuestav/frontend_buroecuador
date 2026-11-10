<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="dialogo-codigo">
      <q-card-section class="row items-center no-wrap bg-orange-8 text-white">
        <q-icon name="bi-shield-lock-fill" size="28px" class="q-mr-sm" />
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
        <div class="text-caption text-blue-grey-7 q-mt-sm">
          Para continuar con las siguientes validaciones ingrese el código de
          autorización. El perfil seguirá constando como <b>no califica</b>.
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="confirmar">
          <q-input
            ref="inputCodigo"
            v-model="codigo"
            label="Código de autorización"
            :type="mostrar ? 'text' : 'password'"
            inputmode="numeric"
            outlined
            dense
            autofocus
            autocomplete="off"
            :error="!!error"
            :error-message="error ?? ''"
            :disable="cargando"
          >
            <template #append>
              <q-icon
                :name="mostrar ? 'bi-eye-slash' : 'bi-eye'"
                class="cursor-pointer"
                @click="mostrar = !mostrar"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          flat
          no-caps
          label="Terminar revisión"
          color="blue-grey-7"
          :disable="cargando"
          @click="emit('update:modelValue', false)"
        />
        <q-btn
          unelevated
          no-caps
          color="orange-8"
          icon-right="bi-arrow-right"
          label="Continuar"
          :loading="cargando"
          :disable="!codigo"
          @click="confirmar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NOMBRE_PASO, RevisionCredito } from '../../domain/RevisionCredito'

const props = defineProps<{
  modelValue: boolean
  revision: RevisionCredito | null
  cargando?: boolean
  error?: string | null
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', valor: boolean): void
  (e: 'confirmar', codigo: string): void
}>()

const codigo = ref('')
const mostrar = ref(false)

// Cada vez que se abre, el campo empieza vacío
watch(
  () => props.modelValue,
  (abierto) => {
    if (abierto) {
      codigo.value = ''
      mostrar.value = false
    }
  }
)

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

function confirmar() {
  if (!codigo.value || props.cargando) return
  emit('confirmar', codigo.value.trim())
}
</script>

<style scoped>
.dialogo-codigo {
  width: 440px;
  max-width: 92vw;
  /* Fondo sólido: sin el efecto vidrio global de .q-card */
  background: #fff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* En tema oscuro, fondo sólido oscuro para mantener la legibilidad */
:global(.body--dark) .dialogo-codigo {
  background: #1d1d1d;
}
</style>
