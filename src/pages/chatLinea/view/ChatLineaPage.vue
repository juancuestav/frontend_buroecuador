<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12">
        <h1 class="text-h6 text-bold text-center q-mb-lg">Chat en línea</h1>

        <CalloutComponent
          mensaje="Ponte en <b>contacto con nosotros</b> para <b>recibir asistencia</b>. Será un gusto atenderte."
          tipo="info"
          class="q-mb-xl"
        ></CalloutComponent>
      </div>

      <div class="col-12 col-md-3">
        <q-btn
          color="positive"
          no-caps
          class="q-mx-auto block q-mb-md block"
          unelevated
          target="_blank"
          @click="abrirWhatsapp()"
        >
          <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
          Servicio al cliente</q-btn
        >
      </div>

      <div class="col-12 col-md-3">
        <q-btn
          color="primary"
          no-caps
          class="q-mx-auto block q-mb-md block"
          unelevated
          target="_blank"
          @click="abrirWhatsapp()"
        >
          <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
          Soluciones empresas</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script src="./ChatLineaPage.ts"></script>
