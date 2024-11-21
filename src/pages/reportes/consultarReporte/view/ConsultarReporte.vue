<template>
  <q-page padding>
    <div class="row q-col-gutter-sm q-mb-xl">
      <div class="col-12 col-md-3">
        <label class="block q-mb-sm">Identificación del cliente</label>
        <q-input
          v-model="criterioBusquedaUsuario"
          placeholder="Obligatorio"
          hint="Ingrese identificación del cliente y luego presione la tecla Enter"
          @keydown.enter="listarUsuarios()"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-9">
        <label class="block q-mb-sm">Cliente seleccionado</label>
        <q-input v-model="cliente.nombres" outlined dense disable>
          <template #after>
            <q-btn
              color="primary"
              @click="obtenerListado()"
              class="block full-width"
              no-caps
              push
            >
              <q-icon name="bi-search" class="q-mr-md" size="xs"></q-icon>
              Listar reportes
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <essential-table
          :configuracionColumnas="configuracionColumnasMiReporte"
          :datos="listado"
          :mostrarBotones="false"
          :mostrarHeader="false"
          :mostrarFooter="false"
          :permitirConsultar="false"
          @editar="editarReporte"
          @eliminar="eliminarReporte"
        ></essential-table>
      </div>
    </div>

    <essential-selectable-table
      ref="refListadoSeleccionableUsuario"
      :configuracion-columnas="configuracionColumnasUsuarios"
      :datos="listadoUsuarios"
      @selected="seleccionarUsuario"
    ></essential-selectable-table>
  </q-page>
</template>

<script src="./ConsultarReporte.ts"></script>
