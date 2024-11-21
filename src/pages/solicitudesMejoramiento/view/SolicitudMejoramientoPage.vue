<template>
  <tab-layout-filter-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Solicitudes de mejoramiento"
    :tabOptions="tabOptions"
    :filtrar="filtrarSolicitudes"
    :tabDefecto="tabActual"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cliente</label>
            <q-input v-model="mejoramiento.cliente" disable outlined dense>
            </q-input>
          </div>

          <!-- Identificacion cliente -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Identificación del cliente</label>
            <q-input
              v-model="mejoramiento.identificacion_cliente"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Celular del cliente</label>
            <q-input v-model="mejoramiento.celular" disable outlined dense>
            </q-input>
          </div>

          <!-- Puntaje actual -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Puntaje actual</label>
            <q-input
              v-model="mejoramiento.puntaje_actual"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Deudas vencidas -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Deudas vencidas</label>
            <q-input
              v-model="mejoramiento.deudas_vencidas"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Puntaje a subir -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Puntaje a subir</label>
            <q-input
              v-model="mejoramiento.puntaje_subir"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Maximo a subir -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Máximo a subir</label>
            <q-input
              v-model="mejoramiento.maximo_subir"
              type="number"
              placeholder="Responder a cliente"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="mejoramiento.observacion"
              placeholder="Responder a cliente"
              @update:model-value="
                (v) => (mejoramiento.observacion = v.toUpperCase())
              "
              type="textarea"
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="mejoramiento.estado"
              :options="estadosMejoramiento"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Fecha de solicitud -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha de solicitud</label>
            <q-input v-model="mejoramiento.fecha" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs>
</template>

<script src="./SolicitudMejoramientoPage.ts"></script>
