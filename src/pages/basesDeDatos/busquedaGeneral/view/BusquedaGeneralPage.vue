<template>
  <q-page padding class="bg-transparent">
    <limite-consultas></limite-consultas>

    <div class="row items-center q-mb-md">
      <span class="text-h5 text-bold">Reporte precalifica BRC</span>
    </div>

    <div class="row q-mb-md justify-between">
      <div class="col-12 col-md-6 q-mb-sm">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por cédula"
          @keyup.enter="buscar(busqueda)"
          outlined
          type="number"
          clearable
          dense
        >
          <template #after>
            <q-btn
              color="primary"
              @click="buscar(busqueda)"
              no-caps
              unelevated
              icon="bi-search"
              label="Buscar"
            >
            </q-btn>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3">
        <q-btn
          color="negative"
          @click="descargarReportePdf(busqueda)"
          class="full-width"
          no-caps
          no-wrap
          unelevated
          icon="bi-file-pdf"
          label="Descargar reporte PDF"
        >
        </q-btn>
      </div>
    </div>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="Registro civil"
      header-class="bg-grey-1"
      default-opened
    >
      <div
        class="row q-col-gutter-x-sm q-pa-sm q-ma-sm"
        style="border-left: 3px solid #003dff"
      >
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cédula</label>
          <q-input
            v-model="general.registroCivil.cedula"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cédula Cónyuge</label>
          <q-input
            v-model="general.registroCivil.cedula_conyugue"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Apellidos y Nombres</label>
          <q-input
            v-model="general.registroCivil.apellidos_nombres"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Sexo</label>
          <q-input
            v-model="general.registroCivil.sexo"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Condición</label>
          <q-input
            v-model="general.registroCivil.condicion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha de Nacimiento</label>
          <q-input
            v-model="general.registroCivil.fecha_nacimiento"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">País</label>
          <q-input
            v-model="general.registroCivil.pais"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Estado Civil</label>
          <q-input
            v-model="general.registroCivil.estado_civil"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cónyuge</label>
          <q-input
            v-model="general.registroCivil.conyugue"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Apellidos y Nombres del Padre</label>
          <q-input
            v-model="general.registroCivil.apellidos_nombres_padre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">País del Padre</label>
          <q-input
            v-model="general.registroCivil.pais_padre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cédula del Padre</label>
          <q-input
            v-model="general.registroCivil.cedula_padre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Apellidos y Nombres de la Madre</label>
          <q-input
            v-model="general.registroCivil.apellidos_nombres_madre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">País de la Madre</label>
          <q-input
            v-model="general.registroCivil.pais_madre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cédula de la Madre</label>
          <q-input
            v-model="general.registroCivil.cedula_madre"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Dirección</label>
          <q-input
            v-model="general.registroCivil.direccion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha de Matrimonio</label>
          <q-input
            v-model="general.registroCivil.fecha_matrimonio"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Puesto u Ocupación</label>
          <q-input
            v-model="general.registroCivil.puesto_ocupacion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Instrucción</label>
          <q-input
            v-model="general.registroCivil.instruccion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha de Emisión</label>
          <q-input
            v-model="general.registroCivil.fecha_emision"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Código Dactilar</label>
          <q-input
            v-model="general.registroCivil.codigo_dactilar"
            outlined
            disable
            dense
          ></q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="Buró de crédito"
      header-class="bg-grey-1"
    >
      <div class="q-mb-lg text-bold q-mx-md q-mt-md">
        {{ general.banco.length + ' registros encontrados' }}
      </div>

      <div class="q-mx-sm q-mb-md">
        <essential-table
          :configuracionColumnas="columnasBanco"
          :datos="general.banco"
          :mostrar-header="false"
          :mostrar-footer="false"
          :alto-fijo="false"
          :grid="false"
        ></essential-table>
      </div>
      <!--<div
        v-for="(banco, index) in general.banco"
        :key="index"
        class="row q-col-gutter-x-sm q-pa-sm q-ma-sm q-mb-lg"
        style="
          border-left: 3px solid #379500;
          border-top: 1px solid #ddd;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        "
      >
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha</label>
          <q-input v-model="banco.fecha" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo</label>
          <q-input v-model="banco.tipo" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cédula/RUC</label>
          <q-input v-model="banco.cedula_ruc" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre</label>
          <q-input v-model="banco.nombre" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Código Entidad</label>
          <q-input v-model="banco.cod_entida" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Banco</label>
          <q-input v-model="banco.banco" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo Banco</label>
          <q-input v-model="banco.tipo_banco" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre Entidad</label>
          <q-input v-model="banco.entnombre" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo Entidad</label>
          <q-input v-model="banco.enttipo" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Vinculación</label>
          <q-input v-model="banco.vinculacio" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Riesgo</label>
          <q-input v-model="banco.riesgo" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Campo 1</label>
          <q-input v-model="banco.campo_1" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Calificación</label>
          <q-input v-model="banco.calificaci" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo Vigente</label>
          <q-input v-model="banco.saldo_vige" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">No Devengado</label>
          <q-input v-model="banco.no_dvenga" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 0-1</label>
          <q-input v-model="banco.saldo_0_1" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 1-2</label>
          <q-input v-model="banco.saldo_1_2" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 2-3</label>
          <q-input v-model="banco.saldo_2_3" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 3-6</label>
          <q-input v-model="banco.saldo_3_6" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 6-9</label>
          <q-input v-model="banco.saldo_6_9" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 9-12</label>
          <q-input v-model="banco.saldo_9_12" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 12-2</label>
          <q-input v-model="banco.saldo_12_2" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo 24-3</label>
          <q-input v-model="banco.saldo_24_3" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Más de 36</label>
          <q-input v-model="banco.mas_36" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Judicial</label>
          <q-input v-model="banco.judicial" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Castigo</label>
          <q-input v-model="banco.castigo" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Mora</label>
          <q-input v-model="banco.mora" outlined disable dense></q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Saldo Mora</label>
          <q-input v-model="banco.saldo_mora" outlined disable dense></q-input>
        </div>
      </div>-->
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="IESS"
      header-class="bg-grey-1"
    >
      <div
        class="row q-col-gutter-x-sm q-pa-sm q-ma-sm"
        style="border-left: 3px solid #7a86b6"
      >
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre Empresa</label>
          <q-input
            v-model="general.iess.nombre_empleador"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Salario Afiliado</label>
          <q-input
            v-model="general.iess.sueldo_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Ingreso</label>
          <q-input
            v-model="general.iess.fecha_ingreso_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Ruc Empleador</label>
          <q-input v-model="general.iess.ruc_empleador" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo Empresa</label>
          <q-input v-model="general.iess.tipo_empresa" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Código Sucursal</label>
          <q-input
            v-model="general.iess.codigo_sucursal"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Teléfono Sucursal</label>
          <q-input
            v-model="general.iess.telefono_sucursal"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Dirección Sucursal</label>
          <q-input
            v-model="general.iess.direccion_sucursal"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fax Sucursal</label>
          <q-input v-model="general.iess.fax_sucursal" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Dirección Afiliado</label>
          <q-input
            v-model="general.iess.direccion_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Teléfono Afiliado</label>
          <q-input
            v-model="general.iess.telefono_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Ocupación Afiliado</label>
          <q-input v-model="general.iess.cargo_empleado" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Celular Afiliado</label>
          <q-input
            v-model="general.iess.celular_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Email Afiliado</label>
          <q-input
            v-model="general.iess.correo_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Salida</label>
          <q-input
            v-model="general.iess.fecha_salida_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Ubicación Empresa</label>
          <q-input
            v-model="general.iess.direccion_sucursal"
            outlined
            disable
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre Empleado</label>
          <q-input
            v-model="general.iess.nombre_empleado"
            outlined
            disable
            dense
          >
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="SRI"
      header-class="bg-grey-1"
    >
      <div
        class="row q-col-gutter-x-sm q-pa-sm q-ma-sm"
        style="border-left: 3px solid #ef6d6d"
      >
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Número RUC</label>
          <q-input
            v-model="general.sri.numero_ruc"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Razón Social</label>
          <q-input
            v-model="general.sri.razon_social"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre Fantasía Comercial</label>
          <q-input
            v-model="general.sri.nombre_fantasia_comercial"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Inscripción RUC</label>
          <q-input
            v-model="general.sri.fecha_inscripcion_ruc"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Lista Blanca</label>
          <q-input
            v-model="general.sri.lista_blanca"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Inicio Actividades</label>
          <q-input
            v-model="general.sri.fecha_inicio_actividades"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Valor Patrimonio</label>
          <q-input
            v-model="general.sri.valor_patrimonio"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Obligado</label>
          <q-input
            v-model="general.sri.obligado"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Cancelación</label>
          <q-input
            v-model="general.sri.fecha_cancelacion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Pasaporte</label>
          <q-input
            v-model="general.sri.pasaporte"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Calificación Artesanal</label>
          <q-input
            v-model="general.sri.calificacion_artesanal"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Calificación Artesanal</label>
          <q-input
            v-model="general.sri.fecha_calificacion_artesanal"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Solicitud Suspensión</label>
          <q-input
            v-model="general.sri.fecha_solicitud_suspension"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Suspensión Definitiva</label>
          <q-input
            v-model="general.sri.fecha_suspension_definitiva"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Fecha Reinicio Actividades</label>
          <q-input
            v-model="general.sri.fecha_reinicio_actividades"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Calle</label>
          <q-input v-model="general.sri.calle" outlined disable dense></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Número</label>
          <q-input
            v-model="general.sri.numero"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Intersección</label>
          <q-input
            v-model="general.sri.interseccion"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Teléfono</label>
          <q-input
            v-model="general.sri.telefono"
            outlined
            disable
            dense
          ></q-input>
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Correo Electrónico</label>
          <q-input
            v-model="general.sri.correo_electronico"
            outlined
            disable
            dense
          ></q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="ANT"
      header-class="bg-grey-1"
    >
      <div class="q-mb-lg text-bold q-mx-md q-mt-md">
        {{ general.ant.length + ' registros encontrados' }}
      </div>

      <div
        v-for="(ant, index) in general.ant"
        :key="index"
        class="row q-col-gutter-x-sm q-pa-sm q-ma-sm q-mb-lg custom-shadow5"
        style="
          border-left: 3px solid #003dff;
          border-top: 1px solid #ddd;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        "
      >
        <div class="col-12">
          <span
            class="borde q-px-sm q-py-xs q-mb-md inline-block bg-body rounded-card"
            >{{ 'Registro ' + (index + 1) }}</span
          >
        </div>
        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Placa</label>
          <q-input v-model="ant.placa" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo identificación</label>
          <q-input v-model="ant.tipo_identificacion" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Identificación</label>
          <q-input v-model="ant.identificacion" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Nombre propietario</label>
          <q-input v-model="ant.nombre_propietario" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Telefono</label>
          <q-input v-model="ant.telefono" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo dirección</label>
          <q-input v-model="ant.tipo_direccion" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Dirección</label>
          <q-input v-model="ant.direccion" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Correo electrónico</label>
          <q-input v-model="ant.correo_electronico" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Motor</label>
          <q-input v-model="ant.motor" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cilindraje</label>
          <q-input v-model="ant.cilindraje" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Chasis</label>
          <q-input v-model="ant.chasis" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Clase</label>
          <q-input v-model="ant.clase" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo</label>
          <q-input v-model="ant.tipo" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Marca</label>
          <q-input v-model="ant.marca" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Modelo</label>
          <q-input v-model="ant.modelo" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Año</label>
          <q-input v-model="ant.anio" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Servicio</label>
          <q-input v-model="ant.servicio" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Año pagado</label>
          <q-input v-model="ant.anio_pagado" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Carga útil</label>
          <q-input v-model="ant.carga_util" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Tipo peso</label>
          <q-input v-model="ant.tipo_peso" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Peso</label>
          <q-input v-model="ant.peso" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Exoneración</label>
          <q-input v-model="ant.exoneracion" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Matriculado</label>
          <q-input v-model="ant.matriculado" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Última matricula</label>
          <q-input v-model="ant.ultima_matricula" outlined disable dense>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Ramv</label>
          <q-input v-model="ant.ramv" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Cantón</label>
          <q-input v-model="ant.canton" outlined disable dense> </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="block q-mb-sm">Avaluo</label>
          <q-input v-model="ant.avaluo" outlined disable dense> </q-input>
        </div>
      </div>
    </q-expansion-item>
  </q-page>
</template>

<script src="./BusquedaGeneralPage.ts"></script>
