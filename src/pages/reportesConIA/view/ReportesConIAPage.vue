<template>
  <q-page class="ia-page" padding>
    <!-- Animación IA al enviar -->
    <q-dialog
      v-model="animacionIA"
      persistent
      transition-show="scale"
      transition-hide="fade"
    >
      <q-card class="ia-loader-card glass-layer glass-layer--actions q-pa-lg">
        <!-- Orbe animado -->
        <div
          :class="['ia-loader-orb q-mx-auto', generacionCompleta && 'is-done']"
        >
          <div class="ia-loader-ring ia-loader-ring--1"></div>
          <div class="ia-loader-ring ia-loader-ring--2"></div>
          <div class="ia-loader-core">
            <transition name="fade-scale" mode="out-in">
              <q-icon
                v-if="generacionCompleta"
                key="ok"
                name="check"
                color="white"
                size="34px"
              />
              <q-icon
                v-else
                key="ia"
                name="bi-robot"
                color="white"
                size="30px"
              />
            </transition>
          </div>
        </div>

        <!-- Título y mensaje dinámico -->
        <div class="text-center q-mt-md">
          <div class="text-subtitle1 text-bold text-primary">
            {{
              generacionCompleta
                ? '¡Reporte listo!'
                : 'Generando reporte con IA'
            }}
          </div>
          <div class="ia-loader-message text-body2 text-blue-grey-8">
            <transition name="msg-slide" mode="out-in">
              <span :key="mensajeActual">{{ mensajeActual }}</span>
            </transition>
          </div>
        </div>

        <!-- Progreso -->
        <div class="q-mt-md">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-blue-grey-6">
              {{ Math.round(progresoIA) }}%
            </span>
            <span class="text-caption text-blue-grey-6">
              <q-icon name="schedule" size="14px" class="q-mr-xs" />
              {{ tiempoTranscurrido }}
            </span>
          </div>
          <q-linear-progress
            :value="progresoIA / 100"
            :color="generacionCompleta ? 'positive' : 'primary'"
            size="8px"
            rounded
            stripe
            animation-speed="400"
            class="ia-loader-progress"
          />
        </div>

        <!-- Pasos -->
        <q-list dense class="q-mt-md ia-loader-steps">
          <q-item
            v-for="(paso, index) in pasosIA"
            :key="paso.label"
            :class="[
              'ia-loader-step',
              index < pasoActual && 'is-done',
              index === pasoActual && 'is-active',
            ]"
          >
            <q-item-section avatar class="ia-loader-step__icon">
              <q-icon
                v-if="index < pasoActual"
                name="check_circle"
                color="positive"
                size="20px"
              />
              <q-spinner-dots
                v-else-if="index === pasoActual"
                color="primary"
                size="20px"
              />
              <q-icon v-else :name="paso.icon" color="blue-grey-4" size="20px" />
            </q-item-section>
            <q-item-section>{{ paso.label }}</q-item-section>
          </q-item>
        </q-list>

        <!-- Aviso de demora -->
        <transition name="fade-scale">
          <div
            v-if="demoraLarga && !generacionCompleta"
            class="ia-loader-hint row no-wrap items-center q-mt-md q-pa-sm"
          >
            <q-icon name="info" color="primary" size="18px" class="q-mr-sm" />
            <span class="text-caption text-blue-grey-8">
              Está tardando un poco más de lo habitual. Seguimos trabajando,
              no cierre ni recargue la página.
            </span>
          </div>
        </transition>
      </q-card>
    </q-dialog>

    <div class="row q-col-gutter-md">
      <!-- Panel formulario -->
      <div class="col-12 col-md-3 col-lg-3">
        <q-card class="ia-fordm-card glass-layer glass-layer--actions">
          <q-card-section class="q-pb-sm">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                color="primary"
                text-color="white"
                icon="bi-robot"
                size="36px"
              />
              <div>
                <div class="text-subtitle1 text-bold text-primary">
                  Reportes con IA
                </div>
                <div class="text-caption text-blue-grey-4">
                  Motor de inteligencia artificial
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-4" />

          <q-card-section class="glass-layer glass-layer--inputs">
            <q-form @submit.prevent="enviarReporte">
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <div class="q-mb-xs">Tipo de identificación</div>
                  <q-select
                    v-model="tipoIdentificacion"
                    :options="buscarPorOptionsIdentificacion"
                    option-value="value"
                    option-label="label"
                    map-options
                    emit-value
                    dense
                    outlined
                  />
                </div>

                <div class="col-12">
                  <div class="q-mb-xs">{{ identificacionLabel }}</div>
                  <q-input
                    v-model="identificacion"
                    :mask="
                      tipoIdentificacion === 'ruc'
                        ? '#############'
                        : '##########'
                    "
                    outlined
                    inputmode="numeric"
                    dense
                    clearable
                    clear-icon="close"
                  />
                </div>

                <div class="col-12">
                  <div class="q-mb-xs">Tipo de reporte</div>
                  <q-select
                    v-model="tipoReporte"
                    :options="tipoReporteOptions"
                    option-value="value"
                    option-label="label"
                    dense
                    outlined
                    emit-value
                    map-options
                  />
                </div>

                <div v-if="tipoIdentificacion === 'cedula'" class="col-12">
                  <div class="q-mb-xs row items-center">
                    <span>Información personal</span>
                    <q-badge
                      color="blue-grey-7"
                      label="opcional"
                      class="q-ml-xs"
                    />
                    <q-badge
                      v-if="infoPersonalLista"
                      color="positive"
                      class="q-ml-xs file-ready-badge"
                    >
                      <q-icon name="check_circle" size="12px" class="q-mr-xs" />
                      Listo
                    </q-badge>
                  </div>
                  <div
                    :class="[
                      'file-field-wrapper',
                      cargandoInfoPersonal && 'file-field--loading',
                      infoPersonalLista && 'file-field--ready',
                    ]"
                  >
                    <q-file
                      v-model="informacionPersonal"
                      accept=".pdf"
                      label="Seleccionar PDF"
                      outlined
                      dense
                      counter
                      hide-upload
                      :disable="cargandoInfoPersonal"
                    >
                      <template #prepend>
                        <q-icon
                          name="picture_as_pdf"
                          :color="
                            infoPersonalLista ? 'positive' : 'blue-grey-4'
                          "
                        />
                      </template>
                      <template #append>
                        <transition name="fade-scale">
                          <q-spinner-dots
                            v-if="cargandoInfoPersonal"
                            color="blue-grey"
                            size="18px"
                          />
                          <div
                            v-else-if="infoPersonalLista"
                            class="row items-center no-wrap q-gutter-xs"
                          >
                            <q-icon
                              name="check_circle"
                              color="positive"
                              size="20px"
                              class="file-check-icon"
                            />
                            <q-btn
                              flat
                              round
                              dense
                              icon="close"
                              color="negative"
                              size="xs"
                              class="file-remove-btn"
                              @click.stop="limpiarInfoPersonal"
                            >
                              <q-tooltip>Quitar archivo</q-tooltip>
                            </q-btn>
                          </div>
                        </transition>
                      </template>
                    </q-file>
                  </div>
                </div>

                <div class="col-12 q-mt-md">
                  <q-btn
                    type="submit"
                    class="full-width"
                    color="primary"
                    no-caps
                    unelevated
                    :disable="cargandoEnvio"
                  >
                    <q-icon name="bi-robot" class="q-mr-sm" />
                    Generar Reporte con IA
                  </q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Panel resultados -->
      <div class="col-12 col-md-9 col-lg-9">
        <q-card class="glass-layer glass-layer--actions">
          <q-card-section class="q-pb-sm">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                color="positive"
                text-color="white"
                icon="manage_search"
                size="36px"
              />
              <div>
                <div class="text-subtitle1 text-bold text-positive">
                  Reportes generados
                </div>
                <div class="text-caption text-blue-grey-4">
                  Busca por identificación o nombre
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-4" />

          <q-card-section class="glass-layer glass-layer--inputs">
            <div class="row q-col-gutter-sm items-end">
              <div class="col-12 col-md-3">
                <div class="q-mb-xs">Buscar por</div>
                <q-select
                  v-model="criterioBuscarPor"
                  :options="buscarPorOptions"
                  option-value="value"
                  option-label="label"
                  dense
                  outlined
                  color="green"
                  map-options
                  emit-value
                  popup-content-class="ia-dropdown"
                />
              </div>

              <div class="col-12 col-md-9">
                <div class="q-mb-xs">Texto de búsqueda</div>
                <q-input
                  v-model="criterioBusqueda"
                  outlined
                  dense
                  color="green"
                  clearable
                  :placeholder="
                    criterioBuscarPor === 'identificacion'
                      ? 'Ej. 1790012345001'
                      : 'Ej. Nombre o empresa'
                  "
                  @keyup.enter="buscarReportes"
                >
                  <template #after>
                    <q-btn
                      label="Buscar"
                      color="green"
                      icon="search"
                      unelevated
                      no-caps
                      :loading="cargandoBusqueda"
                      @click="buscarReportes"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-4" />

          <q-card-section>
            <q-table
              v-if="reportesGenerados.length"
              :rows="reportesGenerados"
              :columns="columnasReporte"
              row-key="id"
              dense
              :loading="cargandoBusqueda"
              :rows-per-page-options="[0]"
              :pagination="{ rowsPerPage: 0 }"
              hide-bottom
              class="ia-table"
            >
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="q-gutter-xs">
                  <q-btn
                    icon="visibility"
                    color="cyan"
                    size="sm"
                    label="PDF"
                    outline
                    dense
                    no-caps
                    class="q-px-sm"
                    @click="abrirVisorPdf(props.row.id)"
                  >
                    <q-tooltip>Ver PDF</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="bi-whatsapp"
                    color="green"
                    size="sm"
                    label="WA"
                    outline
                    dense
                    no-caps
                    class="q-px-sm"
                    @click="enviarWebhookN8n(props.row)"
                  >
                    <q-tooltip>Enviar al WhatsApp del cliente</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>

            <div
              v-else-if="!cargandoBusqueda"
              class="ia-empty-state text-center q-py-xl"
            >
              <q-icon name="search_off" size="48px" color="blue-grey-6" />
              <div class="text-body2 text-blue-grey-5 q-mt-sm">
                Sin resultados. Usa el buscador para encontrar reportes
                generados.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Visor PDF -->
    <q-dialog
      v-model="mostrarVisorPdf"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="column bg-grey-10">
        <q-bar class="bg-grey-9 text-white">
          <q-icon name="picture_as_pdf" color="red-4" class="q-mr-sm" />
          <div class="text-subtitle2">Visor de Reporte</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey-8 text-white">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="col q-pa-none">
          <iframe
            v-if="urlPdfActual"
            :src="urlPdfActual"
            class="full-width full-height"
            style="border: none"
          ></iframe>
          <div v-else class="flex flex-center full-height">
            <q-spinner-rings color="cyan" size="4em" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ApiN8N } from '../api/ApiN8N'
