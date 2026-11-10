<template>
  <seccion-revision label="Datos del cliente" caption="Registro Civil">
    <campos-lectura :campos="campos" />
  </seccion-revision>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CampoLectura, ClienteRevision } from '../../domain/RevisionCredito'
import { formatearFecha } from '../../domain/formato'
import SeccionRevision from './SeccionRevision.vue'
import CamposLectura from './CamposLectura.vue'

const props = defineProps<{ cliente: ClienteRevision }>()

const campos = computed<CampoLectura[]>(() => {
  const c = props.cliente
  const lista: CampoLectura[] = [
    { etiqueta: 'Cédula', valor: c.cedula },
    { etiqueta: 'Apellidos y nombres', valor: c.nombres },
    {
      etiqueta: 'Fecha de nacimiento',
      valor: formatearFecha(c.fecha_nacimiento),
    },
    {
      etiqueta: 'Edad',
      valor: c.edad !== null ? `${c.edad} años` : null,
      resaltar: true,
    },
    { etiqueta: 'Estado civil', valor: c.estado_civil },
  ]

  if (c.es_casado && c.conyuge) {
    lista.push(
      {
        etiqueta: 'Cédula del cónyuge',
        valor: c.conyuge.cedula || 'Sin cédula registrada',
      },
      { etiqueta: 'Cónyuge', valor: c.conyuge.nombres }
    )
  }

  return lista
})
</script>
