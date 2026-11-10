<template>
  <seccion-revision
    label="Reporte PDF"
    ayuda="Se genera con la información de Equifax de esta revisión."
  >
    <q-form @submit.prevent="generar">
      <div class="row q-col-gutter-md items-start">
        <div class="col-12 col-sm-6 col-md-3">
          <label class="q-mb-sm block">Tipo de reporte</label>
          <q-select
            v-model="tipo"
            :options="OPCIONES_TIPO"
            :disable="generando"
            emit-value
            map-options
            outlined
            dense
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <label class="q-mb-sm block">Categoría</label>
          <!-- Fija: los reportes de esta pantalla siempre son de revisión de crédito -->
          <q-select
            :model-value="CATEGORIA"
            :options="OPCIONES_CATEGORIA"
            emit-value
            map-options
            disable
            outlined
            dense
          />
        </div>

        <div v-if="mostrarCampoCodigo" class="col-12 col-sm-6 col-md-3">
          <label class="q-mb-sm block">Código de verificación</label>
          <q-input
            v-model="codigo"
            type="password"
            placeholder="Obligatorio"
            autocomplete="new-password"
            :disable="generando"
            :error="!!errorCodigo"
            :error-message="errorCodigo ?? ''"
            outlined
            dense
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-btn
            type="submit"
            color="primary"
            icon="bi-file-earmark-pdf"
            label="Generar reporte"
            class="full-width"
            :loading="generando"
            no-caps
            unelevated
          />
        </div>
      </div>
    </q-form>

    <!-- Generación en curso -->
    <div v-if="generando" class="generando q-mt-md">
      <div class="row items-center no-wrap q-mb-sm">
        <q-spinner-dots color="primary" size="22px" class="q-mr-sm" />
        <div class="col">
          Generando el reporte {{ nombreTipo(tipoEnCurso) }}… puede tardar unos
          minutos. No cierre la página.
        </div>
        <div class="text-caption text-grey-7">{{ tiempoTranscurrido }}</div>
      </div>
      <q-linear-progress indeterminate rounded color="primary" size="6px" />
    </div>

    <!-- PDFs vigentes -->
    <div v-if="disponibles.length" class="q-mt-lg">
      <div class="text-bold q-mb-sm">PDFs disponibles</div>
      <div
        v-for="r in disponibles"
        :key="r.reporte_id"
        class="reporte-disponible row items-center no-wrap"
      >
        <span class="chip-moderno chip-moderno--azul q-mr-md">
          <q-icon name="bi-file-earmark-pdf" size="14px" />
          {{ nombreTipo(r.tipo_reporte) }}
        </span>
        <div class="col text-caption text-grey-8">
          Generado el {{ r.generado_at }} · disponible hasta el
          {{ formatearFecha(r.vence_at) }}
        </div>
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          icon="bi-eye"
          label="Ver PDF"
          @click="verPdf(r.reporte_id)"
        />
      </div>
    </div>

    <!-- Visor -->
    <q-dialog
      v-model="mostrarVisor"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      @hide="liberarPdf"
    >
      <q-card class="column bg-grey-10">
        <q-bar class="bg-grey-9 text-white">
          <q-icon name="picture_as_pdf" color="red-4" class="q-mr-sm" />
          <div class="text-subtitle2">Visor de Reporte</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-dark">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="col q-pa-none">
          <iframe
            v-if="urlPdf"
            :src="urlPdf"
            class="full-width full-height"
            style="border: none"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </seccion-revision>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { endpoints } from 'config/api'
import {
  EstadoGeneracionReporte,
  ReporteDisponible,
  TipoReporte,
} from '../../domain/RevisionCredito'
import { formatearFecha, obtenerMensajeError } from '../../domain/formato'
import SeccionRevision from './SeccionRevision.vue'

const props = defineProps<{ revisionId: number }>()

const OPCIONES_TIPO: { label: string; value: TipoReporte }[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Gold', value: 'gold' },
  { label: 'Premium', value: 'premium' },
  { label: 'Empresa', value: 'empresa' },
]
// Los reportes de esta pantalla siempre son de revisión de crédito
const CATEGORIA = 'revision_credito'
const OPCIONES_CATEGORIA = [{ label: 'Revisión de crédito', value: CATEGORIA }]
const INTERVALO_ESTADO_MS = 4000
// Algo más que la espera del backend (15 min) antes de dar la generación por perdida
const LIMITE_ESPERA_MS = 16 * 60 * 1000

const $q = useQuasar()
const axios = AxiosHttpRepository.getInstance()
const configuracionGeneral = useConfiguracionGeneralStore()
const { notificarCorrecto, notificarError, notificarAdvertencia } =
  useNotificaciones()

const tipo = ref<TipoReporte>('normal')
const codigo = ref('')
const errorCodigo = ref<string | null>(null)
// Se muestra si el backend lo exige aunque la configuración cargada diga lo contrario
const forzarCampoCodigo = ref(false)

const generando = ref(false)
const tipoEnCurso = ref<TipoReporte>('normal')
const segundos = ref(0)
const disponibles = ref<ReporteDisponible[]>([])
const mostrarVisor = ref(false)
const urlPdf = ref<string | null>(null)

let desmontado = false
let cronometro: ReturnType<typeof setInterval> | undefined

