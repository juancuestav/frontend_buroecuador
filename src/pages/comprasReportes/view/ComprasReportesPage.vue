<template>
  <multiple-page-layout :mixin="mixin">
    <template #tab1>
      <q-page padding>
        <div class="text-h5 text-bold q-mb-md">
          Panel de Compras de Reportes
        </div>

        <!-- Resumen -->
        <div
          class="row q-col-gutter-sm glass-layer glass-layer--actions q-pa-sm q-mb-md"
        >
          <div class="col-6 col-md-3">
            <div
              class="text-center glass-layer glass-layer--inputs q-pa-md full-height"
            >
              <div>Total del período</div>
              <div class="text-h4 text-bold">{{ resumen.total }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div
              class="text-center glass-layer glass-layer--inputs q-pa-md full-height text-positive"
            >
              <div>Completadas</div>
              <div class="text-h4 text-bold">{{ resumen.completadas }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div
              class="text-center glass-layer glass-layer--inputs q-pa-md full-height text-warning"
            >
              <div>En proceso</div>
              <div class="text-h4 text-bold">{{ resumen.en_proceso }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div
              class="text-center glass-layer glass-layer--inputs q-pa-md full-height text-negative"
            >
              <div>Posible falla</div>
              <div class="text-h4 text-bold">
                {{ resumen.con_posible_falla }}
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="row q-col-gutter-sm q-mb-md items-end">
          <div class="col-6 col-md-2">
            <label class="q-mb-sm block">Desde</label>
            <q-input
              v-model="filtros.fecha_desde"
              type="date"
              outlined
              dense
              @update:model-value="aplicarFiltros"
            />
          </div>
          <div class="col-6 col-md-2">
            <label class="q-mb-sm block">Hasta</label>
            <q-input
              v-model="filtros.fecha_hasta"
              type="date"
              outlined
              dense
              @update:model-value="aplicarFiltros"
            />
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="filtros.estado"
              :options="estadoOptions"
              option-value="value"
              option-label="label"
              multiple
              emit-value
              map-options
              outlined
              dense
              @update:model-value="aplicarFiltros"
            />
          </div>
          <div class="col-6 col-md-2">
            <label class="q-mb-sm block">Tipo de reporte</label>
            <q-select
              v-model="filtros.tipo_reporte"
              :options="tipoReporteOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              clearable
              outlined
              dense
              @update:model-value="aplicarFiltros"
            />
          </div>
          <div class="col-6 col-md-2">
            <label class="q-mb-sm block">Identificación</label>
            <q-select
              v-model="filtros.tipo_identificacion"
              :options="tipoIdentificacionOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              clearable
              outlined
              dense
              @update:model-value="aplicarFiltros"
            />
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Buscar cliente o identificación</label>
            <q-input
              v-model="busqueda"
              outlined
              dense
              clearable
              @update:model-value="onInputChange"
            >
              <template #prepend><q-icon name="bi-search" /></template>
            </q-input>
          </div>
        </div>

        <!-- Tabla: mismo patrón que el resto del panel administrativo -->
        <essential-table-pagination
          :mixin="mixin"
          :datos="listado"
          :configuracion-columnas="(configuracionColumnasCompras as any)"
          :permitir-consultar="true"
          :permitir-editar="false"
          :permitir-eliminar="false"
          :permitir-buscar="false"
          :alto-fijo="false"
          :mostrar-header="false"
          @consultar="onConsultar"
        ></essential-table-pagination>
      </q-page>
    </template>

    <template #tab2>
      <ver-compra-reporte
        ref="refVerCompra"
        :mixin="mixin"
      ></ver-compra-reporte>
    </template>
  </multiple-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { date } from 'quasar'
import MultiplePageLayout from 'src/shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import VerCompraReporte from './VerCompraReporte.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CompraReporte } from '../domain/CompraReporte'
import { CompraReporteController } from '../infraestructure/CompraReporteController'
import { configuracionColumnasCompras } from '../domain/configuracionColumnasCompras'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

const mixin = new ContenedorSimpleMixin(
  CompraReporte,
  new CompraReporteController()
)
const { listado, tabsPage, pagination, filtros: filtrosMixin } =
  mixin.useReferencias()
const { listar } = mixin.useComportamiento()

const axios = AxiosHttpRepository.getInstance()
const refVerCompra = ref()
const cargando = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

const filtros = reactive<{ [key: string]: any }>({
  fecha_desde: null,
  fecha_hasta: null,
  estado: [],
  tipo_reporte: null,
  tipo_identificacion: null,
})
const busqueda = ref('')
const resumen = reactive({
  total: 0,
  completadas: 0,
  en_proceso: 0,
  con_posible_falla: 0,
})

const estadoOptions = [
  { label: 'Pago recibido', value: 'pago_recibido' },
  { label: 'Reporte generado', value: 'reporte_generado' },
  { label: 'Reporte entregado', value: 'reporte_entregado' },
  { label: 'Error', value: 'error' },
]
const tipoReporteOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Gold', value: 'gold' },
  { label: 'Premium', value: 'premium' },
  { label: 'Empresa', value: 'empresa' },
]
const tipoIdentificacionOptions = [
  { label: 'Cédula', value: 'cedula' },
  { label: 'RUC', value: 'ruc' },
]

// Filtros activos, sin las claves de paginación (se usan tanto para el
// listado como para el resumen, y se sincronizan hacia `mixin.filtros.fields`
// para que la paginación interna de EssentialTablePagination —que arma sus
// propias peticiones a partir de ese campo— los incluya también).
function filtrosActivos() {
  const params: { [key: string]: any } = {}
  if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde
  if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta
  if (filtros.estado?.length) params.estado = filtros.estado.join(',')
  if (filtros.tipo_reporte) params.tipo_reporte = filtros.tipo_reporte
  if (filtros.tipo_identificacion)
    params.tipo_identificacion = filtros.tipo_identificacion
  if (busqueda.value) params.q = busqueda.value
  return params
}

function construirParams() {
  return {
    ...filtrosActivos(),
    paginate: true,
    page: pagination.value.page,
  }
}

// Calcula los campos de presentación que EssentialTablePagination renderiza
// directamente (su celda por defecto lee `row[col.name]` sin soportar
// columnas con formato vía función).
function aplicarFormatoFilas() {
  listado.value.forEach((fila: any) => {
    fila.estado_label = etiquetaEstado(fila.estado)
    fila.fecha_recibido_fmt = formatearFecha(fila.fecha_recibido)
    fila.fecha_entregado_fmt = formatearFecha(fila.fecha_entregado)
    fila.tiempo_transcurrido_fmt = tiempoTranscurrido(fila.fecha_recibido)
  })
}

async function cargarListado() {
  cargando.value = true
  filtrosMixin.fields = filtrosActivos()
  await listar(construirParams())
  aplicarFormatoFilas()
  await cargarResumen()
  cargando.value = false
}

// Cambios de filtro: siempre vuelven a la página 1.
async function aplicarFiltros() {
  pagination.value.page = 1
  await cargarListado()
}

async function cargarResumen() {
  const params = filtrosActivos()

  const ruta = axios.getEndpoint(endpoints.compras) + '/resumen'
  const { data }: any = await axios.get(ruta, { params })
  Object.assign(resumen, data)
}

function onInputChange() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => aplicarFiltros(), 500)
}

