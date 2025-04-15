<template>
  <q-page padding>
    <limite-consultas></limite-consultas>

    <div class="row items-center q-mb-md">
      <!--<q-img
        src="~assets/registro_civil.png"
        width="100px"
        class="rounded-cardd q-mr-sm"
      ></q-img> -->
      <span class="text-h5 text-bold">Buscador Registro civil</span>
    </div>
    <div class="row q-mb-md">
      <div class="col-md-6">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por número de cédula"
          @keyup.enter="buscar(busqueda)"
          outlined
          type="number"
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="primary"
              @click="buscar(busqueda)"
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

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cédula</label>
        <q-input
          v-model="registroCivil.cedula"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cédula Cónyuge</label>
        <q-input
          v-model="registroCivil.cedula_conyugue"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Apellidos y Nombres</label>
        <q-input
          v-model="registroCivil.apellidos_nombres"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Sexo</label>
        <q-input v-model="registroCivil.sexo" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Condición</label>
        <q-input
          v-model="registroCivil.condicion"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha de Nacimiento</label>
        <q-input
          v-model="registroCivil.fecha_nacimiento"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">País</label>
        <q-input v-model="registroCivil.pais" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Estado Civil</label>
        <q-input
          v-model="registroCivil.estado_civil"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cónyuge</label>
        <q-input
          v-model="registroCivil.conyugue"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Apellidos y Nombres del Padre</label>
        <q-input
          v-model="registroCivil.apellidos_nombres_padre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">País del Padre</label>
        <q-input
          v-model="registroCivil.pais_padre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cédula del Padre</label>
        <q-input
          v-model="registroCivil.cedula_padre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Apellidos y Nombres de la Madre</label>
        <q-input
          v-model="registroCivil.apellidos_nombres_madre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">País de la Madre</label>
        <q-input
          v-model="registroCivil.pais_madre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cédula de la Madre</label>
        <q-input
          v-model="registroCivil.cedula_madre"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Dirección</label>
        <q-input
          v-model="registroCivil.direccion"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha de Matrimonio</label>
        <q-input
          v-model="registroCivil.fecha_matrimonio"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Puesto u Ocupación</label>
        <q-input
          v-model="registroCivil.puesto_ocupacion"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Instrucción</label>
        <q-input
          v-model="registroCivil.instruccion"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha de Emisión</label>
        <q-input
          v-model="registroCivil.fecha_emision"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Código Dactilar</label>
        <q-input
          v-model="registroCivil.codigo_dactilar"
          outlined
          disable
          dense
        ></q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./RegistroCivilPage.ts"></script>