import { useNotificaciones } from 'shared/notificaciones'

interface ReporteGenerado {
  id: number
  nombre: string
  identificacion: string
  tipoReporte: string
  fecha: string
  ruta_archivo: string // Agregado para almacenar la ruta
  telefono_cliente: string
}

const $q = useQuasar()
const route = useRoute()
const { notificarCorrecto, notificarError, notificarAdvertencia } =
  useNotificaciones()

// Estados del Formulario
const tipoIdentificacion = ref<'cedula' | 'ruc'>('cedula')
const identificacion = ref('')
const tipoReporte = ref('normal')
const ws = ref('')
const compraId = ref('')
const informacionPersonal = ref<File | null>(null)
const cargandoEnvio = ref(false)
const animacionIA = ref(false)

// Estados de la animación de generación
const pasosIA = [
  { label: 'Validando datos', icon: 'fact_check' },
  { label: 'Consultando información crediticia', icon: 'travel_explore' },
  { label: 'Analizando historial con IA', icon: 'psychology' },
  { label: 'Calculando indicadores de riesgo', icon: 'insights' },
  { label: 'Redactando y generando el PDF', icon: 'picture_as_pdf' },
]

// Mensajes que rotan por paso para que se vea actividad continua
const mensajesPorPaso = [
  ['Verificando la identificación...', 'Preparando la solicitud...'],
  [
    'Buscando registros del cliente...',
    'Revisando operaciones vigentes y vencidas...',
    'Recopilando datos de las entidades...',
  ],
  [
    'La IA está leyendo el historial de pagos...',
    'Detectando patrones de comportamiento...',
    'Comparando con perfiles similares...',
  ],
  [
    'Calculando el score crediticio...',
    'Evaluando nivel de endeudamiento...',
    'Ponderando alertas y riesgos...',
  ],
  [
    'Redactando conclusiones y recomendaciones...',
    'Dando formato al documento...',
    'Últimos retoques al PDF...',
  ],
]

