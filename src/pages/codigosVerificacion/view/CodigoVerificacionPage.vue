<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasCodigosVerificacion"
    titulo-pagina="Códigos de verificación"
  >
    <template #encabezado>
      <div
        class="glass-layer glass-layer--inputs row items-center no-wrap q-pa-md q-mb-md"
      >
        <q-icon name="bi-shield-lock" size="24px" class="q-mr-md" />
        <div class="col">
          <div class="text-bold">Solicitar código al generar reportes</div>
          <div class="text-caption text-blue-grey-7">
            Si está activo, el asesor debe ingresar cualquiera de los códigos
            activos para generar un reporte en Reportes Multibanco.
          </div>
        </div>
        <q-toggle
          :model-value="requiereCodigo"
          :disable="cargandoEstado"
          color="positive"
          @update:model-value="cambiarEstado"
        />
      </div>
    </template>

    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Descripcion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="codigo.descripcion"
              placeholder="Ej. Código gerencia"
              :readonly="disabled"
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Codigo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">
              {{ esNuevo ? 'Código' : 'Nuevo código (opcional)' }}
            </label>
            <q-input
              v-model="codigo.codigo"
              :type="mostrarCodigo ? 'text' : 'password'"
              :placeholder="
                esNuevo
                  ? 'Obligatorio, de 4 a 20 caracteres'
                  : `Actual: ${codigo.codigo_enmascarado ?? ''}. Déjalo vacío para conservarlo`
              "
              :readonly="disabled"
              :error="!!v$.codigo.$errors.length"
              autocomplete="new-password"
              outlined
              dense
            >
              <template #append>
                <q-icon
                  :name="mostrarCodigo ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="mostrarCodigo = !mostrarCodigo"
                />
              </template>
              <template v-slot:error>
                <div v-for="error of v$.codigo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
            <div class="text-caption text-blue-grey-6">
              El código se guarda cifrado y no se podrá volver a ver.
            </div>
          </div>

          <!-- Activo -->
          <div class="col-12 col-md-6">
            <q-toggle
              v-model="codigo.activo"
              label="Activo"
              color="positive"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CodigoVerificacionPage.ts"></script>
