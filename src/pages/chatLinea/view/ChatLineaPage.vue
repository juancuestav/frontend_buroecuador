<template>
  <q-page padding>
    <h1 class="text-h6 text-center q-mb-lg">Chat en línea</h1>
    <q-btn
      color="positive"
      no-caps
      class="q-mx-auto block q-mb-md"
      push
      @click="abrirWhatsapp()"
    >
      <q-icon name="bi-whatsapp" size="xs" class="q-mr-sm"></q-icon>
      ¿Necesitas ayuda?</q-btn
    >
    <small class="block text-center">Comunícate con nosotros</small>
  </q-page>
</template>

<script src="./ChatLineaPage.ts"></script>