const DURACION_PASO_MS = 9000
const ROTACION_MENSAJE_MS = 3200

const pasoActual = ref(0)
const indiceMensaje = ref(0)
const progresoIA = ref(0)
const segundosTranscurridos = ref(0)
const generacionCompleta = ref(false)
let temporizadoresIA: ReturnType<typeof setInterval>[] = []

const mensajeActual = computed(() => {
  if (generacionCompleta.value) return 'Mostrando el reporte generado...'
  const mensajes = mensajesPorPaso[pasoActual.value]
  return mensajes[indiceMensaje.value % mensajes.length]
})

const tiempoTranscurrido = computed(() => {
  const min = Math.floor(segundosTranscurridos.value / 60)
  const seg = segundosTranscurridos.value % 60
  return `${min}:${seg.toString().padStart(2, '0')}`
})

const demoraLarga = computed(() => segundosTranscurridos.value >= 60)

// Estados de carga de archivos
const cargandoInfoPersonal = ref(false)
const infoPersonalLista = ref(false)

// Estados de Búsqueda
const criterioBuscarPor = ref<'identificacion' | 'nombre'>('identificacion')
const criterioBusqueda = ref('')
const cargandoBusqueda = ref(false)
const reportesGenerados = ref<ReporteGenerado[]>([])

