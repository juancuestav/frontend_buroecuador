<template>
  <q-page padding>
    <limite-consultas></limite-consultas>

    <div class="row items-center q-mb-md">
      <!--<q-img
        src="~assets/ant.png"
        width="50px"
        class="rounded-cardd q-mr-sm"
      ></q-img> -->
      <span class="text-h5 text-bold">Buscador ANT</span>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Modo de búsqueda</label>
        <q-btn-toggle
          v-model="modoBusqueda"
          class="toggle-button-primary"
          spread
          no-caps
          toggle-color="primary"
          no-wrap
          unelevated
          :options="[
            {
              label: 'Por medio de cédula',
              value: 'CEDULA',
            },
            {
              label: 'Por medio de la placa',
              value: 'PLACA',
            },
          ]"
        />
      </div>

      <div v-if="modoBusqueda === 'CEDULA'" class="col-12 col-md-6">
        <label class="q-mb-sm block">Ingrese la cédula</label>
        <q-input
          v-model="busqueda"
          placeholder="Buscar por número de cédula"
          @keyup.enter="buscarPorCedula(busqueda)"
          outlined
          type="number"
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="primary"
              @click="buscarPorCedula(busqueda)"
              no-caps
              unelevated
              icon="bi-search"
              label="Buscar"
            >
            </q-btn>
          </template>
        </q-input>
      </div>

      <div v-if="modoBusqueda === 'PLACA'" class="col-12 col-md-6">
        <label class="q-mb-sm block">Ingrese la placa</label>
        <q-input
          v-model="busqueda"
          placeholder="Buscar por medio de la placa"
          @keyup.enter="buscarPorPlaca(busqueda)"
          outlined
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="primary"
              @click="buscarPorPlaca(busqueda)"
              no-caps
              unelevated
              icon="bi-search"
              label="Buscar"
            >
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-mb-lg text-bold">
      {{ listado.length + ' registros encontrados' }}
    </div>

    <div
      v-for="(ant, index) in listado"
      :key="index"
      class="row q-col-gutter-sm q-pa-sm q-mx-xs q-mb-xl custom-shadow5 borde"
      style="border-left: 3px solid #003dff"
    >
      <div class="col-12">
        <span
          class="borde q-px-sm q-py-xs q-mb-md inline-block bg-body rounded-card"
          >{{ 'Registro ' + (index + 1) }}</span
        >
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Placa</label>
        <q-input v-model="ant.placa" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo identificación</label>
        <q-input v-model="ant.tipo_identificacion" outlined disable dense>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Identificación</label>
        <q-input v-model="ant.identificacion" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Nombre propietario</label>
        <q-input v-model="ant.nombre_propietario" outlined disable dense>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Telefono</label>
        <q-input v-model="ant.telefono" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo dirección</label>
        <q-input v-model="ant.tipo_direccion" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Dirección</label>
        <q-input v-model="ant.direccion" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Correo electrónico</label>
        <q-input v-model="ant.correo_electronico" outlined disable dense>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Motor</label>
        <q-input v-model="ant.motor" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cilindraje</label>
        <q-input v-model="ant.cilindraje" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Chasis</label>
        <q-input v-model="ant.chasis" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Clase</label>
        <q-input v-model="ant.clase" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo</label>
        <q-input v-model="ant.tipo" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Marca</label>
        <q-input v-model="ant.marca" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Modelo</label>
        <q-input v-model="ant.modelo" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Año</label>
        <q-input v-model="ant.anio" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Servicio</label>
        <q-input v-model="ant.servicio" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Año pagado</label>
        <q-input v-model="ant.anio_pagado" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Carga útil</label>
        <q-input v-model="ant.carga_util" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo peso</label>
        <q-input v-model="ant.tipo_peso" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Peso</label>
        <q-input v-model="ant.peso" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Exoneración</label>
        <q-input v-model="ant.exoneracion" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Matriculado</label>
        <q-input v-model="ant.matriculado" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Última matricula</label>
        <q-input v-model="ant.ultima_matricula" outlined disable dense>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Ramv</label>
        <q-input v-model="ant.ramv" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cantón</label>
        <q-input v-model="ant.canton" outlined disable dense> </q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Avaluo</label>
        <q-input v-model="ant.avaluo" outlined disable dense> </q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./AntPage.ts"></script>
