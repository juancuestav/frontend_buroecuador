<template>
  <q-page class="ia-page" padding>
    <!-- Animación IA al enviar -->
    <q-dialog v-model="animacionIA" persistent>
      <q-card class="bg-grey-4 rounded-card no-border text-center q-pa-xl">
        <div class="ia-orb q-mx-auto q-mb-lg">
          <q-spinner-rings color="primary" size="80px" />
          <div class="ia-orb-inner">
            <q-icon name="bi-robot" color="primary" size="28px" />
          </div>
        </div>
        <div class="text-h6 text-primary q-mb-xs" style="letter-spacing: 2px">
          PROCESANDO
        </div>
        <div class="text-body2 text-blue-grey-14 q-mb-md">
          Generando reporte...
        </div>
        <q-linear-progress
          indeterminate
          color="positive"
          class="rounded-borders"
        />
        <div class="text-caption text-blue-grey-14 q-mt-sm">
          Por favor espere...
        </div>
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
import { ref, computed, watch, onMounted } from 'vue'
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
  animacionIA.value = true

  try {
    await ApiN8N.post('/generar-reporte', formData)
    animacionIA.value = false
    notificarCorrecto('El reporte se ha generado exitosamente.')

    // Buscar automáticamente el reporte recién generado
    criterioBuscarPor.value = 'identificacion'
    criterioBusqueda.value = identificacion.value.trim()

    informacionPersonal.value = null
    identificacion.value = ''

    buscarReportes()
  } catch (error: any) {
    console.error(error)
    animacionIA.value = false
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

/* Orb spinner IA */
.ia-orb {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ia-orb-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ia-pulse 2s ease-in-out infinite;
}
@keyframes ia-pulse {
  0%,
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.85);
  }
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