// Estados del Visor PDF
const mostrarVisorPdf = ref(false)
const urlPdfActual = ref<string | null>(null)

// Opciones
const buscarPorOptions = [
  { label: 'Identificación', value: 'identificacion' },
  { label: 'Nombre / Empresa', value: 'nombre' },
]

const buscarPorOptionsIdentificacion = [
  { label: 'Cédula', value: 'cedula' },
  { label: 'RUC', value: 'ruc' },
]

const tipoReporteOptions = computed(() => {
  if (tipoIdentificacion.value === 'ruc') {
    return [{ label: 'Empresa', value: 'empresa' }]
  }
  return [
    { label: 'Normal', value: 'normal' },
    { label: 'Gold', value: 'gold' },
    { label: 'Premium', value: 'premium' },
  ]
})

const identificacionLabel = computed(() =>
  tipoIdentificacion.value === 'ruc'
    ? 'Ingrese RUC de la empresa'
    : 'Ingrese cédula de la persona'
)

// Configuración de Tabla
const columnasReporte: Array<{
  name: string
  label: string
  field: string | ((row: any) => any)
  align: 'left' | 'center' | 'right'
}> = [
  { name: 'nombre', label: 'Nombre / Empresa', field: 'nombre', align: 'left' },
  {
    name: 'identificacion',
    label: 'Identificación',
    field: 'identificacion',
    align: 'left',
  },
  { name: 'tipoReporte', label: 'Tipo', field: 'tipoReporte', align: 'left' },
  { name: 'fecha', label: 'Fecha generado', field: 'fecha', align: 'left' },
  {
    name: 'enviado_wa',
    label: 'Enviado por WhatsApp',
    field: 'enviado_wa',
    align: 'left',
  },
  {
    name: 'telefono_cliente',
    label: 'Reporte enviado a',
    field: 'telefono_cliente',
    align: 'left',
  },
  {
    name: 'fecha_envio_wa',
    label: 'Fecha envío WA',
    field: 'fecha_envio_wa',
    align: 'left',
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }, // Movido al centro por estética
]

