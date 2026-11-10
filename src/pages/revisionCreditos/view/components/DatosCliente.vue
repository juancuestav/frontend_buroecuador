<template>
  <!-- Se muestra dentro de "Resultado de la revisión", bajo la calificación -->
  <div class="datos-cliente">
    <div class="datos-cliente__titulo">
      Datos del cliente
      <span class="datos-cliente__fuente">· Registro Civil</span>
    </div>
    <campos-lectura :campos="campos" solo-texto />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CampoLectura, ClienteRevision } from '../../domain/RevisionCredito'
import { formatearFecha } from '../../domain/formato'
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

<style scoped>
.datos-cliente {
  padding: 14px 16px;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
}

.datos-cliente__titulo {
  font-weight: 700;
  margin-bottom: 10px;
}

.datos-cliente__fuente {
  font-weight: 400;
  font-size: 0.8rem;
  color: #78909c;
}
</style>
