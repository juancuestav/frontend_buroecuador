<template>
  <q-form ref="formulario" greedy @submit.prevent>
    <div
      v-for="(referencia, i) in referencias"
      :key="i"
      class="referencia q-mb-md"
    >
      <div class="row items-center q-mb-sm">
        <div class="text-bold col">Referencia {{ i + 1 }}</div>
        <q-btn
          v-if="editable && referencias.length > 1"
          flat
          dense
          round
          icon="bi-trash"
          color="negative"
          aria-label="Quitar referencia"
          @click="referencias.splice(i, 1)"
        />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Nombres completos</label>
          <q-input
            v-model="referencia.nombres"
            :rules="[requerido, (v) => v.trim().length >= 5 || 'Escriba nombres y apellidos']"
            :disable="!editable"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Parentesco</label>
          <q-select
            v-model="referencia.parentesco"
            :options="PARENTESCOS"
            :rules="[requerido]"
            :disable="!editable"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="referencia.direccion"
            :rules="[requerido, (v) => v.trim().length >= 5 || 'Escriba la dirección completa']"
            :disable="!editable"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="referencia.celular"
            mask="##########"
            inputmode="numeric"
            :rules="[requerido, reglaCelular(i)]"
            :disable="!editable"
            outlined
            dense
          />
        </div>
      </div>
    </div>

    <q-btn
      v-if="editable && referencias.length < 2"
      outline
      no-caps
      color="primary"
      icon="bi-plus-lg"
      label="Agregar referencia"
      @click="agregar"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QForm } from 'quasar'
import { PARENTESCOS, Referencia, SolicitudCredito } from '../../domain/SolicitudCredito'

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()

const requerido = (v: string | null) => !!v || 'Campo obligatorio'

const nueva = (): Referencia => ({ nombres: '', direccion: '', celular: '', parentesco: null })
const referencias = ref<Referencia[]>(
  props.solicitud.referencias?.length
    ? props.solicitud.referencias.map((r) => ({ ...r }))
    : [nueva()]
)

/** 09XXXXXXXX, distinto al del cliente y al de la otra referencia */
function reglaCelular(indice: number) {
  return (v: string) => {
    if (!/^09\d{8}$/.test(v)) return 'Debe tener 10 dígitos y empezar con 09'
    if (v === props.solicitud.contacto?.celular) return 'No puede ser el celular del cliente'
    if (referencias.value.some((r, i) => i !== indice && r.celular === v))
      return 'Las referencias no pueden tener el mismo celular'
    return true
  }
}

function agregar() {
  referencias.value.push(nueva())
}

const formulario = ref<QForm | null>(null)

async function obtenerDatos() {
  const valido = await formulario.value?.validate()
  return valido ? { referencias: referencias.value } : null
}

defineExpose({ obtenerDatos })
</script>

<style scoped>
.referencia {
  padding: 16px;
  border: 1px solid #e6e8eb;
  border-radius: 12px;
}
</style>