// Observadores
watch(tipoIdentificacion, (value) => {
  if (value === 'ruc') {
    tipoReporte.value = 'empresa'
  } else if (tipoReporte.value === 'empresa') {
    tipoReporte.value = 'normal'
  }
})

watch(informacionPersonal, (nuevo) => {
  if (nuevo) {
    infoPersonalLista.value = false
    cargandoInfoPersonal.value = true
    setTimeout(() => {
      cargandoInfoPersonal.value = false
      infoPersonalLista.value = true
    }, 800)
  } else {
    cargandoInfoPersonal.value = false
    infoPersonalLista.value = false
  }
})

onMounted(() => {
  const {
    identificacion: identificacionQuery,
    tipo: tipoQuery,
    ws: wsQuery,
    compra_id: compraIdQuery,
  } = route.query

  let esRuc = typeof tipoQuery === 'string' && tipoQuery.trim() === 'empresa'

  if (typeof identificacionQuery === 'string' && identificacionQuery.trim()) {
    let identificacionValor = identificacionQuery.trim()

    if (identificacionValor.length === 13) {
      esRuc = true
    } else if (esRuc && identificacionValor.length === 10) {
      identificacionValor += '001'
    }

    tipoIdentificacion.value = esRuc ? 'ruc' : 'cedula'
    identificacion.value = identificacionValor
  }

  if (esRuc) {
    tipoReporte.value = 'empresa'
  } else if (typeof tipoQuery === 'string' && tipoQuery.trim()) {
    tipoReporte.value = tipoQuery.trim()
  }

  if (typeof wsQuery === 'string') {
    ws.value = wsQuery
  }

  if (typeof compraIdQuery === 'string') {
    compraId.value = compraIdQuery
  }
})

// --- MÉTODOS ---

function detenerAnimacionIA() {
  temporizadoresIA.forEach(clearInterval)
  temporizadoresIA = []
}

function iniciarAnimacionIA() {
  detenerAnimacionIA()
  pasoActual.value = 0
  indiceMensaje.value = 0
  progresoIA.value = 0
  segundosTranscurridos.value = 0
  generacionCompleta.value = false
  animacionIA.value = true

  temporizadoresIA.push(
    setInterval(() => segundosTranscurridos.value++, 1000),
    setInterval(() => indiceMensaje.value++, ROTACION_MENSAJE_MS),
    setInterval(() => {
      // El último paso se queda activo hasta que responda el servidor
      if (pasoActual.value < pasosIA.length - 1) {
        pasoActual.value++
        indiceMensaje.value = 0
      }
    }, DURACION_PASO_MS),
    // Avance asintótico: se acerca a 95% sin llegar nunca a completarse
    setInterval(() => {
      progresoIA.value += (95 - progresoIA.value) * 0.03
    }, 400)
  )
}

async function finalizarAnimacionIA(exito: boolean) {
  detenerAnimacionIA()
  if (exito) {
    pasoActual.value = pasosIA.length
    progresoIA.value = 100
    generacionCompleta.value = true
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }
  animacionIA.value = false
}

onBeforeUnmount(detenerAnimacionIA)

function limpiarInfoPersonal() {
  informacionPersonal.value = null
  // Los watchers se encargan de resetear cargandoInfoPersonal e infoPersonalLista
}

function validarFormulario() {
  if (!identificacion.value.trim()) {
    notificarAdvertencia(`Falta llenar: ${identificacionLabel.value}.`)
    return false
  }
  if (!tipoReporte.value) {
    notificarAdvertencia('Debe seleccionar el tipo de reporte.')
    return false
  }
  return true
}

