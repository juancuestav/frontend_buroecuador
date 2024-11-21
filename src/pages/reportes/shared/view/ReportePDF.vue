<template>
  <q-page padding>
    <div ref="refPDF">
      <reporte-preview :reporte="reporte"></reporte-preview>
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[18, $q.screen.xs ? 50 : 28]"
    >
      <q-fab
        icon="add"
        direction="up"
        vertical-actions-align="right"
        color="primary"
        label="Acciones"
        padding="sm lg"
      >
        <!-- Continuar editando Editar -->
        <q-fab-action
          v-if="permitirEditar && !consultarReporte"
          color="secondary"
          @click="mostrarEditarReporte()"
          padding="sm md"
        >
          <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon
          >Continuar editando
        </q-fab-action>

        <!-- Continuar editando Crear -->
        <q-fab-action
          v-if="!permitirEditar && !consultarReporte"
          color="secondary"
          @click="volver()"
          padding="sm md"
        >
          <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon
          >Continuar editando
        </q-fab-action>

        <!-- Imprimir -->
        <q-fab-action color="secondary" @click="imprimir()" padding="sm xl"
          ><q-icon name="bi-printer" size="xs" class="q-mr-sm"></q-icon
          >Imprimir</q-fab-action
        >

        <!-- Guardar Crear -->
        <q-fab-action
          v-if="!permitirEditar && !consultarReporte"
          color="secondary"
          @click="guardar()"
          padding="sm md"
        >
          <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>Guardar
        </q-fab-action>

        <!-- Volver a mis reportes -->
        <q-fab-action
          v-if="consultarReporte"
          color="secondary"
          @click="volverMisReportes()"
          padding="sm md"
        >
          <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon
          >Volver a Mis reportes
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script src="./ReportePDF.ts"></script>

<style lang="scss" scoped>
.botones {
  z-index: 5;
  // position: fixed;
  width: 100%;
  display: flex;
}
.bg-fecha {
  background-color: #eee;
  padding: 16px;
}

.cinta-cabecera {
  background-color: #2e5496;
  color: #fff;
  display: flex;
  justify-content: space-around;
}

.titulo-seccion {
  background-color: #eee;
  text-align: center;
  font-weight: bold;
}

thead {
  background-color: #eee;
}
</style>
