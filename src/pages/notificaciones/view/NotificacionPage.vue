<template>
  <q-page padding>
    
    <essential-table-tabs
      titulo="Listado de notificaciones"
      :configuracionColumnas="configuracionColumnasNotificaciones"
      :datos="listado"
      :permitir-consultar="false"
      :permitir-editar="false"
      :permitir-eliminar="false"
      :accion1="abrirChat"
      :accion2="marcarLeido"
      :tab-options="tabOptions"
      tab-defecto="nuevos"
      @tab-seleccionado="obtenerListado"
    >
    </essential-table-tabs>
  </q-page>
</template>

<script src="./NotificacionPage.ts"></script>

<style lang="scss" scoped>
.card {
  transition: transform 0.1s ease;

  &.notification-animation:hover {
    transform: scale(1.01);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
}

.opciones-notificacion {
  position: absolute;
  top: 16px;
  right: 16px;
}

.tiempo-notificacion {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.opciones-notificacion button::after {
  display: none;
}
</style>
