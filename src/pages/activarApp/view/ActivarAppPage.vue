<template>
  <q-page padding>
    <h1 class="text-h5 text-bold text-center q-mb-lg">
      BURÓ DE CRÉDITO ECUADOR
    </h1>
    <p class="text-center">
      El más completo del mercado. Tu Informe de Crédito contiene el detalle de
      todas tus deudas y te permite conocer de qué forma te evalúan los bancos y
      otras instituciones financieras para obtener un crédito.
    </p>

    <!--<div class="q-mb-lg">
      <div v-if="pagado">
        <p class="text-positive text-bold pt-2">
          <i class="bi-check-circle-fill me-2"></i>SU APP SE ENCUENTRA ACTIVADA
        </p>
        PRÓXIMA FACTURACIÓN: <b>{{ fechaProximaFacturacion }}</b>
      </div>
      <div v-else class="text-bold text-negative">
        PENDIENTE DE ACTIVACIÓN. DEBES ADQUIRIR UN PLAN.
      </div>
    </div> -->

    <CalloutComponent
      v-if="pagado"
      :mensaje="`Su app se encuentra activada. Próxima facturación: <b>${fechaProximaFacturacion}</b>`"
      tipo="success"
      class="q-mb-md"
    ></CalloutComponent>

    <CalloutComponent
      v-else
      mensaje="Pendiente de activación. <b>Debes adquirir un plan</b>."
      tipo="info"
      class="q-mb-md"
    ></CalloutComponent>

    <div class="row justify-center q-mb-sm">
      <q-btn color="positive" no-caps unelevated @click="abrirWhatsapp()">
        <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
        ¿Necesitas ayuda?</q-btn
      >
    </div>

    <div class="row q-gutter-sm q-mb-sm justify-center">
      <q-btn
        unelevated
        no-caps
        color="primary"
        @click="tipoServicio = tiposServicios.PLAN"
      >
        ¿Soy cliente?
      </q-btn>

      <q-btn
        unelevated
        no-caps
        color="primary"
        @click="tipoServicio = tiposServicios.SOLUCIONES_EMPRESAS"
      >
        ¿Soy empresa?
      </q-btn>
    </div>

    <q-tab-panels
      v-model="tipoServicio"
      animated
      transition-prev="scale"
      transition-next="scale"
    >
      <q-tab-panel :name="tiposServicios.PLAN">
        <div class="row q-gutter-xs">
          <div class="col-12 q-mb-md">
            <div class="text-h5 text-bold q-mb-md">Planes para clientes</div>
            <CalloutComponent
              mensaje="Sólo podrás ver tu reporte  personal de crédito"
              tipo="success"
            ></CalloutComponent>
          </div>

          <q-card
            v-for="plan in planesClientes"
            :key="plan.id"
            square
            class="col-12 col-md-3 text-center q-pa-xs rounded-card"
          >
            <q-card-section>
              <!--<q-img :src="plan.imagen" alt="" class="full-width" />-->
              <div class="text-center text-bold text-h6 q-mb-md">
                {{ plan.nombre }}
              </div>
              <div class="bg-desenfoque rounded-card text-dark q-py-sm q-mb-md">
                <div v-html="plan.descripcion"></div>
              </div>
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
                color="warning"
                no-caps
                rounded
                unelevated
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
      </q-tab-panel>

      <q-tab-panel :name="tiposServicios.SOLUCIONES_EMPRESAS">
        <div class="row q-gutter-xs">
          <div class="col-12 q-mb-md">
            <div class="text-h5 text-bold q-mb-md">Planes para empresas</div>
            <CalloutComponent
              mensaje="Podrás consultar reportes de varios clientes"
              tipo="success"
            ></CalloutComponent>
          </div>

          <q-card
            v-for="plan in planesEmpresas"
            :key="plan.id"
            square
            class="col-12 col-md-3 text-center q-pa-xs rounded-card"
          >
            <q-card-section>
              <!--<q-img :src="plan.imagen" alt="" class="full-width" />-->
              <div class="text-center text-bold text-h6 q-mb-md">
                {{ plan.nombre }}
              </div>
              <div class="bg-desenfoque rounded-card text-dark q-py-sm q-mb-md">
                <div v-html="plan.descripcion"></div>
              </div>
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
                color="warning"
                no-caps
                rounded
                unelevated
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
                <br />
                <small> *Buró de crédito muestra información preliminar.</small>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>
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
