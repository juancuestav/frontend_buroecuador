<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <q-card class="editar-dashboard-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Editar datos del dashboard</div>
        <q-space />
        <q-btn icon="bi-x-lg" flat round dense @click="cancelar" />
      </q-card-section>

      <q-card-section class="scroll editar-dashboard-body">
        <!-- Indicadores manuales -->
        <div class="text-subtitle2 text-bold q-mb-sm">
          Indicadores principales
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.totalClientesPool"
              :label="`Clientes ${borrador.periodo.mes}`"
            />
          </div>
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.perfilApto"
              label="Perfil apto"
            />
          </div>
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.clientesIngresados"
              label="Clientes ingresados"
            />
          </div>
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.clientesAprobados"
              label="Clientes aprobados"
            />
          </div>
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.montoAprobadoTotal"
              :decimales="2"
              label="Monto aprobado ($)"
            />
          </div>
          <div class="col-6 col-sm-4">
            <input-numero-formateado
              v-model="borrador.cedulasAsignadas"
              label="Cédulas asignadas (meta)"
              hint="Denominador de la dona 'Cédulas revisadas'"
            />
          </div>
        </div>

        <!-- Detalle de asesores -->
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2 text-bold">Detalle de asesores</div>
          <q-space />
          <q-btn
            icon="bi-plus-lg"
            label="Agregar asesor"
            color="primary"
            size="sm"
            no-caps
            outline
            @click="agregarAsesor"
          />
        </div>
        <div class="asesor-row asesor-row-header text-caption text-grey-8">
          <div>Nombre</div>
          <div>Revisadas</div>
          <div>Ingresadas</div>
          <div>Monto</div>
          <div></div>
        </div>
        <div
          v-for="asesor in borrador.asesores"
          :key="asesor.id"
          class="asesor-row q-mb-xs"
        >
          <q-input v-model="asesor.nombre" dense outlined placeholder="Nombre" />
          <input-numero-formateado v-model="asesor.cedulasRevisadas" />
          <input-numero-formateado v-model="asesor.cedulasIngresadas" />
          <input-numero-formateado v-model="asesor.montoAprobado" :decimales="2" />
          <q-btn
            icon="bi-trash3"
            flat
            round
            dense
            color="negative"
            @click="eliminarAsesor(asesor.id)"
          />
        </div>
        <div v-if="!borrador.asesores.length" class="text-caption text-grey-7">
          No hay asesores agregados.
        </div>
        <div class="text-caption text-grey-8 q-mt-sm">
          Suma de la tabla: {{ sumaBorradorRevisadas }} revisadas ·
          {{ sumaBorradorIngresadas }} ingresadas ·
          {{ formatearMonto(sumaBorradorMonto) }}
        </div>

        <q-separator class="q-my-md" />

        <!-- Novedades -->
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2 text-bold">Novedades</div>
          <q-space />
          <q-btn
            icon="bi-plus-lg"
            label="Agregar novedad"
            color="primary"
            size="sm"
            no-caps
            outline
            @click="agregarNovedad"
          />
        </div>
        <div
          v-for="(_, i) in borrador.novedades"
          :key="i"
          class="row q-col-gutter-sm items-center q-mb-xs"
        >
          <div class="col">
            <q-input v-model="borrador.novedades[i]" dense outlined />
          </div>
          <div class="col-auto">
            <q-btn
              icon="bi-trash3"
              flat
              round
              dense
              color="negative"
              @click="eliminarNovedad(i)"
            />
          </div>
        </div>
        <div v-if="!borrador.novedades.length" class="text-caption text-grey-7">
          No hay novedades agregadas.
        </div>

        <q-separator class="q-my-md" />

        <!-- Visibilidad de secciones -->
        <div class="text-subtitle2 text-bold q-mb-sm">
          Mostrar / ocultar secciones
        </div>
        <div class="row q-col-gutter-sm">
          <div
            v-for="opcion in opcionesVisibilidad"
            :key="opcion.clave"
            class="col-6 col-sm-4"
          >
            <q-checkbox
              v-model="borrador.visibilidad[opcion.clave]"
              :label="opcion.etiqueta"
              dense
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancelar" flat no-caps @click="cancelar" />
        <q-btn
          label="Guardar cambios"
          color="primary"
          unelevated
          no-caps
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, toRaw, watch } from 'vue'
import InputNumeroFormateado from 'pages/dashboard/clientes/components/InputNumeroFormateado.vue'
import {
  AsesorDashboardClientes,
  crearAsesorVacio,
  crearDatosEjemploDashboardClientes,
  DashboardClientesData,
  formatearMonto,
  VisibilidadSecciones,
} from 'pages/dashboard/clientes/domain/DashboardClientes'

const props = defineProps<{
  modelValue: boolean
  datos: DashboardClientesData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  guardar: [datos: DashboardClientesData]
}>()

const borrador = reactive<DashboardClientesData>(
  crearDatosEjemploDashboardClientes(),
)

watch(
  () => props.modelValue,
  (abierto) => {
    if (abierto) {
      Object.assign(borrador, structuredClone(toRaw(props.datos)))
    }
  },
  { immediate: true },
)

function sum(valores: number[]): number {
  return valores.reduce((acumulado, valor) => acumulado + (Number(valor) || 0), 0)
}

const sumaBorradorRevisadas = computed(() =>
  sum(borrador.asesores.map((a) => a.cedulasRevisadas)),
)
const sumaBorradorIngresadas = computed(() =>
  sum(borrador.asesores.map((a) => a.cedulasIngresadas)),
)
const sumaBorradorMonto = computed(() =>
  sum(borrador.asesores.map((a) => a.montoAprobado)),
)

function agregarAsesor() {
  const nuevo: AsesorDashboardClientes = crearAsesorVacio(
    borrador.asesores.map((a) => a.id),
  )
  borrador.asesores.push(nuevo)
}

function eliminarAsesor(id: number) {
  borrador.asesores = borrador.asesores.filter((a) => a.id !== id)
}

function agregarNovedad() {
  borrador.novedades.push('')
}

function eliminarNovedad(indice: number) {
  borrador.novedades.splice(indice, 1)
}

const opcionesVisibilidad: { clave: keyof VisibilidadSecciones; etiqueta: string }[] = [
  { clave: 'estadisticas', etiqueta: 'Tarjetas de estadísticas' },
  { clave: 'resumenDiario', etiqueta: 'Resumen diario' },
  { clave: 'indicadoresClave', etiqueta: 'Indicadores clave' },
  { clave: 'calendario', etiqueta: 'Calendario' },
  { clave: 'detalleAsesores', etiqueta: 'Detalle de asesores' },
  { clave: 'comparativoAsesores', etiqueta: 'Comparativo de asesores' },
  { clave: 'tendenciaMonto', etiqueta: 'Tendencia de monto aprobado' },
  { clave: 'asesorDestacado', etiqueta: 'Asesor destacado' },
  { clave: 'novedades', etiqueta: 'Novedades' },
]

function guardar() {
  emit('guardar', structuredClone(toRaw(borrador)))
  emit('update:modelValue', false)
}

function cancelar() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.editar-dashboard-card {
  width: 900px;
  max-width: 95vw;
}
.editar-dashboard-body {
  max-height: 65vh;
}
.asesor-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 8px;
  align-items: center;
}
.asesor-row-header {
  padding: 0 2px;
}
</style>
