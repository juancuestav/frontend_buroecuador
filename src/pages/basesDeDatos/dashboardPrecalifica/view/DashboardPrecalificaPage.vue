<template>
  <q-page padding>
    <div class="row items-center q-pa-sm">
      <span class="text-h5 text-bold q-mb-md">Dashboard Precalifica</span>
      <p class="text-justify full-width">
        Ten una visión global acerca de las consultas realizadas, quién consultó
        y qué consultó.
      </p>
    </div>

    <multiple-page-layout :mixin="mixin">
      <template #tab1>
        <div class="row">
          <div class="col-12">
            <essential-table
              titulo="Usuarios"
              :configuracionColumnas="ccUsuariosDashboardPrecalifica"
              :datos="usuarios"
              :alto-fijo="false"
              :permitir-consultar="false"
              :permitir-editar="false"
              :permitir-eliminar="false"
              :accion1="btnMasDetalles"
            ></essential-table>
          </div>
        </div>
      </template>

      <template #tab2>
        <div class="row">
          <div class="col-12">
            <essential-table
              titulo="Detalle de consultas realizadas"
              :configuracionColumnas="configuracionColumnasDashboardPrecalifica"
              :datos="listado"
              :alto-fijo="false"
              :grid="false"
              :accion1="btnMasDetalles"
            ></essential-table>
          </div>
        </div>
      </template>
    </multiple-page-layout>
  </q-page>
</template>

<script src="./DashboardPrecalificaPage.ts"></script>
