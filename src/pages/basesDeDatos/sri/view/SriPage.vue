<template>
  <q-page padding>
    <limite-consultas></limite-consultas>

    <div class="row items-center q-mb-md">
      <!--<q-img
        src="~assets/sri.png"
        width="50px"
        class="rounded-cardd q-mr-sm"
      ></q-img> -->
      <span class="text-h5 text-bold">Buscador SRI</span>
    </div>
    <div class="row q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por RUC"
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
        <label class="block q-mb-sm">Número RUC</label>
        <q-input v-model="sri.numero_ruc" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Razón Social</label>
        <q-input v-model="sri.razon_social" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Nombre Fantasía Comercial</label>
        <q-input
          v-model="sri.nombre_fantasia_comercial"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Inscripción RUC</label>
        <q-input
          v-model="sri.fecha_inscripcion_ruc"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Lista Blanca</label>
        <q-input v-model="sri.lista_blanca" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Inicio Actividades</label>
        <q-input
          v-model="sri.fecha_inicio_actividades"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Valor Patrimonio</label>
        <q-input
          v-model="sri.valor_patrimonio"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Obligado</label>
        <q-input v-model="sri.obligado" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Cancelación</label>
        <q-input
          v-model="sri.fecha_cancelacion"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Pasaporte</label>
        <q-input v-model="sri.pasaporte" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Calificación Artesanal</label>
        <q-input
          v-model="sri.calificacion_artesanal"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Calificación Artesanal</label>
        <q-input
          v-model="sri.fecha_calificacion_artesanal"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Solicitud Suspensión</label>
        <q-input
          v-model="sri.fecha_solicitud_suspension"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Suspensión Definitiva</label>
        <q-input
          v-model="sri.fecha_suspension_definitiva"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Fecha Reinicio Actividades</label>
        <q-input
          v-model="sri.fecha_reinicio_actividades"
          outlined
          disable
          dense
        ></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Calle</label>
        <q-input v-model="sri.calle" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Número</label>
        <q-input v-model="sri.numero" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Intersección</label>
        <q-input v-model="sri.interseccion" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Teléfono</label>
        <q-input v-model="sri.telefono" outlined disable dense></q-input>
      </div>
      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Correo Electrónico</label>
        <q-input
          v-model="sri.correo_electronico"
          outlined
          disable
          dense
        ></q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./SriPage.ts"></script>
