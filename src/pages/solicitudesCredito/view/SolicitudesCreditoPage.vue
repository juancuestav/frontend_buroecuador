<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasSolicitudesCredito"
    titulo-pagina="Ingreso de créditos"
    label-formulario="Solicitud"
    label-listado="Historial de solicitudes"
    :mostrar-button-submits="false"
    :permitir-editar="false"
    :permitir-eliminar="false"
    :puede-exportar="false"
    paginate
    listado-diferido
  >
    <!-- Historial: botón de nueva solicitud y resumen sobre la tabla -->
    <template #antes-listado>
      <div class="row justify-end q-mb-md">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="bi-plus-lg"
          label="Nueva solicitud de crédito"
          @click="nuevaSolicitud"
        />
      </div>
      <dashboard-solicitudes
        ref="dashboard"
        @ver-en-historial="verEnHistorial"
        @parametros="dialogoParametros = true"
      />
      <dialogo-parametros v-model="dialogoParametros" />
    </template>

    <template #filtros-listado="{ recargar }">
      <div class="col-12 col-sm-6 col-md">
        <label class="q-mb-sm block">Estado</label>
        <q-select
          v-model="filtroEstado"
          :options="opcionesEstado"
          :display-value="filtroEstado ? undefined : 'Todos'"
          emit-value
          map-options
          clearable
          dense
          outlined
          @update:model-value="filtrar(recargar)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md">
        <label class="q-mb-sm block">Banco</label>
        <q-select
          v-model="filtroBanco"
          :options="BANCOS"
          :display-value="filtroBanco ? undefined : 'Todos'"
          emit-value
          map-options
          clearable
          dense
          outlined
          @update:model-value="filtrar(recargar)"
        />
      </div>
      <div v-if="puedeVerTodas && asesores.length" class="col-12 col-sm-6 col-md">
        <label class="q-mb-sm block">Asesor</label>
        <q-select
          v-model="filtroAsesor"
          :options="asesores"
          option-value="id"
          option-label="nombre"
          :display-value="filtroAsesor ? undefined : 'Todos'"
          emit-value
          map-options
          clearable
          dense
          outlined
          @update:model-value="filtrar(recargar)"
        />
      </div>
      <div class="col-6 col-md">
        <label class="q-mb-sm block">Desde</label>
        <q-input
          v-model="filtroDesde"
          mask="####-##-##"
          placeholder="AAAA-MM-DD"
          clearable
          dense
          outlined
          @update:model-value="filtrarFecha(recargar, $event)"
        />
      </div>
      <div class="col-6 col-md">
        <label class="q-mb-sm block">Hasta</label>
        <q-input
          v-model="filtroHasta"
          mask="####-##-##"
          placeholder="AAAA-MM-DD"
          clearable
          dense
          outlined
          @update:model-value="filtrarFecha(recargar, $event)"
        />
      </div>
    </template>

    <!-- Solicitud: flujo por pasos (asesor, sin enviar) o detalle y gestión -->
    <template #formulario>
      <div class="q-pt-md">
        <div v-if="solicitud" class="row justify-end q-mb-sm">
          <q-btn
            flat
            no-caps
            color="primary"
            icon="bi-plus-lg"
            label="Nueva solicitud"
            @click="nuevaSolicitud"
          />
        </div>
        <div v-if="!solicitud && !modoNuevo" class="vacio column items-center q-pa-xl">
          <q-icon name="bi-file-earmark-text" size="42px" class="text-grey-5 q-mb-sm" />
          <div class="text-grey-7 q-mb-md">
            Ingrese una nueva solicitud o consulte una desde el historial.
          </div>
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="bi-plus-lg"
            label="Nueva solicitud de crédito"
            @click="nuevaSolicitud"
          />
        </div>
        <flujo-solicitud
          v-else-if="!solicitud || solicitud.permisos.editar"
          :key="claveFlujo"
          :solicitud="solicitud"
          @actualizada="actualizada"
          @enviada="actualizada"
          @eliminada="eliminada"
        />
        <detalle-solicitud
          v-else
          :key="solicitud.id"
          :solicitud="solicitud"
          @actualizada="actualizada"
        />
      </div>
    </template>
  </tab-layout>
</template>

<script src="./SolicitudesCreditoPage.ts"></script>

<!-- Global (sin scoped): color del estado en la tabla del historial -->
<style lang="scss">
@use 'sass:map';

$colores-estado: (
  BORRADOR: #78909c,
  LISTO_PARA_ENVIAR: #8e24aa,
  ENVIADO: #1e88e5,
  INGRESADO: #00897b,
  EN_REVISION: #ef6c00,
  EN_APELACION: #f4511e,
  APROBADO: #2e7d32,
  NEGADO: #d32f2f,
  NO_PROCEDE: #6d4c41,
);

.estado-solicitud {
  font-weight: 700;
  @each $estado, $color in $colores-estado {
    &--#{$estado} {
      color: $color;
    }
  }
}
</style>

<style scoped>
.vacio {
  border: 1px dashed #cfd5dc;
  border-radius: 16px;
}
</style>
