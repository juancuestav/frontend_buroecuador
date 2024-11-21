<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Mis reportes</div>

    <div class="row">
      <div class="col-12">
        <essential-table
          :configuracion-columnas="configuracionColumnasMiReporte"
          :datos="listado"
          titulo="Listado de mis reportes"
          :permitir-editar="false"
          :permitir-eliminar="false"
          :mostrar-botones="false"
          @consultar="consultar"
        ></essential-table>
      </div>
    </div>
  </q-page>
</template>

<script src="./MiReporte.ts"></script>
