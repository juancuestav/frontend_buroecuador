<template>
  <q-page padding>
    <h1 class="text-h6 text-center text-primary q-mb-md">
      BURÓ DE CRÉDITO ECUADOR
    </h1>
    <div class="text-center">Estado del pago de los clientes.</div>
    <small class="full-width block text-center q-mb-md"
      >(Al marcar como pagado se le activa la app al cliente)</small
    >

    <div class="row">
      <div class="col-12">
        <essential-table-tabs
          :configuracionColumnas="configuracionColumnasFacturacion"
          :datos="listado"
          :permitir-consultar="false"
          :permitir-editar="false"
          :permitir-eliminar="false"
          :accion1="pagado"
          :accion2="noPagado"
          :tab-options="tabOptions"
          @tab-seleccionado="filtrarFacturacion"
          :tabDefecto="1"
          paginate
          :mixin="mixin"
        >
        </essential-table-tabs>
      </div>
    </div>
  </q-page>
</template>

<script src="./FacturacionPlanesPage.ts"></script>
