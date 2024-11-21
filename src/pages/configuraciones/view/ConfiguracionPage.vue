<template>
  <q-page padding>
    <div class="bg-desenfoque rounded border-white q-pa-md">
      <!-- Precios -->
      <div class="text-bold">
        <q-icon name="bi-gear" class="q-mr-sm"></q-icon>Configuración general
      </div>
      <div class="row q-col-gutter-sm q-py-md q-mb-xl">
        <!-- ruc -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">RUC/Identificacion</label>
          <q-input
            v-model="configuracion.ruc"
            placeholder="Obligatorio"
            type="number"
            :error="!!v$.ruc.$errors.length"
            @blur="v$.ruc.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.ruc.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- ruc -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Tipo contribuyente</label>
          <q-input
            v-model="configuracion.tipo_contribuyente"
            placeholder="Obligatorio"
            :error="!!v$.tipo_contribuyente.$errors.length"
            @blur="v$.tipo_contribuyente.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div
                v-for="error of v$.tipo_contribuyente.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- representante -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Representante</label>
          <q-input
            v-model="configuracion.representante"
            placeholder="Obligatorio"
            :error="!!v$.representante.$errors.length"
            @blur="v$.representante.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.representante.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Razon social -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Razón Social</label>
          <q-input
            v-model="configuracion.razon_social"
            placeholder="Obligatorio"
            :error="!!v$.razon_social.$errors.length"
            @blur="v$.razon_social.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.razon_social.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- nombre comercial -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Nombre Comercial</label>
          <q-input
            v-model="configuracion.nombre_comercial"
            placeholder="Obligatorio"
            outlined
            dense
            :error="!!v$.nombre_comercial.$errors.length"
            @blur="v$.nombre_comercial.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.nombre_comercial.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- nombre empresa -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Nombre Empresa</label>
          <q-input
            v-model="configuracion.nombre_empresa"
            placeholder="Obligatorio"
            outlined
            :error="!!v$.nombre_empresa.$errors.length"
            @blur="v$.nombre_empresa.$touch"
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.nombre_empresa.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- direccion -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Direccion</label>
          <q-input
            v-model="configuracion.direccion_principal"
            autogrow
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Direccion secundaria 1 -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Dirección secundaria 1</label>
          <q-input
            v-model="configuracion.direccion_secundaria1"
            autogrow
            placeholder="Opcional"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Direccion secundaria 2 -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Dirección secundaria 2</label>
          <q-input
            v-model="configuracion.direccion_secundaria2"
            autogrow
            placeholder="Opcional"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- telefono -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Telefono</label>
          <q-input
            v-model="configuracion.telefono"
            autogrow
            type="tel"
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- celular -->
        <div class="col-12 col-md-2">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="configuracion.celular1"
            autogrow
            type="tel"
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Celular 2 -->
        <div class="col-12 col-md-2">
          <label class="q-mb-sm block">Celular 2</label>
          <q-input
            v-model="configuracion.celular2"
            autogrow
            type="tel"
            placeholder="Opcional"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- sitio web -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Sitio web</label>
          <q-input
            v-model="configuracion.sitio_web"
            autogrow
            type="email"
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- correo principal -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Correo principal</label>
          <q-input
            v-model="configuracion.correo_principal"
            autogrow
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Correo secundario -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Correo secundario</label>
          <q-input
            v-model="configuracion.correo_secundario"
            autogrow
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Moneda -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Moneda</label>
          <q-input
            v-model="configuracion.moneda"
            autogrow
            placeholder="Obligatorio"
            :error="!!v$.moneda.$errors.length"
            @blur="v$.moneda.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.moneda.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- ciiu -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">CIIU</label>
          <q-input
            v-model="configuracion.ciiu"
            placeholder="Opcional"
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Logo claro -->
        <div class="col-12 col-md-4">
          <label for="q-mb-sm block">Logo (tema claro / favicon)</label>
          <selector-imagen
            file_extensiones=".jpg, image/*"
            :imagen="configuracion.logo_claro"
            :comprimir="false"
            :alto="'400px'"
            @update:model-value="(data) => (configuracion.logo_claro = data)"
          ></selector-imagen>
        </div>

        <!-- Logo oscuro -->
        <div class="col-12 col-md-4">
          <label for="q-mb-sm block">Logo (tema oscuro)</label>
          <selector-imagen
            file_extensiones=".jpg, image/*"
            :imagen="configuracion.logo_oscuro"
            :comprimir="false"
            :alto="'400px'"
            @update:model-value="(data) => (configuracion.logo_oscuro = data)"
          ></selector-imagen>
        </div>

        <!-- Logo oscuro -->
        <div class="col-12 col-md-4">
          <label for="q-mb-sm block">Logo (marca de agua)</label>
          <selector-imagen
            file_extensiones=".jpg, image/*"
            :imagen="configuracion.logo_marca_agua"
            :comprimir="false"
            :alto="'400px'"
            @update:model-value="
              (data) => (configuracion.logo_marca_agua = data)
            "
          ></selector-imagen>
        </div>
      </div>

      <!-- Precios -->
      <div class="text-bold">
        <q-icon name="bi-tags" class="q-mr-sm"></q-icon>Precios
      </div>
      <div class="row q-col-gutter-sm q-py-md">
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Porcentaje IVA</label>
          <q-input
            v-model="configuracion.porcentaje_iva"
            type="number"
            suffix="%"
            outlined
            dense
          >
          </q-input>
        </div>
      </div>

      <!-- Redes sociales -->
      <div class="text-bold">
        <q-icon name="bi-chat" class="q-mr-sm"></q-icon>Redes sociales
      </div>
      <div class="row q-col-gutter-sm q-py-md">
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Whatsapp</label>
          <q-input v-model="configuracion.whatsapp" outlined dense>
            <template #prepend>
              <q-icon name="bi-whatsapp" size="xs"></q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Facebook</label>
          <q-input
            v-model="configuracion.facebook"
            placeholder="https://"
            outlined
            dense
          >
            <template #prepend>
              <q-icon name="bi-facebook" size="xs"></q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Instagram</label>
          <q-input
            v-model="configuracion.instagram"
            placeholder="https://"
            outlined
            dense
          >
            <template #prepend>
              <q-icon name="bi-instagram" size="xs"></q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Twitter</label>
          <q-input
            v-model="configuracion.twitter"
            placeholder="https://"
            outlined
            dense
          >
            <template #prepend>
              <q-icon name="bi-twitter" size="xs"></q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <!-- Pagos -->
      <div class="text-bold">
        <q-icon name="bi-credit-card" class="q-mr-sm"></q-icon>Pagos
      </div>

      <div class="row q-col-gutter-sm q-py-md">
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Pagos en efectivo (*)</label>
          <q-select
            v-model="configuracion.admite_pago_efectivo"
            :options="estados"
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

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Pagos con tarjeta (*)</label>
          <q-select
            v-model="configuracion.admite_pago_tarjeta"
            :options="estados"
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

        <div
          v-if="configuracion.admite_pago_tarjeta === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block">URL pago con tarjeta</label>
          <q-input v-model="configuracion.url_pago_tarjeta" outlined dense>
          </q-input>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">
            Transferencia / Depósito bancario (*)</label
          >
          <q-select
            v-model="configuracion.admite_deposito_bancario"
            :options="estados"
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

        <div
          v-if="configuracion.admite_deposito_bancario === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block"
            >No. cuenta para transferencias o depósitos</label
          >
          <q-input
            v-model="configuracion.numero_cuenta"
            outlined
            dense
          ></q-input>
        </div>

        <div
          v-if="configuracion.admite_deposito_bancario === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block">Entidad financiera</label>
          <q-input
            v-model="configuracion.entidad_financiera"
            outlined
            dense
          ></q-input>
        </div>

        <div
          v-if="configuracion.admite_deposito_bancario === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block">Propietario de cuenta</label>
          <q-input
            v-model="configuracion.propietario_cuenta"
            outlined
            dense
          ></q-input>
        </div>

        <div
          v-if="configuracion.admite_deposito_bancario === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block">
            Identificación del propietario de la cuenta</label
          >
          <q-input
            v-model="configuracion.identificacion_propietario_cuenta"
            outlined
            dense
          ></q-input>
        </div>

        <div
          v-if="configuracion.admite_deposito_bancario === 'ACTIVO'"
          class="col-12 col-md-3 q-mb-md"
        >
          <label class="q-mb-sm block">Número de contacto</label>
          <q-input v-model="configuracion.numero_contacto" outlined dense>
            <template #prepend>
              <q-icon name="bi-telephone" size="xs"></q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-pt-md">
        <!-- Boton guardar -->
        <q-btn color="primary" class="full-width" no-caps square unelevated @click="guardar(configuracion)">
          <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
          <span>Guardar cambios</span>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script src="./ConfiguracionPage.ts"></script>
