<template>
  <div>
    <div class="text-caption text-grey-7 q-mb-md">
      Solo se permiten archivos PDF de hasta 10 MB. Todos los documentos son
      obligatorios, excepto los que permiten marcar "No tiene". Cuando se piden
      varios (por ejemplo, 3 roles de pago), únalos en un solo PDF.
    </div>
    <div class="row q-col-gutter-md">
      <div
        v-for="documento in documentos"
        :key="documento.id"
        class="col-12 col-sm-6 col-lg-4"
      >
        <tarjeta-documento
          :documento="documento"
          :solicitud-id="solicitud.id"
          :editable="editable"
          @actualizada="emit('actualizada', $event)"
        />
      </div>
    </div>
    <div class="q-mt-md text-bold" :class="completos ? 'text-positive' : 'text-grey-8'">
      {{ completos ? 'Todos los documentos están completos.' : `Faltan ${faltan} de ${documentos.length} documentos.` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SolicitudCredito } from '../../domain/SolicitudCredito'
import TarjetaDocumento from './TarjetaDocumento.vue'

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()
const emit = defineEmits<{ (e: 'actualizada', modelo: SolicitudCredito): void }>()

const documentos = computed(() => props.solicitud.documentos.filter((d) => !d.adicional))
const faltan = computed(
  () => documentos.value.filter((d) => d.estado !== 'subido' && d.estado !== 'no_tiene').length
)
const completos = computed(() => documentos.value.length > 0 && faltan.value === 0)

async function obtenerDatos() {
  return completos.value ? {} : null
}

defineExpose({ obtenerDatos, completos })
</script>
