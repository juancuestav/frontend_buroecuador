<template>
  <div>
    <!-- Encabezado de una solicitud ya creada -->
    <div v-if="solicitud" class="row items-center q-mb-md q-gutter-sm">
      <div class="col-12 col-sm">
        <div class="text-subtitle1 text-bold">Solicitud #{{ solicitud.id }} · {{ solicitud.nombres }}</div>
        <div class="text-caption text-grey-8">
          Cédula {{ solicitud.identificacion }} · Monto solicitado
          {{ formatearMoneda(solicitud.monto_solicitado) }}<template v-if="solicitud.dia_pago">
            · Día de pago: {{ solicitud.dia_pago }} de cada mes</template><template
            v-if="solicitud.comision !== null && solicitud.comision !== undefined"
          >
            · Comisión {{ Number(solicitud.comision) }}%</template>
        </div>
      </div>
      <span class="chip-estado" :style="estiloEstado(solicitud.estado)">
        {{ solicitud.estado_texto }}
      </span>
      <span v-if="solicitud.con_autorizacion" class="chip-estado chip-estado--aviso">
        Con autorización
      </span>
    </div>
    <div
      v-if="solicitud?.estado === 'BORRADOR' && solicitud.observacion"
      class="devuelta row items-center no-wrap q-mb-md"
    >
      <q-icon name="bi-arrow-return-left" size="18px" class="q-mr-sm" />
      <div>Observación del administrador: {{ solicitud.observacion }}</div>
    </div>
    <!-- Otro asesor con permiso para editar las solicitudes sin enviar de otros -->
    <div v-if="solicitud?.es_propia === false" class="ajena row items-center no-wrap q-mb-md">
      <q-icon name="bi-pencil-square" size="18px" class="q-mr-sm" />
      <div>
        Está editando la solicitud de {{ solicitud.asesor ?? 'otro asesor' }}. Sus cambios quedan
        registrados en el seguimiento.
      </div>
    </div>

    <q-stepper
      v-model="paso"
      :vertical="$q.screen.lt.md"
      color="primary"
      animated
      flat
      bordered
      header-nav
      alternative-labels
      class="flujo"
    >
      <q-step
        v-for="definicion in PASOS"
        :key="definicion.numero"
        :name="definicion.numero"
        :title="definicion.titulo"
        :icon="definicion.icono"
        :done="!!solicitud && solicitud.paso > definicion.numero"
        :header-nav="puedeIrA(definicion.numero)"
      >
        <paso-cliente
          v-if="definicion.numero === 1"
          :solicitud="solicitud"
          @continuar="guardarCliente"
        />
        <template v-else-if="solicitud">
          <paso-contacto v-if="definicion.numero === 2" ref="pasoActual" :solicitud="solicitud" :editable="editable" />
          <paso-referencias v-if="definicion.numero === 3" ref="pasoActual" :solicitud="solicitud" :editable="editable" />
          <paso-banco v-if="definicion.numero === 4" ref="pasoActual" :solicitud="solicitud" :editable="editable" />
          <paso-economico v-if="definicion.numero === 5" ref="pasoActual" :solicitud="solicitud" :editable="editable" />
          <paso-documentos
            v-if="definicion.numero === 6"
            ref="pasoActual"
            :solicitud="solicitud"
            :editable="editable"
            @actualizada="emit('actualizada', $event)"
          />
          <template v-if="definicion.numero === 7">
            <div class="text-caption text-grey-7 q-mb-sm">
              Revise la información. Al enviar, el sistema verifica que los
              datos de Equifax sigan siendo los más recientes y la solicitud
              pasa a revisión del administrador.
            </div>
            <resumen-solicitud :solicitud="solicitud" />
          </template>
        </template>

        <q-stepper-navigation v-if="definicion.numero > 1" class="row q-gutter-sm">
          <q-btn flat no-caps color="primary" label="Atrás" icon="bi-arrow-left" @click="paso = definicion.numero - 1" />
          <q-space />
          <q-btn
            v-if="definicion.numero < 7"
            unelevated
            no-caps
            color="primary"
            label="Guardar y continuar"
            icon-right="bi-arrow-right"
            :loading="guardando"
            @click="guardar(definicion.numero)"
          />
          <q-btn
            v-else
            unelevated
            no-caps
            color="positive"
            icon="bi-send"
            label="Enviar solicitud"
            :disable="!solicitud?.permisos.enviar"
            :loading="guardando"
            @click="enviar"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import { formatearMoneda, obtenerMensajeError } from 'pages/revisionCreditos/domain/formato'
import { DatosCliente, SolicitudCredito } from '../../domain/SolicitudCredito'
import { estiloEstado } from '../../domain/estados'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'
import PasoCliente from './PasoCliente.vue'
import PasoContacto from './PasoContacto.vue'
import PasoReferencias from './PasoReferencias.vue'
import PasoBanco from './PasoBanco.vue'
import PasoEconomico from './PasoEconomico.vue'
import PasoDocumentos from './PasoDocumentos.vue'
import ResumenSolicitud from './ResumenSolicitud.vue'

