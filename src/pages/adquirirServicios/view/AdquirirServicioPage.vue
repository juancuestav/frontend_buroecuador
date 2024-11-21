<template>
  <q-page padding>
    <h1 class="text-h5 text-center q-mb-lg">BURÓ DE CRÉDITO ECUADOR</h1>
    <p class="text-center">
      El más completo del mercado. Tu Informe de Crédito contiene el detalle de
      todas tus deudas y te permite conocer de qué forma te evalúan los bancos y
      otras instituciones financieras para obtener un crédito.
    </p>

    <div class="q-mb-lg text-center">
      <q-btn
        push
        color="primary"
        href="https://www.burodecredito.ec/servicios"
        target="_blank"
      >
        Ver servicios
      </q-btn>
    </div>

    <!-- <div v-show="verPlanes" class="row q-col-gutter-xs">
      <q-card
        v-for="plan in planes"
        :key="plan.id"
        flat
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
    </div> -->
    <div id="boton-whatsapp" class="flotante"></div>
  </q-page>
</template>

<script lang="ts" setup></script>

<style>
.flotante {
  position: fixed;
  bottom: 34px;
  right: 24px;
}
</style>
