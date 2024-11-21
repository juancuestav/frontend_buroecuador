<template>
  <q-page padding>
    <h3 class="text-h6 q-mt-none q-mb-md">Notificaciones</h3>

    <div v-if="listado">
      <q-card
        v-for="notificacion in listado"
        :key="notificacion.id"
        class="q-mb-xs bg-desenfoque"
        flat
        square
      >
        <q-card-section>
          <p>
            <q-icon name="bi-bell-fill" color="amber"></q-icon>
            {{ notificacion.mensaje }}
          </p>
          <small class="text-end">
            <b>{{ notificacion.fecha }}</b>
          </small>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>Sin notificaciones</div>
  </q-page>
</template>

<script src="./NotificacionGeneralPage.ts"></script>
