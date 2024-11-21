<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Planes y servicios"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-lg">
          <!-- Nombre -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="servicio.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              @update:model-value="(v) => (servicio.nombre = v.toUpperCase())"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Categoria -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Categoría</label>
            <q-select
              v-model="servicio.categoria"
              :options="listadosAuxiliares.categorias"
              hint="Agregue elementos desde el panel de categorías"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Es plan -->
          <div class="col-12 col-md-3 q-mb-md">
            <br />
            <q-checkbox v-model="servicio.es_plan" label="Es plan" />
          </div>

          <!-- Descripcion -->
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">Descripción</label>
            <q-editor v-model="servicio.descripcion" min-height="5rem" />
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="servicio.estado"
              :options="listadosAuxiliares.estadosProducto"
              :error="!!v$.estado.$errors.length"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.estado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Precio unitario -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Precio unitario</label>
            <q-input
              v-model="servicio.precio_unitario"
              placeholder="Obligatorio"
              :disable="disabled"
              prefix="$"
              :error="!!v$.precio_unitario.$errors.length"
              @update:model-value="
                (v) => (servicio.precio_unitario = v.toUpperCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.precio_unitario.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Cobrar IVA -->
          <div class="col-12 col-md-3 q-mb-md">
            <br />
            <q-checkbox v-model="servicio.gravable" label="Cobrar IVA" />
          </div>

          <!-- Url video -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">URL Video</label>
            <q-input
              v-model="servicio.url_video"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Imagen -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen
              :imagen="servicio.imagen"
              @update:modelValue="(data) => (servicio.imagen = data)"
            >
            </selector-imagen>
          </div>
        </div>

        <div class="row">
          <div class="text-bold block q-mb-md">Métodos de pago</div>
          <!-- Url destino -->
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block"
              >URL para cobro con tarjeta de crédito o débito</label
            >
            <q-input
              v-model="servicio.url_destino"
              placeholder="Opcional"
              :disable="disabled"
              :error="!!v$.url_destino.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.url_destino.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">URL para cobro con Paypal</label>
            <q-input
              v-model="servicio.url_paypal"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div> -->
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ServicioPage.ts"></script>