async function enviarReporte() {
  if (!validarFormulario()) return

  const formData = new FormData()
  if (informacionPersonal.value) {
    formData.append(
      'informacionPersonal',
      informacionPersonal.value,
      informacionPersonal.value.name
    )
  }

  formData.append('tipoReporte', tipoReporte.value)
  formData.append('identificacion', identificacion.value.trim())
  formData.append('ws', ws.value)

  if (compraId.value) {
    formData.append('compra_id', compraId.value)
  }

  cargandoEnvio.value = true
  iniciarAnimacionIA()

  try {
    await ApiN8N.post('/generar-reporte', formData)
    await finalizarAnimacionIA(true)
    notificarCorrecto('El reporte se ha generado exitosamente.')

    // Buscar automáticamente el reporte recién generado
    criterioBuscarPor.value = 'identificacion'
    criterioBusqueda.value = identificacion.value.trim()

    informacionPersonal.value = null
    identificacion.value = ''

    buscarReportes()
  } catch (error: any) {
    console.error(error)
    await finalizarAnimacionIA(false)
    notificarError('Error al enviar el reporte a n8n.')
  } finally {
    cargandoEnvio.value = false
  }
}

async function buscarReportes() {
  const termino = criterioBusqueda.value.trim()

  if (!termino) {
    notificarAdvertencia('Ingrese un valor para buscar reportes existentes.')
    return
  }

  cargandoBusqueda.value = true
  reportesGenerados.value = []

  try {
    const response = await ApiN8N.get('/reportes/buscar', {
      params: { q: termino },
    })

    // Mapeo seguro asegurando que tomamos la ruta del archivo del JSON
    reportesGenerados.value = (response.data.resultados || []).map(
      (item: any) => ({
        id: item.id,
        nombre: item.nombre_cliente || '',
        identificacion: item.identificacion,
        fecha_generado: item.fecha_generado,
        tipoReporte: item.tipo_reporte?.toUpperCase() || '',
        enviado_wa: item.enviado_wa ? 'Sí' : 'No',
        telefono_cliente: item.telefono_cliente || '',
        fecha_envio_wa: item.fecha_envio_wa
          ? new Date(item.fecha_envio_wa).toLocaleDateString()
          : 'No enviado',
        fecha: item.fecha_generado
          ? new Date(item.fecha_generado).toLocaleDateString()
          : '',
        ruta_archivo: item.ruta_archivo || '', // Asignación de la ruta para el PDF
      })
    )

    notificarCorrecto(
      `Búsqueda completada: ${reportesGenerados.value.length} resultados encontrados.`
    )
  } catch (error: any) {
    console.error(error)
    notificarError('Error al consultar los reportes en n8n.')
  } finally {
    cargandoBusqueda.value = false
  }
}

