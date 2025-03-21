<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12">
        <h1 class="text-h6 text-center q-mb-lg">Chat en línea</h1>
      </div>

      <div class="col-12 col-md-3">
        <q-btn
          color="positive"
          no-caps
          class="q-mx-auto block q-mb-md block"
          push
          target="_blank"
          @click="abrirWhatsapp()"
          >
          <!-- href="https://api.whatsapp.com/send?phone=593998844792&text=Quiero%20mas%20informacion%20de%20mi%20buro%20de%20credito%20" -->
          <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
          ¿Necesitas ayuda?</q-btn
        >
      </div>

      <div class="col-12">
        <small class="block text-center">Comunícate con nosotros</small>
      </div>
    </div>
  </q-page>
</template>

<script src="./ChatLineaPage.ts"></script>
