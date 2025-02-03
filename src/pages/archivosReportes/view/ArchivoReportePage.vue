<template>
  <simple-layout :mixin="mixin" :mostrarButtonSubmits="false" :titulo="titulo">
    <template #formulario>
      <div class="row bg-desenfoque q-pa-md rounded-card">
        <SelectorUsuario
          v-if="puedeSubirArchivos"
          :mixin="mixin"
          :propietario="4"
          :disable="false"
          @selected="listarArchivos()"
        ></SelectorUsuario>

        <transition v-if="puedeSubirArchivos" name="scale" mode="out-in">
          <div v-show="archivoReporte.user" class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :permitir-eliminar="true"
              :multiple="false"
              @nombre-archivo="(titulo) => (archivoReporte.titulo = titulo)"
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
          <div v-if="archivoReporte.user" class="col-12">
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