// Lógica para Abrir PDF
async function abrirVisorPdf(id: number) {
  try {
    $q.loading.show({ message: 'Obteniendo documento...' })

    // Llamada al webhook que acabas de configurar
    const response = await ApiN8N.get('/ver-reporte', {
      params: { id },
      responseType: 'blob', // Indispensable para manejar binarios
    })

    // Crear una URL local para el objeto Blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    if ($q.platform.is.mobile) {
      // En móviles, forzamos la descarga o apertura en nueva pestaña
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.download = `Reporte_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } else {
      // Asignar al ref que usa tu iframe en el q-dialog
      urlPdfActual.value = url
      mostrarVisorPdf.value = true
    }
  } catch (error) {
    console.error('Error al cargar PDF:', error)
    notificarError('No se pudo recuperar el archivo del servidor.')
  } finally {
    $q.loading.hide()
  }
}

async function enviarWebhookN8n(fila: ReporteGenerado) {
  let telefonoCliente: string | null = null

  telefonoCliente = await new Promise<string | null>((resolve) => {
    $q.dialog({
      html: true,
      title: 'Teléfono requerido',
      message:
        'Por favor ingresa el número para enviar el mensaje de WhatsApp con el reporte solicitado.',
      prompt: {
        model: '',
        type: 'text',
        mask: '###########',
        inputmode: 'numeric',
        label: 'Teléfono cliente',
        placeholder: 'Ej: 0999999999',
        isValid: (val: string) => !!val && val.trim().length > 0,
      },
      cancel: true,
      persistent: true,
    })
      .onOk((value: string) => resolve(value))
      .onCancel(() => resolve(null))
  })

  telefonoCliente = telefonoCliente ? telefonoCliente.trim() : null

  if (!telefonoCliente || telefonoCliente.length < 10) {
    notificarAdvertencia('Envío cancelado. Debes ingresar un teléfono válido.')
    return
  }

  try {
    $q.loading.show({ message: 'Enviando petición a n8n...' })

    await ApiN8N.post('/reportes/enviar-wa', {
      id: fila.id,
      telefono_cliente: telefonoCliente,
    })

    notificarCorrecto(`Reporte de ${fila.nombre} enviado con éxito desde n8n.`)
  } catch (error: any) {
    console.error(error)
    notificarError('Hubo un problema al solicitar el envío desde n8n.')
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
/* === Cards futuristas === */
.ia-form-card,
.ia-results-card {
  background-color: #f5f5fa;

  border-color: #ddd !important;
  border-radius: 12px;
}

/* === Tabla === */
.ia-table {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
}
.ia-table .q-table__top,
.ia-table thead tr th {
  background: #0d2137;
  color: #90caf9;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.ia-table tbody tr:hover td {
  background: rgba(0, 188, 212, 0.06);
}

/* === Empty state === */
.ia-empty-state {
  opacity: 0.7;
}

/* === Loader generación IA === */
.ia-loader-card {
  width: 420px;
  max-width: 92vw;
  border-radius: 20px;
}

.ia-loader-orb {
  position: relative;
  width: 96px;
  height: 96px;
}
.ia-loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
}
.ia-loader-ring--1 {
  border-top-color: var(--q-primary);
  border-right-color: var(--q-primary);
  animation: ia-spin 1.4s linear infinite;
}
.ia-loader-ring--2 {
  inset: 10px;
  border-bottom-color: var(--q-positive);
  border-left-color: var(--q-positive);
  animation: ia-spin 2s linear infinite reverse;
}
.ia-loader-core {
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--q-primary), #0e74c7);
  box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.5);
  animation: ia-core-pulse 1.8s ease-out infinite;
  transition: background 0.4s ease;
}
.ia-loader-orb.is-done .ia-loader-ring {
  animation: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ia-loader-orb.is-done .ia-loader-core {
  background: var(--q-positive);
  animation: ia-core-done 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes ia-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ia-core-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.45);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
}
@keyframes ia-core-done {
  0% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
}

.ia-loader-message {
  min-height: 24px;
  margin-top: 4px;
}

.ia-loader-progress {
  transition: all 0.4s ease;
}

.ia-loader-step {
  border-radius: 8px;
  min-height: 34px;
  color: #90a4ae;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.ia-loader-step__icon {
  min-width: 32px;
}
.ia-loader-step.is-active {
  color: var(--q-primary);
  font-weight: 600;
  background: rgba(25, 118, 210, 0.08);
}
.ia-loader-step.is-done {
  color: #455a64;
}

.ia-loader-hint {
  border-radius: 10px;
  background: rgba(25, 118, 210, 0.08);
}

/* Transición de mensajes dinámicos */
.msg-slide-enter-active,
.msg-slide-leave-active {
  transition: all 0.3s ease;
}
.msg-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.msg-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* === Animación campos de archivo === */
.file-field-wrapper {
  position: relative;
  border-radius: 8px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

/* Estado: cargando archivo */
.file-field--loading {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.4);
  animation: file-loading-pulse 1s ease-in-out infinite;
}

@keyframes file-loading-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.25);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.55);
  }
}

/* Estado: archivo listo */
.file-field--ready {
  box-shadow: 0 0 0 2px rgba(33, 150, 83, 0.45);
  animation: file-ready-glow 0.4s ease-out forwards;
}

@keyframes file-ready-glow {
  0% {
    box-shadow: 0 0 0 4px rgba(33, 150, 83, 0.7);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(33, 150, 83, 0.45);
  }
}

/* Icono de check animado */
.file-check-icon {
  animation: check-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes check-pop {
  0% {
    transform: scale(0) rotate(-20deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Badge listo */
.file-ready-badge {
  animation: badge-slide-in 0.3s ease-out forwards;
}

@keyframes badge-slide-in {
  0% {
    opacity: 0;
    transform: translateX(-6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Transición fade-scale para spinner/check */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* Botón de eliminar archivo */
.file-remove-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.file-remove-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}
</style>
