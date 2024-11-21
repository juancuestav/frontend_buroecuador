<template>
  <q-page padding>
    <h1 class="text-h5 text-center q-mb-lg">BURÓ DE CRÉDITO ECUADOR</h1>
    <p class="text-center">
      El más completo del mercado. Tu Informe de Crédito contiene el detalle de
      todas tus deudas y te permite conocer de qué forma te evalúan los bancos y
      otras instituciones financieras para obtener un crédito.
    </p>

    <div class="q-mb-lg">
      <div v-if="pagado">
        <p class="text-positive text-bold pt-2">
          <i class="bi-check-circle-fill me-2"></i>SU APP SE ENCUENTRA ACTIVADA
        </p>
        PRÓXIMA FACTURACIÓN: <b>{{ fechaProximaFacturacion }}</b>
      </div>
      <div v-else class="text-bold text-negative">
        PENDIENTE DE ACTIVACIÓN. DEBES ADQUIRIR UN PLAN.
      </div>
    </div>

    <div class="row q-gutter-sm q-mb-lg justify-center">
      <q-btn
        push
        no-caps
        color="primary"
        @click="() => (verPlanes = !verPlanes)"
      >
        Ver planes
      </q-btn>

      <q-btn color="positive" no-caps push @click="abrirWhatsapp()">
        <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
        ¿Necesitas ayuda?</q-btn
      >
    </div>

    <div v-show="verPlanes" class="row q-col-gutter-xs">
      <!-- :class="{ col: !$q.screen.xs, 'col-12': $q.screen.xs }" -->
      <q-card
        v-for="plan in planes"
        :key="plan.id"
        flat
        class="col-12 col-md-4 text-center"
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
    <!-- <div id="boton-whatsapp" class="flotante"></div> -->

    <PdfViewer></PdfViewer>
  </q-page>
</template>

<script src="./ActivarAppPage.ts"></script>

<style>
.flotante {
  position: fixed;
  bottom: 34px;
  right: 24px;
}
</style>
