<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Aprobar verificar cuentas</div>

    <tab-layout
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnasAprobarVerificarCuenta"
      :permitir-consultar="false"
      :permitir-eliminar="false"
    >
      <template #formulario>
        <div class="row q-col-gutter-sm">
          <div class="col-12 bg-grey-2 rounded q-mb-md q-pb-sm">
            <q-icon name="bi-person-fill"></q-icon>
            Usuario: <b>{{ verificaCuenta.usuario }}</b>
          </div>

          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Documento de identidad (anverso)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_anverso"
              :comprimir="true"
              :alto="'400px'"
              :error="!!v$.documento_identidad_anverso.$errors.length"
              @update:model-value="
                (data) => (verificaCuenta.documento_identidad_anverso = data)
              "
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.documento_identidad_anverso.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>

          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Documento de identidad (reverso)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_reverso"
              :comprimir="true"
              :alto="'400px'"
              :error="!!v$.documento_identidad_reverso.$errors.length"
              @update:model-value="
                (data) => (verificaCuenta.documento_identidad_reverso = data)
              "
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.documento_identidad_reverso.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <label for="q-mb-sm block">Documento de identidad (reverso)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_selfie"
              :comprimir="true"
              :alto="'400px'"
              :error="!!v$.documento_identidad_selfie.$errors.length"
              @update:model-value="
                (data) => (verificaCuenta.documento_identidad_selfie = data)
              "
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.documento_identidad_selfie.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>

          <div class="col-12">
            <label for="q-mb-sm block">Estado de verificación</label>
            <q-select
              v-model="verificaCuenta.estado_verificacion"
              outlined
              dense
              options-dense
              :options="opcionesVerificarCuenta"
            />
          </div>
        </div>
      </template>
    </tab-layout>
  </q-page>
</template>

<script src="./AprobarVerificarCuentaPage.ts"></script>
