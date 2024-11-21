<template>
  <q-page padding class="text-center">
    <div class="text-h6 q-mb-md">Verifica tu cuenta</div>
    <!-- <q-btn
      color="primary"
      href="https://bit.ly/VERIFICATUCUENTA"
      target="_blank"
      class="q-mb-md"
      unelevated
      square
      >Completar formulario de verificación</q-btn
    >
    <br /> -->

    <estados-component :propsTable="{ value: estadoVerificacion }" />

    <simple-layout
      :mixin="mixin"
      :permitirGuardar="permitirGuardar"
      :permitirCancelar="permitirGuardar"
      labelGuardar="Verificar"
    >
      <template #formulario>
        <div v-if="permitirGuardar" class="row q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Documento de identidad (anverso)</label>
            <small class="full-width block q-mb-sm"
              >Sube tu documento de identidad de lado frontal donde se muestre
              la foto de tu cédula</small
            >
            <q-img
              src="~assets/img/anverso.jpeg"
              width="100%"
              height="100px"
              fit="contain"
            >
            </q-img>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_anverso"
              :comprimir="true"
              hint="Seleccionar documento"
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
            <small class="full-width block q-mb-sm"
              >Sube tu documento de identidad donde se muestre el lado posterior
              que esta tu huella dactilar</small
            >
            <q-img
              src="~assets/img/reverso.jpeg"
              width="100%"
              height="100px"
              fit="contain"
            >
            </q-img>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_reverso"
              :comprimir="true"
              :alto="'400px'"
              hint="Seleccionar documento"
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

          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Prueba de vida</label>
            <small class="full-width block q-mb-sm"
              >Sube una foto con tu documento de identidad a la altura de la
              barbilla</small
            >
            <q-img
              src="~assets/img/prueba_de_vida.jpeg"
              width="100%"
              height="100px"
              fit="contain"
            >
            </q-img>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="verificaCuenta.documento_identidad_selfie"
              :comprimir="true"
              :alto="'400px'"
              hint="Seleccionar documento"
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
        </div>
      </template>
    </simple-layout>
  </q-page>
</template>

<script src="./VerificaCuentaPage.ts"></script>