const PASOS = [
  { numero: 1, titulo: 'Cliente', icono: 'bi-person-vcard' },
  { numero: 2, titulo: 'Contacto', icono: 'bi-telephone' },
  { numero: 3, titulo: 'Referencias', icono: 'bi-people' },
  { numero: 4, titulo: 'Banco', icono: 'bi-bank' },
  { numero: 5, titulo: 'Relación económica', icono: 'bi-calculator' },
  { numero: 6, titulo: 'Documentos', icono: 'bi-file-earmark-pdf' },
  { numero: 7, titulo: 'Resumen y envío', icono: 'bi-send' },
]

const props = defineProps<{ solicitud: SolicitudCredito | null }>()
const emit = defineEmits<{
  (e: 'actualizada', modelo: SolicitudCredito): void
  (e: 'enviada', modelo: SolicitudCredito): void
}>()

const $q = useQuasar()
const { notificarCorrecto, notificarError, notificarInformacion } = useNotificaciones()

// Se retoma en el primer paso pendiente
const paso = ref(Math.min(props.solicitud?.paso ?? 1, 7))
const guardando = ref(false)
const pasoActual = ref<any>(null)
const editable = computed(() => props.solicitud?.permisos.editar ?? true)

// Al abrir otra solicitud ya creada, se va a su paso pendiente (al crearla
// desde el paso 1, el propio flujo avanza)
watch(
  () => props.solicitud?.id,
  (id, anterior) => {
    if (anterior) paso.value = Math.min(props.solicitud?.paso ?? 1, 7)
  }
)

/** Solo los pasos ya alcanzados se abren desde el encabezado */
function puedeIrA(numero: number) {
  if (!props.solicitud) return numero === 1
  return numero <= props.solicitud.paso
}

async function guardarCliente(revisionId: number, cliente: DatosCliente) {
  guardando.value = true
  try {
    const respuesta = props.solicitud
      ? await solicitudesApi.guardarPaso(props.solicitud.id, 1, { revision_credito_id: revisionId, ...cliente })
      : await solicitudesApi.crear(revisionId, cliente)
    emit('actualizada', respuesta.modelo)
    if (!props.solicitud) notificarCorrecto('Solicitud creada como pendiente.')
    paso.value = 2
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudo guardar el paso.'))
  } finally {
    guardando.value = false
  }
}

async function guardar(numero: number) {
  if (!props.solicitud) return
  // Sin cambios posibles (p. ej. ya enviada): solo avanza
  if (!editable.value) {
    paso.value = numero + 1
    return
  }
  // Dentro de v-for la referencia es un arreglo (solo se monta el paso activo)
  const componente = Array.isArray(pasoActual.value) ? pasoActual.value[0] : pasoActual.value
  const datos = await componente?.obtenerDatos?.()
  if (!datos) {
    if (numero === 6) notificarInformacion('Complete todos los documentos para continuar.')
    return
  }

  guardando.value = true
  try {
    const respuesta = await solicitudesApi.guardarPaso(props.solicitud.id, numero, datos)
    emit('actualizada', respuesta.modelo)
    paso.value = numero + 1
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudo guardar el paso.'))
  } finally {
    guardando.value = false
  }
}

function enviar() {
  if (!props.solicitud) return
  const id = props.solicitud.id
  $q.dialog({
    title: 'Enviar solicitud',
    message: 'La solicitud pasará a revisión del administrador y ya no podrá modificarla. ¿Desea enviarla?',
    cancel: { label: 'Cancelar', flat: true, noCaps: true },
    ok: { label: 'Enviar', color: 'positive', unelevated: true, noCaps: true },
  }).onOk(async () => {
    guardando.value = true
    try {
      const respuesta = await solicitudesApi.enviar(id)
      notificarCorrecto(respuesta.mensaje ?? 'Solicitud enviada.')
      emit('enviada', respuesta.modelo)
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo enviar la solicitud.'))
      // Si con una consulta más reciente el monto ya no cabe, vuelve al paso 5
      try {
        const actual = await solicitudesApi.obtener(id)
        emit('actualizada', actual.modelo)
        paso.value = Math.min(actual.modelo.paso, 7)
      } catch {
        // se mantiene la vista actual
      }
    } finally {
      guardando.value = false
    }
  })
}

</script>

<style scoped lang="scss">
.chip-estado {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;

  &--aviso {
    color: #9a5b00;
    background: rgba(230, 81, 0, 0.08);
    border: 1px solid rgba(230, 81, 0, 0.3);
  }
}

.devuelta {
  padding: 10px 14px;
  border-radius: 10px;
  color: #9a5b00;
  background: rgba(230, 81, 0, 0.07);
  border: 1px solid rgba(230, 81, 0, 0.28);
}

.ajena {
  padding: 10px 14px;
  border-radius: 10px;
  color: #37474f;
  background: rgba(120, 144, 156, 0.1);
  border: 1px solid rgba(120, 144, 156, 0.35);
}

.flujo {
  border-radius: 14px;

  // Los 7 pasos en una sola fila: se encogen y, si no caben, se desplazan
  :deep(.q-stepper__header--alternative-labels) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  :deep(.q-stepper__header--alternative-labels .q-stepper__tab) {
    padding: 16px 6px;
    min-width: 96px;
  }
}
</style>