const mostrarCampoCodigo = computed(
  () =>
    forzarCampoCodigo.value ||
    (configuracionGeneral.configuracion?.requiere_codigo_verificacion ?? true)
)
const tiempoTranscurrido = computed(
  () =>
    `${Math.floor(segundos.value / 60)}:${String(segundos.value % 60).padStart(
      2,
      '0'
    )}`
)

watch(codigo, () => (errorCodigo.value = null))

const nombreTipo = (valor: string) =>
  OPCIONES_TIPO.find((o) => o.value === valor)?.label ?? valor

const rutaRevision = (sufijo: string) =>
  axios.getEndpoint({
    endpoint: endpoints.revision_creditos,
    id: props.revisionId,
  }) + sufijo

async function cargarDisponibles() {
  try {
    const response: any = await axios.get(rutaRevision('/reportes'))
    disponibles.value = response.data.reportes
  } catch (error) {
    // Solo informativo: la generación sigue disponible
    disponibles.value = []
  }
}

function validar(): boolean {
  if (mostrarCampoCodigo.value && !codigo.value.trim()) {
    errorCodigo.value = 'Debe ingresar el código de verificación.'
    return false
  }
  return true
}

async function generar() {
  if (generando.value || !validar()) return

  generando.value = true
  tipoEnCurso.value = tipo.value
  segundos.value = 0
  cronometro = setInterval(() => segundos.value++, 1000)

  try {
    const response: any = await axios.post(rutaRevision('/reportes'), {
      tipo_reporte: tipo.value,
      categoria: CATEGORIA,
      codigo_verificacion: mostrarCampoCodigo.value
        ? codigo.value.trim()
        : null,
    })

    let resultado: EstadoGeneracionReporte = response.data
    if (resultado.estado === 'en_proceso') {
      resultado = await esperarGeneracion(resultado.generacion_id)
    }
    if (desmontado) return

    if (resultado.estado === 'completado' && resultado.reporte_id) {
      codigo.value = ''
      notificarCorrecto('El reporte se generó correctamente.')
      await cargarDisponibles()
      verPdf(resultado.reporte_id)
    } else if (resultado.estado === 'error') {
      notificarError(resultado.mensaje || 'No se pudo generar el reporte.')
    } else {
      notificarAdvertencia(
        'No se recibió confirmación del reporte. Vuelva a abrir la revisión en unos minutos antes de generarlo de nuevo.'
      )
    }
  } catch (error: any) {
    if (desmontado) return
    const errorDeCodigo = error?.response?.data?.errors?.codigo_verificacion
    if (errorDeCodigo) {
      forzarCampoCodigo.value = true
      errorCodigo.value = errorDeCodigo[0]
    } else if (error?.response?.status === 429) {
      notificarError(
        'Demasiados intentos. Espere un minuto antes de volver a intentar.'
      )
    } else {
      notificarError(
        obtenerMensajeError(error, 'No se pudo generar el reporte.')
      )
    }
  } finally {
    clearInterval(cronometro)
    generando.value = false
  }
}

const pausa = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function esperarGeneracion(
  generacionId: string
): Promise<EstadoGeneracionReporte> {
  const ruta =
    axios.getEndpoint(endpoints.revision_creditos_generaciones) +
    `/${generacionId}`
  const limite = Date.now() + LIMITE_ESPERA_MS

  while (!desmontado && Date.now() < limite) {
    await pausa(INTERVALO_ESTADO_MS)
    try {
      const response: any = await axios.get(ruta)
      if (response.data.estado !== 'en_proceso') return response.data
    } catch (error: any) {
      // 401/403/404 no se van a resolver reintentando
      if ([401, 403, 404].includes(error?.response?.status)) throw error
    }
  }

  return {
    generacion_id: generacionId,
    estado: 'sin_respuesta',
    reporte_id: null,
    tipo_reporte: tipoEnCurso.value,
    reutilizado: false,
    mensaje: null,
  }
}

async function verPdf(reporteId: number) {
  try {
    $q.loading.show({ message: 'Obteniendo documento...' })
    const response: any = await axios.get(
      axios.getEndpoint(endpoints.revision_creditos_reportes) +
        `/${reporteId}/pdf`,
      { responseType: 'blob' }
    )
    liberarPdf()
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    )

    if ($q.platform.is.mobile) {
      // En móviles se abre en otra pestaña
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
    } else {
      urlPdf.value = url
      mostrarVisor.value = true
    }
  } catch (error) {
    notificarError('No se pudo recuperar el reporte.')
  } finally {
    $q.loading.hide()
  }
}

function liberarPdf() {
  if (urlPdf.value) URL.revokeObjectURL(urlPdf.value)
  urlPdf.value = null
}

onMounted(() => {
  cargarDisponibles()
  // Por si cambió el requisito del código de verificación
  configuracionGeneral.consultarConfiguracion()
})

onBeforeUnmount(() => {
  desmontado = true
  clearInterval(cronometro)
  liberarPdf()
})
</script>

<style scoped lang="scss">
@import './chip-moderno.scss';

.generando {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #e6e8eb;
}

.reporte-disponible {
  padding-block: 10px;

  & + & {
    border-top: 1px solid #eef0f2;
  }
}
</style>