function irADetalle(compraId: string) {
  tabsPage.value = '2'
  nextTick(() => refVerCompra.value.consultar({ id: compraId } as any))
}

function onConsultar(data: { entidad: CompraReporte }) {
  irADetalle((data.entidad as any).id)
}

function etiquetaEstado(estado: string) {
  return (
    {
      pago_recibido: 'Pago recibido',
      reporte_generado: 'Generado',
      reporte_entregado: 'Entregado',
      error: 'Error',
    }[estado] ?? estado
  )
}
function tiempoTranscurrido(fechaRecibido: string | null) {
  if (!fechaRecibido) return '—'
  const diffHoras = date.getDateDiff(
    new Date(),
    new Date(fechaRecibido),
    'hours'
  )
  if (diffHoras < 24) return `${diffHoras} h`
  return `${Math.floor(diffHoras / 24)} d`
}

function formatearFecha(fecha: string | null) {
  if (!fecha) return '—'
  return date.formatDate(fecha, 'DD/MM/YYYY HH:mm')
}

onMounted(() => aplicarFiltros())
</script>

<style>
/* Sin scope a propósito: Quasar aplica esta clase por celda (no existe una
   clase a nivel de fila en QTable), y las celdas se renderizan dentro del
   <q-table> interno de EssentialTablePagination — otro componente, fuera
   del árbol al que :deep() de este SFC llegaría de forma fiable. Se aplica
   a todas las columnas (ver configuracionColumnasCompras.ts) para que la
   fila completa se vea resaltada. */
.compras-reportes-fila-error {
  background: rgba(244, 67, 54, 0.12) !important;
}
</style>
