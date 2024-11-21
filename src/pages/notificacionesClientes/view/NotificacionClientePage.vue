<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Notificaciones para los clientes</div>

    <label class="q-mb-sm block">Mensaje</label>
    <q-input
      v-model="mensaje"
      class="q-mb-xs"
      type="textarea"
      placeholder="Escriba su mensaje aquí"
      autogrow
      outlined
      dense
    >
    </q-input>
    
    <q-btn
      color="primary"
      class="full-width q-mb-md"
      no-caps
      square
      unelevated
      @click="enviar()"
    >
      <q-icon name="bi-send" class="q-mr-sm" size="xs"></q-icon>
      Enviar a todos los clientes
    </q-btn>

    <essential-table
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      @eliminar="eliminar"
      :permitir-consultar="false"
      :permitir-editar="false"
      :mostrar-header="false"
      :mostrar-footer="false"
    >
    </essential-table>
  </q-page>
</template>

<script src="./NotificacionClientePage.ts"></script>
