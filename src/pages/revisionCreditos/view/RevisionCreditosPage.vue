<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasRevisionesCredito"
    titulo-pagina="Revisión de créditos"
    label-formulario="Revisión"
    label-listado="Historial de consultas"
    :mostrar-button-submits="false"
    :permitir-editar="false"
    :permitir-eliminar="false"
    :puede-exportar="false"
    paginate
    listado-diferido
  >
    <!-- Historial: filtros propios del listado -->
    <template #filtros-listado="{ recargar }">
      <!-- Solo quien puede ver todas las revisiones filtra por asesor -->
      <div v-if="puedeVerTodas" class="col-12 col-md-3">
        <q-select
          v-model="filtroAsesor"
          :options="asesores"
          option-value="id"
          option-label="nombre"
          label="Asesor"
          popup-content-class="opciones-amplias"
          emit-value
          map-options
          clearable
          dense
          outlined
          @update:model-value="filtrar(recargar)"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="filtroResultado"
          :options="opcionesResultado"
          label="Resultado"
          popup-content-class="opciones-amplias"
          emit-value
          map-options
          clearable
          dense
          outlined
          @update:model-value="filtrar(recargar)"
        />
      </div>
      <div class="col-6 col-md-2">
        <q-input
          v-model="filtroDesde"
          label="Desde"
          mask="####-##-##"
          placeholder="AAAA-MM-DD"
          clearable
          dense
          outlined
          @update:model-value="filtrarFecha(recargar, $event)"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="filtroDesde"
                  mask="YYYY-MM-DD"
                  @update:model-value="filtrar(recargar)"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-6 col-md-2">
        <q-input
          v-model="filtroHasta"
          label="Hasta"
          mask="####-##-##"
          placeholder="AAAA-MM-DD"
          clearable
          dense
          outlined
          @update:model-value="filtrarFecha(recargar, $event)"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="filtroHasta"
                  mask="YYYY-MM-DD"
                  @update:model-value="filtrar(recargar)"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </template>

    <!-- Revisión -->
    <template #formulario>
      <q-form class="no-imprimir" @submit.prevent="revisar">
        <div class="row q-col-gutter-sm q-pt-md">
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Identificación del cliente</label>
            <q-input
              v-model="cedula"
              placeholder="Obligatorio"
              mask="##########"
              inputmode="numeric"
              :disable="procesando"
              clearable
              outlined
              dense
            >
              <!-- QField cancela el submit de los clics dentro de #after: se usa @click.
                   Enter en el campo sigue enviando el formulario. -->
              <template #after>
                <q-btn
                  color="primary"
                  icon="bi-search"
                  label="Revisar"
                  :loading="procesando"
                  no-caps
                  unelevated
                  @click="revisar"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <label class="q-mb-sm block">Equifax</label>
            <div class="row items-center no-wrap campo-equifax">
              <q-checkbox
                v-model="forzarEquifax"
                label="Forzar nueva consulta"
                :disable="procesando"
                dense
              />
              <q-icon name="bi-info-circle" size="16px" class="q-ml-sm">
                <q-tooltip class="bg-dark">
                  Obtiene información actualizada de Equifax para esta revisión.
                </q-tooltip>
              </q-icon>
            </div>
          </div>

          <!-- Asesor al que pertenece la revisión; solo con permiso se elige otro -->
          <div class="col-12 col-sm-6 col-md-4">
            <label class="q-mb-sm block">Pertenece a</label>
            <q-select
              v-model="asesorId"
              :options="opcionesPerteneceA"
              popup-content-class="opciones-amplias"
              option-value="id"
              option-label="nombre"
              :disable="procesando || !puedeAsignarAsesor"
              emit-value
              map-options
              outlined
              dense
            />
          </div>
        </div>
      </q-form>

      <div v-if="revision" class="revision-imprimible q-mt-md">
        <div class="row justify-end no-imprimir">
          <q-btn
            flat
            no-caps
            color="primary"
            icon="bi-printer"
            label="Imprimir"
            @click="imprimir"
          >
            <q-tooltip class="bg-dark">
              Imprime la revisión o guárdala como PDF
            </q-tooltip>
          </q-btn>
        </div>
        <!-- Reporte PDF: solo con respuesta de Equifax (no se vuelve a consultar) -->
        <generar-reporte
          class="no-imprimir"
          v-if="revision.equifax"
          :key="revision.id"
          :revision-id="revision.id"
        />
        <resultado-validacion
          :revision="revision"
          :cargando="procesando"
          @pedir-codigo="dialogoCodigo = true"
          @reintentar="continuar(null)"
        >
          <template #despues-calificacion>
            <datos-cliente :cliente="revision.cliente" />
          </template>
        </resultado-validacion>
        <!-- Oculto hasta llegar a la validación 4 (consulta a Equifax) -->
        <datos-crediticios
          v-if="revision.equifax"
          :equifax="revision.equifax"
          :cliente="revision.cliente"
          :relacion="revision.relacion_laboral"
          :consultado-at="revision.equifax_consultado_at"
        />
        <relacion-laboral :relacion="revision.relacion_laboral" />
      </div>

      <dialogo-codigo-autorizacion
        v-model="dialogoCodigo"
        :revision="revision"
        :cargando="procesando"
        :error="errorCodigo"
        @confirmar="continuar"
      />
    </template>
  </tab-layout>
</template>

<script src="./RevisionCreditosPage.ts"></script>

<!-- Global (sin scoped): reglas de impresión de esta pantalla -->
<style lang="scss">
@import './imprimir.scss';

// Listas desplegables de esta pantalla con más espacio: el estilo global
// (custom-styles-light.scss) reduce .q-item a 14px de alto mínimo
.q-menu.opciones-amplias .q-item {
  min-height: 40px;
  padding: 8px 16px;
}
</style>

<style scoped>
/* Misma altura que el campo de identificación (q-input dense) */
.campo-equifax {
  min-height: 40px;
}
</style>
