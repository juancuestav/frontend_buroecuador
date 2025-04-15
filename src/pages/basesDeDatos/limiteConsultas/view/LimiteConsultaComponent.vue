<template>
  <CalloutComponent
    v-if="
      limiteConsultaStore.consultasRealizadas ===
      limiteConsultaStore.consultasPermitidas
    "
    mensaje="Ha alcanzado el <b>límite de consultas disponibles</b>. Por favor, <b>contáctenos si desea ampliar su cuota</b>."
    tipo="warning"
    class="q-mb-md"
  ></CalloutComponent>

  <div class="row q-col-gutter-lg q-mb-lg">
    <span>
      # Consultas realizadas
      <q-icon
        name="bi-check-circle-fill"
        color="primary"
        class="q-mr-sm"
      ></q-icon>
      <b>{{ limiteConsultaStore.consultasRealizadas }}</b>
    </span>

    <span>
      # Consultas permitidas
      <q-icon
        name="bi-check-circle-fill"
        color="primary"
        class="q-mr-sm"
      ></q-icon>
      <b>{{ limiteConsultaStore.consultasPermitidas }}</b>
    </span>
  </div>
</template>

<script setup lang="ts">
import CalloutComponent from 'components/CalloutComponent.vue'

import { useLimiteConsultaStore } from 'stores/limiteConsulta'

/*********
 * Stores
 *********/
const limiteConsultaStore = useLimiteConsultaStore()
</script>
