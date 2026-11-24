<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" @show="cargar">
    <q-card style="width: 480px; max-width: 95vw">
      <q-card-section class="text-subtitle1 text-bold">Parámetros de las solicitudes</q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey-7 q-mb-md">
          Son los mismos para ambos bancos. Las solicitudes guardan los valores
          con los que se calcularon.
        </div>
        <q-form v-if="parametros" ref="formulario" greedy class="row q-col-gutter-sm" @submit.prevent="guardar">
          <campo-numero v-model="parametros.tasa_anual" :decimales="3" class="col-6" suffix="%" label="Tasa anual" outlined dense :rules="[(v) => (!!v && v > 0 && v <= 100) || 'Entre 0 y 100']" />
          <campo-numero v-model="parametros.porcentaje_capacidad" class="col-6" suffix="%" label="Capacidad de pago" outlined dense :rules="[(v) => (!!v && v > 0 && v <= 100) || 'Entre 1 y 100']" />
          <campo-numero v-model="plazoMaximoAnios" :decimales="0" class="col-6" suffix="años" label="Plazo máximo" outlined dense :rules="[(v) => (!!v && v > 0) || 'Años enteros']" />
          <div class="col-6" />
          <campo-numero v-model="parametros.monto_minimo" class="col-6" prefix="$" label="Monto mínimo (opcional)" outlined dense />
          <campo-numero v-model="parametros.monto_maximo" class="col-6" prefix="$" label="Monto máximo (opcional)" outlined dense />
          <div class="col-12 row justify-end q-gutter-sm q-mt-sm">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn unelevated no-caps color="primary" label="Guardar" type="submit" :loading="guardando" />
          </div>
        </q-form>
        <q-skeleton v-else height="160px" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QForm } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import { obtenerMensajeError } from 'pages/revisionCreditos/domain/formato'
import { ParametrosSolicitud } from '../../domain/SolicitudCredito'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'
import CampoNumero from './CampoNumero.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', valor: boolean): void }>()
const { notificarCorrecto, notificarError } = useNotificaciones()

const parametros = ref<ParametrosSolicitud | null>(null)
// El plazo se edita en años; el servidor lo guarda en meses
const plazoMaximoAnios = ref<number | null>(null)
const formulario = ref<QForm | null>(null)
const guardando = ref(false)

async function cargar() {
  parametros.value = null
  try {
    parametros.value = (await solicitudesApi.parametros()).modelo
    plazoMaximoAnios.value = Math.floor(parametros.value.plazo_maximo / 12)
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudieron cargar los parámetros.'))
  }
}

async function guardar() {
  if (!parametros.value || !(await formulario.value?.validate())) return
  guardando.value = true
  try {
    const p = parametros.value
    const respuesta = await solicitudesApi.guardarParametros({
      ...p,
      plazo_maximo: (plazoMaximoAnios.value ?? 0) * 12,
      monto_minimo: p.monto_minimo || null,
      monto_maximo: p.monto_maximo || null,
    })
    notificarCorrecto(respuesta.mensaje)
    emit('update:modelValue', false)
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudieron guardar los parámetros.'))
  } finally {
    guardando.value = false
  }
}
</script>
