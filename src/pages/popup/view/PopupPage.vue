<template>
  <card-layout
    titulo-modal="Publicidad en popup"
    titulo-panel="Panel de publicidad en popup"
    textoBotonCrearModal="Crear publicidad"
    :mixin="mixin"
  >
    <template #formulario>
      <form id="formulario" @submit.prevent>
        <div class="row q-col-gutter-xs">
          <!-- Titulo -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="block q-mb-sm">Titulo</label>
            <q-input
              v-model="publicidad.titulo"
              placeholder="Obligatorio"
              dense
              outlined
              :error="!!v$.titulo.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- URL Destino -->
          <div class="col-12 col-md-6">
            <label class="block q-mb-sm">URL destino</label>
            <q-input
              v-model="publicidad.url_destino"
              placeholder="Obligatorio"
              @blur="resetearNuevaPestana()"
              dense
              outlined
            />
          </div>

          <div v-show="publicidad.url_destino" class="col-12 col-md-6 q-mb-md">
            <br />
            <q-checkbox
              v-model="publicidad.nueva_pestana"
              label="Abrir en nueva pestaña"
            />
          </div>

          <!-- Imagen -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen
              :imagen="publicidad.imagen"
              @update:modelValue="(data) => (publicidad.imagen = data)"
            >
              <template v-slot:errorr>
                <div v-for="error of v$.imagen.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>
        </div>
      </form>
    </template>
  </card-layout>
</template>

<script src="./PopupPage.ts"></script>
