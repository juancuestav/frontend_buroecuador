<template>
  <q-page padding>
    <limite-consultas></limite-consultas>

    <div class="row items-center q-mb-md">
      <!--<q-img
        src="~assets/ant.png"
        width="50px"
        class="rounded-cardd q-mr-sm"
      ></q-img> -->
      <span class="text-h5 text-bold">Buscador Buró de Crédito</span>
    </div>
    <div class="row q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por número de cédula o RUC"
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

    <div class="q-mb-lg text-bold">
      {{ listado.length + ' registros encontrados' }}
    </div>

    <div
      v-for="(banco, index) in listado"
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
        <label class="block q-mb-sm">Fecha</label>
        <q-input v-model="banco.fecha" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo</label>
        <q-input v-model="banco.tipo" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Cédula/RUC</label>
        <q-input v-model="banco.cedula_ruc" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Nombre</label>
        <q-input v-model="banco.nombre" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Código Entidad</label>
        <q-input v-model="banco.cod_entida" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Banco</label>
        <q-input v-model="banco.banco" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo Banco</label>
        <q-input v-model="banco.tipo_banco" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Nombre Entidad</label>
        <q-input v-model="banco.entnombre" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Tipo Entidad</label>
        <q-input v-model="banco.enttipo" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Vinculación</label>
        <q-input v-model="banco.vinculacio" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Riesgo</label>
        <q-input v-model="banco.riesgo" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Campo 1</label>
        <q-input v-model="banco.campo_1" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Calificación</label>
        <q-input v-model="banco.calificaci" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo Vigente</label>
        <q-input v-model="banco.saldo_vige" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">No Devengado</label>
        <q-input v-model="banco.no_dvenga" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 0-1</label>
        <q-input v-model="banco.saldo_0_1" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 1-2</label>
        <q-input v-model="banco.saldo_1_2" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 2-3</label>
        <q-input v-model="banco.saldo_2_3" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 3-6</label>
        <q-input v-model="banco.saldo_3_6" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 6-9</label>
        <q-input v-model="banco.saldo_6_9" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 9-12</label>
        <q-input v-model="banco.saldo_9_12" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 12-2</label>
        <q-input v-model="banco.saldo_12_2" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo 24-3</label>
        <q-input v-model="banco.saldo_24_3" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Más de 36</label>
        <q-input v-model="banco.mas_36" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Judicial</label>
        <q-input v-model="banco.judicial" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Castigo</label>
        <q-input v-model="banco.castigo" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Mora</label>
        <q-input v-model="banco.mora" outlined disable dense></q-input>
      </div>

      <div class="col-12 col-md-4">
        <label class="block q-mb-sm">Saldo Mora</label>
        <q-input v-model="banco.saldo_mora" outlined disable dense></q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./BancoPage.ts"></script>
