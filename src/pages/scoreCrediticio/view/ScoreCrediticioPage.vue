<template>
  <q-page padding>
    <div v-if="!verMiScore" class="text-center">
      <vue3-lottie
        :animationData="scoreJson"
        background="transparent"
        :speed="1"
        style="width: 400px; height: 400px"
        loop
        autoplay
      ></vue3-lottie>
      <p>
        Conoce tu score crediticio y empieza a llevar una vida financiera más
        saludable.
      </p>
      <q-btn color="primary" no-caps push @click="verMiScore = !verMiScore"
        >Ver mi score crediticio</q-btn
      >
    </div>

    <div v-else>
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="row">
            <div class="col-12 text-center q-mb-md text-bold">
              {{ store.nombreUsuario }}
            </div>
            <div class="col-12 col-md-6 text-center q-mb-md">
              <contador
                titulo="¿Tu score crediticio es?"
                :valor="999"
                :repetir="true"
              ></contador>
            </div>
            <div class="col-12 col-md-6 text-center q-mb-xl">
              <contador
                titulo="¿Tu score sobreendeudamiento es?"
                :valor="999"
                :repetir="true"
              ></contador>
            </div>
            <div class="col-12 col-md-6 text-center q-mb-xl">
              <contador
                titulo="Tú deuda total reportada a la central de riesgos es"
                :valor="5000"
                :repetir="true"
                :decimales="true"
              ></contador>
            </div>
            <div class="col-12 col-md-6 text-center q-mb-xl">
              <contador
                titulo="Tú cuota mensual estimada es "
                :valor="999"
                :repetir="true"
                :decimales="true"
              ></contador>
            </div>
            <div class="col-12 q-mx-auto text-center">
              <small class="block">Calculado por Buró de Crédito</small>
              <small
                >*Para conocer tu score crediticio debes adquirir un reporte o
                plan</small
              >
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-mb-md">
        <div class="col-12 text-center">
          <p class="text-primary text-bold">Preguntas frecuentes</p>
          <q-btn
            color="primary"
            no-caps
            push
            @click="() => (verPlanes = !verPlanes)"
            >Ver mi informe crediticio</q-btn
          >
        </div>
      </div>

      <div v-show="verPlanes" class="row q-col-gutter-sm q-mb-md">
        <q-card
          v-for="plan in planes"
          :key="plan.id"
          bordered
          flat
          class="col-12 col-md-4"
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
            <div v-else class="text-center">Precio final (No incluye IVA)</div>
            <q-btn
              v-if="plan.url_destino"
              :href="plan.url_destino"
              target="_blank"
              type="a"
              color="positive"
              class="full-width q-my-md"
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

      <div class="row">
        <div class="col-12">
          <h1 class="text-h6">Preguntas frecuentes</h1>
          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            label="¿Qué es score de crédito?"
            header-class="bg-grey-1"
            default-opened
          >
            <p class="q-pa-md">
              El score crediticio es un puntaje calculado en base a la
              información reportada por distintas entidades a los burós de
              información crediticia, entre la que consta tu record de pagos, tu
              monto de endeudamiento y la antigüedad de tu historial de crédito.
              El score calculado por BURO DE CREDITO ECUADOR tiene un rango que
              va desde 1 a 999. El score crediticio es una de las varias
              herramientas utilizadas por las instituciones para poder
              determinar qué tan factible es recuperar el crédito que otorgan.
              Mientras más alto sea tu score significa que has mostrado un
              comportamiento responsable en el cumplimiento de tus obligaciones,
              y esto permite a las instituciones evaluar con mayor confianza
              futuras solicitudes de crédito. Es importante recalcar que la
              situación de cada individuo es distinta, y por ese motivo el score
              crediticio es solo uno de los factores que se utilizan para
              evaluar la capacidad de pago del aplicante.
            </p>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            label="¿Qué factores inciden sobre mi score crediticio y como lo puedo
          mejorar?"
            header-class="bg-grey-1"
          >
            <p class="q-pa-md">
              Toda información reportada a los burós de información crediticia
              incide sobre el cálculo de tu score, para mantenerlo en óptima
              situación te recomendamos cumplir con el pago puntual de todos tus
              compromisos, tanto los comerciales como los financieros.
            </p>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            label="¿Cuáles son los beneficios al adquirir el reporte completo?"
            header-class="bg-grey-1"
          >
            <p class="q-pa-md">
              Analizar la probabilidad de obtener financiamiento. Conocer qué
              factores te pueden ayudar a mejorar tu score crediticio. Conocer
              el detalle de la información reportada a BURO DE CREDITO ECUADOR
              Identificar si tienes obligaciones que afecten tu historial
              crediticio.
            </p>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            label="¿Qué contiene el reporte completo?"
            header-class="bg-grey-1"
          >
            <p class="q-pa-md">
              Indicador gráfico para analizar los cambios en tu perfil
              crediticio de los últimos 12 meses Visibilidad de las obligaciones
              vigentes y de las históricas de hasta 36 meses de antigüedad.
              Código QR que permite verificar la validez de la información del
              reporte. Tengo dudas acerca del reporte Para mayor información
              puedes acercarte al Centro de Atención al cliente ubicado en:
              Guayaquil: Av. LOS RIOS #609 & QUISQUIS, Edificio ORELLANA PISO 3
              OF5. Correo electrónico: atencionclientes@burodecredito.ec
              Teléfono convencional (04)5039470
            </p>
          </q-expansion-item>

          <p class="text-bold"></p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from 'stores/authentication'
import scoreJson from 'src/assets/lottie/score.json'

// Componentes
import Contador from 'components/ContadorComponent.vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import { ref } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

const store = useAuthenticationStore()

const verMiScore = ref(false)
const planes = ref()
const verPlanes = ref(false)

async function obtenerData() {
  const axios = AxiosHttpRepository.getInstance()
  const response: any = await axios.get(
    axios.getEndpoint(endpoints.activar_app)
  )
  planes.value = response.data.planes
}

obtenerData()
</script>
