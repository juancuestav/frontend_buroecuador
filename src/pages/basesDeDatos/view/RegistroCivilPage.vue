<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-img
        src="~assets/registro_civil.png"
        width="100px"
        class="rounded-cardd q-mr-sm"
      ></q-img>
      <span class="text-h5">Buscador</span>
    </div>
    <div class="row q-mb-sm">
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

    <essential-table-pagination
      titulo="Registro civil"
      :configuracionColumnas="configuracionColumnasRegistroCivil"
      :datos="listado"
      :mixin="mixin"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-header="false"
      :mostrar-footer="false"
      ajustar-celdas
    ></essential-table-pagination>
  </q-page>
</template>

<script src="./RegistroCivilPage.ts"></script>
