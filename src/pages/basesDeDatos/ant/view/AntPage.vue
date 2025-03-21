<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-img
        src="~assets/ant.png"
        width="50px"
        class="rounded-cardd q-mr-sm"
      ></q-img>
      <span class="text-h5">Buscador</span>
    </div>
    <div class="row q-mb-md">
      <div class="col-md-6">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por número de cédula"
          @keyup.enter="listar({ search: busqueda })"
          outlined
          type="number"
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="positive"
              @click="listar({ search: busqueda })"
              no-caps
              push
              icon="bi-search"
              label="Buscar"
            >
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm bg-desenfoque q-pa-sm q-mb-sm rounded-card">
      <div class="col-md-4">
        <label class="block q-mb-sm">Placa</label>
        <q-input v-model="ant.placa" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Tipo identificación</label>
        <q-input v-model="ant.tipo_identificacion" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Identificación</label>
        <q-input v-model="ant.identificacion" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Nombre propietario</label>
        <q-input v-model="ant.nombre_propietario" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Telefono</label>
        <q-input v-model="ant.telefono" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Tipo dirección</label>
        <q-input v-model="ant.tipo_direccion" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Dirección</label>
        <q-input v-model="ant.direccion" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Correo electrónico</label>
        <q-input v-model="ant.correo_electronico" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Motor</label>
        <q-input v-model="ant.motor" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Cilindraje</label>
        <q-input v-model="ant.cilindraje" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Chasis</label>
        <q-input v-model="ant.chasis" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Clase</label>
        <q-input v-model="ant.clase" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Tipo</label>
        <q-input v-model="ant.tipo" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Marca</label>
        <q-input v-model="ant.marca" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Modelo</label>
        <q-input v-model="ant.modelo" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Año</label>
        <q-input v-model="ant.anio" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Servicio</label>
        <q-input v-model="ant.servicio" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Año pagado</label>
        <q-input v-model="ant.anio_pagado" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Carga útil</label>
        <q-input v-model="ant.carga_util" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Tipo peso</label>
        <q-input v-model="ant.tipo_peso" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Peso</label>
        <q-input v-model="ant.peso" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Exoneración</label>
        <q-input v-model="ant.exoneracion" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Matriculado</label>
        <q-input v-model="ant.matriculado" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Última matricula</label>
        <q-input v-model="ant.ultima_matricula" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Ramv</label>
        <q-input v-model="ant.ramv" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Cantón</label>
        <q-input v-model="ant.canton" outlined disable dense> </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Avaluo</label>
        <q-input v-model="ant.avaluo" outlined disable dense> </q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./AntPage.ts"></script>
