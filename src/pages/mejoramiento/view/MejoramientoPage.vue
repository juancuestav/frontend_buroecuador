<template>
  <q-page padding>
    <div class="card-capas q-mb-xl q-pa-md">
      <div class="text-h6 q-mb-lg">Solicitar mejoramiento</div>

      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Puntaje actual -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Puntaje actual</label>
            <q-input
              v-model="mejoramiento.puntaje_actual"
              :error="!!v$.puntaje_actual.$errors.length"
              type="number"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.puntaje_actual.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Deudas vencidas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Deudas vencidas</label>
            <q-select
              v-model="mejoramiento.deudas_vencidas"
              :error="!!v$.deudas_vencidas.$errors.length"
              :options="estadosSI_NO"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.deudas_vencidas.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Puntaje a subir -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Puntaje a subir</label>
            <q-select
              v-model="mejoramiento.puntaje_subir"
              :error="!!v$.puntaje_subir.$errors.length"
              :options="puntuaciones"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.puntaje_subir.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Fecha de solicitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de solicitud</label>
            <q-input v-model="mejoramiento.fecha" disable outlined dense>
            </q-input>
          </div>
        </div>

        <div class="row q-py-md justify-center">
          <!-- Boton guardar -->
          <q-btn class="q-mx-sm" color="primary" no-caps push @click="enviar()">
            <q-icon name="bi-send" size="xs" class="q-pr-sm"></q-icon>
            <span>Enviar solicitud</span>
          </q-btn>
        </div>

        <div class="text-center">
          <small>
            Has enviado
            {{ solicitudesEnviadas }} solicitud(es) éste mes.
          </small>
        </div>
      </q-form>
    </div>

    <div class="q-mb-md text-bold">
      <q-icon
        name="bi-check-circle-fill"
        class="q-mr-sm"
        color="positive"
      ></q-icon>
      Estado de su solicitud
    </div>

    <card-mejoramiento
      v-if="solicitudData"
      :mejoramiento="solicitudData"
    ></card-mejoramiento>
    <div v-else>Aún no has enviado ninguna solicitud.</div>
  </q-page>
</template>

<script src="./MejoramientoPage.ts"></script>
