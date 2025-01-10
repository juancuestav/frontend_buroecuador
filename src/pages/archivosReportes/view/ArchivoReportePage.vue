<template>
  <simple-layout :mixin="mixin" :mostrarButtonSubmits="false" :titulo="titulo">
    <template #formulario>
      <div class="row bg-desenfoque q-pa-md rounded-card">
        <div v-if="puedeSubirArchivos" class="col-12 q-mb-md">
          <q-btn-toggle
            v-model="filtroUsuario.tipo_seleccion"
            class="toggle-button-primary"
            spread
            no-caps
            @update:model-value="
              () => {
                listado = []
                filtroUsuario.user_id = null
                filtroUsuario.identificacion = null
              }
            "
            rounded
            toggle-color="primary"
            unelevated
            :options="[
              {
                label: tipoSeleccionUsuario.POR_IDENTIFICATION,
                value: tipoSeleccionUsuario.POR_IDENTIFICATION,
              },
              {
                label: tipoSeleccionUsuario.POR_NOMBRES,
                value: tipoSeleccionUsuario.POR_NOMBRES,
              },
            ]"
          />
        </div>

        <div
          v-if="
            puedeSubirArchivos &&
            filtroUsuario.tipo_seleccion === tipoSeleccionUsuario.POR_NOMBRES
          "
          class="col-12 q-mb-md"
        >
          <label class="q-mb-sm block"
            >Seleccione un usuario para listar o subir sus archivos</label
          >
          <q-select
            v-model="filtroUsuario.user_id"
            :options="usuarios"
            @filter="filtrarUsuarios"
            @update:model-value="listarArchivos()"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            :option-label="(v) => v.apellidos + ' ' + v.name"
            :option-value="(v) => v.id"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template #after>
              <div>
                <q-btn
                  color="positive"
                  no-caps
                  push
                  class="full-width"
                  @click="consultarUsuarios()"
                >
                  <q-icon
                    name="bi-arrow-clockwise"
                    size="xs"
                    class="q-pr-sm"
                  ></q-icon>
                  <span>{{ 'Refrescar listado de usuarios' }}</span>
                </q-btn>
              </div>
            </template>
          </q-select>
        </div>

        <div
          v-if="
            puedeSubirArchivos &&
            filtroUsuario.tipo_seleccion ===
              tipoSeleccionUsuario.POR_IDENTIFICATION
          "
          class="col-12 col-md-9 q-mb-md"
        >
          <label class="q-mb-sm block"
            >Escriba la identificación del usuario para listar o subir sus
            archivos</label
          >
          <q-input
            v-model="filtroUsuario.identificacion"
            placeholder="Escriba la identificación y luego presione ENTER o buscar por identificación"
            @keyup.enter="listarArchivos()"
            outlined
            dense
          >
          </q-input>
        </div>

        <div
          v-if="
            puedeSubirArchivos &&
            filtroUsuario.tipo_seleccion ===
              tipoSeleccionUsuario.POR_IDENTIFICATION
          "
          class="col-12 col-md-3"
        >
          <label class="block q-mb-sm">&nbsp;</label>
          <q-btn
            color="primary"
            no-caps
            unelevated
            square
            class="full-width"
            @click="listarArchivos()"
          >
            <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
            <span>{{ 'Buscar por identificación' }}</span>
          </q-btn>
        </div>

        <transition v-if="puedeSubirArchivos" name="scale" mode="out-in">
          <div v-show="filtroUsuario.user_id" class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :permitir-eliminar="true"
              :multiple="false"
              @nombre-archivo="(titulo) => archivoReporte.titulo = titulo"
            >
              <template #boton-subir>
                <q-btn
                  color="positive"
                  no-caps
                  unelevated
                  class="full-width q-mb-lg"
                  @click="guardarArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados</q-btn
                >
              </template>
            </gestor-archivos>
          </div>
        </transition>

        <transition name="scale" mode="out-in">
          <div v-if="filtroUsuario.user_id" class="col-12">
            <div v-if="!puedeSubirArchivos" class="text-cednter q-mb-md">
              Aquí encontrarás todos los reportes de crédito que adquieras con
              nosotros.
            </div>
            <essential-table
              titulo="Archivos compartidos"
              :configuracionColumnas="columnas"
              :datos="listado"
              :permitirFiltrar="true"
              :permitir-buscar="!esCliente"
              :mostrarExportar="true"
              :permitir-consultar="false"
              :permitir-editar="false"
              :permitir-eliminar="false"
              :ajustarCeldas="true"
              :mostrar-exportar="false"
              :permitir-filtrar="false"
              :accion1Header="btnActualizarListado"
              :accion2Header="btnActualizarMisArchivos"
              :accion1="btnRenombrar"
              :accion2="btnEliminar"
              :accion3="btnVisualizar"
            ></essential-table>
          </div>
        </transition>
      </div>

      <!-- <PdfViewer
        ref="refPdfViewer"
        pdfUrl="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
      ></PdfViewer> -->

      <!-- <PdfViewer2 pdfUrl="https://www.burodecredito.ec/storage/archivos_reportes/2/Reporte548_1221654848.pdf"></PdfViewer2> -->

      <PdfViewer ref="refPdfViewer"></PdfViewer>
    </template>
  </simple-layout>
</template>

<script src="./ArchivoReportePage.ts"></script>
