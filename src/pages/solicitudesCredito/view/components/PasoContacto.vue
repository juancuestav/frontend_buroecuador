<template>
  <q-form ref="formulario" greedy class="row q-col-gutter-md" @submit.prevent>
    <div v-for="campo in CAMPOS" :key="campo.clave" :class="campo.clase">
      <label class="q-mb-sm block">{{ campo.etiqueta }}</label>
      <q-input
        v-model.trim="datos[campo.clave]"
        :type="campo.clave === 'correo' ? 'email' : 'text'"
        :mask="campo.clave === 'celular' ? '##########' : undefined"
        :inputmode="campo.clave === 'celular' ? 'numeric' : undefined"
        :rules="campo.reglas"
        :disable="!editable"
        outlined
        dense
        :hint="fuente(campo.clave)"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { QForm } from 'quasar'
import { Contacto, SolicitudCredito } from '../../domain/SolicitudCredito'

type Campo = 'celular' | 'correo' | 'direccion_domicilio' | 'direccion_trabajo'

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()

const requerido = (v: string) => !!v || 'Campo obligatorio'
const CAMPOS: { clave: Campo; etiqueta: string; clase: string; reglas: ((v: string) => true | string)[] }[] = [
  {
    clave: 'celular',
    etiqueta: 'Celular',
    clase: 'col-12 col-md-6',
    reglas: [requerido, (v) => /^09\d{8}$/.test(v) || 'Debe tener 10 dígitos y empezar con 09'],
  },
  {
    clave: 'correo',
    etiqueta: 'Correo',
    clase: 'col-12 col-md-6',
    reglas: [requerido, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo no válido'],
  },
  {
    clave: 'direccion_domicilio',
    etiqueta: 'Dirección domicilio',
    clase: 'col-12 col-md-6',
    reglas: [requerido, (v) => (v ?? '').length >= 5 || 'Escriba la dirección completa'],
  },
  {
    clave: 'direccion_trabajo',
    etiqueta: 'Dirección trabajo',
    clase: 'col-12 col-md-6',
    reglas: [requerido, (v) => (v ?? '').length >= 5 || 'Escriba la dirección completa'],
  },
]

const contacto: Contacto = props.solicitud.contacto ?? {
  celular: null,
  correo: null,
  direccion_domicilio: null,
  direccion_trabajo: null,
}
const datos = reactive<Record<Campo, string>>({
  celular: contacto.celular ?? '',
  correo: contacto.correo ?? '',
  direccion_domicilio: contacto.direccion_domicilio ?? '',
  direccion_trabajo: contacto.direccion_trabajo ?? '',
})

/** Fuente del dato precargado, mientras el asesor no lo cambie */
function fuente(campo: Campo): string | undefined {
  const origen = contacto[`fuente_${campo}`]
  if (!origen) return datos[campo] ? undefined : 'Sin datos en las bases: ingréselo'
  if (datos[campo] !== (contacto[campo] ?? '')) return 'Ingresado por el asesor'
  return `Fuente: ${origen}`
}

const formulario = ref<QForm | null>(null)

/** Datos del paso si son válidos */
async function obtenerDatos() {
  const valido = await formulario.value?.validate()
  return valido ? { ...datos } : null
}

defineExpose({ obtenerDatos })
</script>
