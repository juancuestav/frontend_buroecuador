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
      <div class="col-12 col-md-3">
        <q-select
          v-model="filtroResultado"
          :options="opcionesResultado"
          label="Resultado"
          options-dense
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
      <q-form @submit.prevent="revisar">
        <div class="row q-col-gutter-sm q-pt-md">
          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
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
        </div>
      </q-form>

      <div v-if="revision" class="q-mt-md">
        <!-- Reporte PDF: solo con respuesta de Equifax (no se vuelve a consultar) -->
        <generar-reporte
          v-if="revision.equifax"
          :key="revision.id"
          :revision-id="revision.id"
        />
        <resultado-validacion
          :revision="revision"
          :cargando="procesando"
          @pedir-codigo="dialogoCodigo = true"
          @reintentar="continuar(null)"
        />
        <datos-cliente :cliente="revision.cliente" />
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

<style scoped>
/* Misma altura que el campo de identificación (q-input dense) */
.campo-equifax {
  min-height: 40px;
}
</style>
