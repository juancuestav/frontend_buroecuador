<template>
  <q-page padding>
    <div class="text-center q-pb-lg">
      <h6 class="q-my-md">Reporte</h6>
      Estás viendo una vista previa de nuestros reportes para ver el tuyo debes
      adquirir un plan.
    </div>
    <div class="row q-mb-md">
      <div class="col-12 text-center q-mb-md">
        <q-btn
          color="primary"
          no-caps
          push
          @click="() => (verPlanes = !verPlanes)"
          >Ver planes</q-btn
        >
      </div>

      <div id="planes" class="col-12">
        <div v-show="verPlanes" class="row q-col-gutter-xs">
          <!-- :class="{ col: !$q.screen.xs, 'col-12': $q.screen.xs }" -->
          <q-card
            v-for="plan in planes"
            :key="plan.id"
            flat
            square
            class="col-12 col-md-3 text-center"
          >
            <q-card-section>
              <q-img :src="plan.imagen" alt="" class="full-width" />
              <div class="text-center text-bold text-h6 q-mb-md">
                {{ plan.nombre }}
              </div>
              <div v-html="plan.descripcion" class="q-mb-lg"></div>
              <div class="text-center text-h5">
                $
                {{ parseFloat(plan.precio_unitario) + parseFloat(plan.iva) }}
              </div>
              <div v-if="plan.gravable" class="text-center">IVA incluido</div>
              <div v-else class="text-center">
                Precio final (No incluye IVA)
              </div>
              <q-btn
                v-if="plan.url_destino"
                :href="plan.url_destino"
                target="_blank"
                type="a"
                color="positive"
                class="full-width q-my-md"
                unelevated
                square
                >Obtener ahora</q-btn
              >
              <div class="text-center mb-3">
                <q-icon
                  name="bi-bookmark-check-fill"
                  class="q-mr-sm"
                  color="positive"
                ></q-icon
                >TU COMPRA ES SEGURA
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <reporte-preview :reporte="reporte"></reporte-preview>

    <div class="col-12 text-center">
      <q-btn
        color="primary"
        no-caps
        push
        href="#planes"
        @click="() => (verPlanes = true)"
        >Ver planes</q-btn
      >
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { endpoints } from 'config/api'
import ReportePreview from 'pages/reportes/shared/view/ReportePreview.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ref } from 'vue'
import { EjemploReporte } from '../domain/EjemploReporte'
const reporte = new EjemploReporte()

const verPlanes = ref(false)
const planes = ref()
async function obtenerData() {
  const axios = AxiosHttpRepository.getInstance()
  const response: any = await axios.get(
    axios.getEndpoint(endpoints.activar_app)
  )
  planes.value = response.data.planes
}

obtenerData()
</script>
