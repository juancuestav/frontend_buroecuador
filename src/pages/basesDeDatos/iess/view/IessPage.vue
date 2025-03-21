<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
        <q-img src="~assets/iess.png" width="50px" class="rounded-cardd q-mr-sm"></q-img>
        <span class="text-h5">Buscador</span>
    </div>
    <div class="row q-mb-md">
      <div class="col-md-6">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por número de cédula"
          @keyup.enter="listar({ search: busqueda })"
          outlined
          type="number"
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="positive"
              @click="listar({ search: busqueda })"
              no-caps
              push
              icon="bi-search"
              label="Buscar"
            >
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm bg-desenfoque q-pa-sm q-mb-sm rounded-card">
      <div class="col-md-4">
        <label class="block q-mb-sm">Ruc Empleador</label>
        <q-input v-model="iess.ruc_empleador" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Tipo Empresa</label>
        <q-input v-model="iess.tipo_empresa" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Nombre Empresa</label>
        <q-input v-model="iess.nombre_empleador" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Código Sucursal</label>
        <q-input v-model="iess.codigo_sucursal" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Teléfono Sucursal</label>
        <q-input v-model="iess.telefono_sucursal" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Dirección Sucursal</label>
        <q-input v-model="iess.direccion_sucursal" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Fax Sucursal</label>
        <q-input v-model="iess.fax_sucursal" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Dirección Afiliado</label>
        <q-input v-model="iess.direccion_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Teléfono Afiliado</label>
        <q-input v-model="iess.telefono_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Ocupación Afiliado</label>
        <q-input v-model="iess.cargo_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Celular Afiliado</label>
        <q-input v-model="iess.celular_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Email Afiliado</label>
        <q-input v-model="iess.correo_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Salario Afiliado</label>
        <q-input v-model="iess.sueldo_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Fecha Ingreso</label>
        <q-input v-model="iess.fecha_ingreso_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Fecha Salida</label>
        <q-input v-model="iess.fecha_salida_empleado" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Ubicación Empresa</label>
        <q-input v-model="iess.direccion_sucursal" outlined disable dense>
        </q-input>
      </div>

      <div class="col-md-4">
        <label class="block q-mb-sm">Nombre Empleado</label>
        <q-input v-model="iess.nombre_empleado" outlined disable dense>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script src="./IessPage.ts"></script>
