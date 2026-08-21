<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-5">
        <div class="glass-layer glass-layer--inputs q-pa-md">
          <div class="text-h6 q-mb-md">{{ entidad.cliente_nombre }}</div>
          <div>
            <b>Identificación:</b> {{ entidad.identificacion }} ({{
              entidad.tipo_identificacion
            }})
          </div>
          <div><b>Teléfono:</b> {{ entidad.telefono }}</div>
          <div><b>Tipo de reporte:</b> {{ entidad.tipo_reporte }}</div>
          <div><b>Concepto original:</b> {{ entidad.concepto_original }}</div>
          <div class="q-mt-md">
            <q-badge :color="colorEstado(entidad.estado)">{{
              entidad.estado
            }}</q-badge>
          </div>

          <div class="q-mt-lg q-gutter-sm">
            <q-btn
              v-if="entidad.reporte_referencia"
              color="cyan"
              icon="picture_as_pdf"
              label="Ver/Descargar PDF"
              no-caps
              unelevated
              :loading="cargandoPdf"
              @click="verPdf"
            />
            <q-btn
              v-if="
                entidad.reporte_referencia &&
                entidad.estado !== 'reporte_entregado'
              "
              color="green"
              icon="bi-whatsapp"
              label="Reenviar por WhatsApp"
              no-caps
              unelevated
              :loading="cargandoWa"
              @click="abrirPromptWhatsapp"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-7">
        <div class="glass-layer glass-layer--actions q-pa-md">
          <q-timeline color="primary">
            <q-timeline-entry
              title="Pago recibido"
              :subtitle="formatearFecha(entidad.fecha_recibido)"
              :icon="
                entidad.fecha_recibido ? 'bi-check-circle-fill' : 'bi-hourglass-split'
              "
              :color="entidad.fecha_recibido ? 'positive' : 'grey-6'"
            />
            <q-timeline-entry
              title="Reporte generado"
              :subtitle="formatearFecha(entidad.fecha_generado)"
              :icon="
                entidad.fecha_generado ? 'bi-check-circle-fill' : 'bi-hourglass-split'
              "
              :color="entidad.fecha_generado ? 'positive' : 'grey-6'"
            />
            <q-timeline-entry
              title="Reporte entregado"
              :subtitle="formatearFecha(entidad.fecha_entregado)"
              :icon="
                entidad.fecha_entregado
                  ? 'bi-check-circle-fill'
                  : 'bi-hourglass-split'
              "
              :color="entidad.fecha_entregado ? 'positive' : 'grey-6'"
            />
          </q-timeline>
        </div>
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
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="col q-pa-none">
          <iframe
            v-if="urlPdfActual"
            :src="urlPdfActual"
            class="full-width full-height"
            style="border: none"
          ></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CompraReporte } from '../domain/CompraReporte'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar, date } from 'quasar'

const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<CompraReporte>,
    required: true,
  },
})

const { entidad } = props.mixin.useReferencias()
const { consultar } = props.mixin.useComportamiento()
const { notificarCorrecto, notificarError } = useNotificaciones()
const $q = useQuasar()

const axios = AxiosHttpRepository.getInstance()
const cargandoPdf = ref(false)
const cargandoWa = ref(false)
const mostrarVisorPdf = ref(false)
const urlPdfActual = ref<string | null>(null)

function formatearFecha(fecha: string | null) {
  if (!fecha) return 'Pendiente'
  return date.formatDate(fecha, 'DD/MM/YYYY HH:mm')
}

function colorEstado(estado: string | null) {
  return (
    {
      pago_recibido: 'blue-grey',
      reporte_generado: 'warning',
      reporte_entregado: 'positive',
      error: 'negative',
    }[estado ?? ''] ?? 'grey'
  )
}

async function verPdf() {
  cargandoPdf.value = true
  try {
    const ruta = axios.getEndpoint(endpoints.compras) + '/pdf'
    const response: any = await axios.get(ruta, {
      params: { reporte_pdf_id: entidad.reporte_referencia },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    urlPdfActual.value = window.URL.createObjectURL(blob)
    mostrarVisorPdf.value = true
  } catch (e) {
    notificarError('No se pudo obtener el PDF.')
  } finally {
    cargandoPdf.value = false
  }
}

function abrirPromptWhatsapp() {
  $q.dialog({
    html: true,
    title: 'Reenviar por WhatsApp',
    message:
      'Confirma el número al que se reenviará el reporte generado.',
    prompt: {
      model: entidad.telefono ?? '',
      type: 'text',
      mask: '###########',
      inputmode: 'numeric',
      label: 'Teléfono cliente',
      isValid: (val: string) => !!val && val.trim().length > 0,
    },
    cancel: true,
    persistent: true,
  }).onOk((telefono: string) => reenviarWhatsapp(telefono.trim()))
}

async function reenviarWhatsapp(telefono: string) {
  cargandoWa.value = true
  try {
    const ruta = axios.getEndpoint(endpoints.compras) + '/reenviar-whatsapp'
    await axios.post(ruta, {
      reporte_pdf_id: entidad.reporte_referencia,
      telefono_cliente: telefono,
    })
    notificarCorrecto('Solicitud de reenvío enviada.')
  } catch (e) {
    notificarError('No se pudo reenviar el WhatsApp.')
  } finally {
    cargandoWa.value = false
  }
}

defineExpose({ consultar })
</script>
