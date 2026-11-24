<template>
  <div>
    <!-- Encabezado -->
    <div class="encabezado row items-start q-col-gutter-md q-mb-md">
      <div class="col-12 col-md">
        <div class="text-h6 text-bold">Solicitud #{{ solicitud.id }} · {{ solicitud.nombres }}</div>
        <div class="text-caption text-grey-7">
          Cédula {{ solicitud.identificacion }} · {{ solicitud.banco_nombre }} ·
          Asesor {{ solicitud.asesor }} · Ingresada {{ solicitud.created_at }}
          <template v-if="solicitud.enviado_at"> · Enviada {{ solicitud.enviado_at }}</template>
        </div>
        <div class="row q-gutter-sm q-mt-sm">
          <span class="chip-estado" :style="estiloEstado(solicitud.estado)">
            <q-icon :name="ESTADOS[solicitud.estado].icono" class="q-mr-xs" />
            {{ solicitud.estado_texto }}
          </span>
          <span v-if="solicitud.con_autorizacion" class="chip-estado chip-estado--aviso">
            Con autorización{{ solicitud.autorizado_por ? ' · ' + solicitud.autorizado_por : '' }}
          </span>
          <span v-if="solicitud.ingreso_modificado" class="chip-estado chip-estado--aviso">
            Ingreso modificado
          </span>
        </div>
      </div>

      <!-- Acciones del administrador -->
      <div v-if="solicitud.permisos.gestionar" class="col-12 col-md-auto column q-gutter-sm">
        <q-btn unelevated no-caps color="primary" icon="bi-arrow-left-right" label="Cambiar estado" @click="abrirEstado" />
        <q-btn outline no-caps color="primary" icon="bi-file-earmark-plus" label="Pedir documento" @click="dialogoDocumento = true" />
        <q-toggle
          :model-value="solicitud.asesor_puede_comentar"
          label="El asesor puede comentar"
          :disable="procesando"
          @update:model-value="cambiarComentariosAsesor"
        />
      </div>
    </div>

    <div v-if="solicitud.observacion" class="observacion row no-wrap items-start q-mb-md">
      <q-icon name="bi-chat-left-text" size="18px" class="q-mr-sm q-mt-xs" />
      <div><b>Observación:</b> {{ solicitud.observacion }}</div>
    </div>

    <q-tabs v-model="pestania" align="left" no-caps dense active-color="primary" indicator-color="primary" class="q-mb-sm">
      <q-tab name="datos" icon="bi-card-text" label="Datos" />
      <q-tab name="documentos" icon="bi-file-earmark-pdf" :label="`Documentos (${solicitud.documentos.length})`" />
      <q-tab name="seguimiento" icon="bi-clock-history" :label="`Seguimiento (${solicitud.seguimiento.length})`" />
      <q-tab name="revision" icon="bi-clipboard-check" label="Revisión de crédito" />
    </q-tabs>

    <q-tab-panels v-model="pestania" animated keep-alive>
      <q-tab-panel name="datos" class="q-px-none">
        <resumen-solicitud :solicitud="solicitud" />
      </q-tab-panel>

      <q-tab-panel name="documentos" class="q-px-none">
        <div class="row q-col-gutter-md">
          <div v-for="documento in solicitud.documentos" :key="documento.id" class="col-12 col-sm-6 col-lg-4">
            <tarjeta-documento
              :documento="documento"
              :solicitud-id="solicitud.id"
              :editable="false"
              :gestionar="solicitud.permisos.gestionar"
              @actualizada="emit('actualizada', $event)"
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="seguimiento" class="q-px-none seguimiento">
        <q-form v-if="solicitud.permisos.comentar" class="row q-col-gutter-sm items-start q-mb-md" @submit.prevent="comentar">
          <div class="col">
            <q-input
              v-model="comentario"
              type="textarea"
              autogrow
              outlined
              dense
              placeholder="Escriba un comentario para el seguimiento"
              maxlength="2000"
            />
          </div>
          <div class="col-auto">
            <q-btn unelevated no-caps color="primary" icon="bi-send" label="Comentar" type="submit" :loading="procesando" :disable="!comentario.trim()" />
          </div>
        </q-form>
        <div v-else-if="!solicitud.permisos.gestionar" class="text-caption text-grey-7 q-mb-md">
          El administrador aún no habilitó sus comentarios en esta solicitud.
        </div>

        <q-timeline color="primary" layout="dense" class="linea-tiempo">
          <q-timeline-entry
            v-for="s in seguimientoReciente"
            :key="s.id"
            :icon="ICONOS_SEGUIMIENTO[s.tipo]"
            :color="s.estado_nuevo ? undefined : s.es_administrador ? 'primary' : 'teal'"
            :subtitle="`${s.created_at} · ${s.usuario ?? ''}${s.es_administrador ? '' : ' (asesor)'}`"
          >
            <template v-if="s.estado_nuevo" #title>
              <span class="chip-estado" :style="estiloEstado(s.estado_nuevo)">{{ ESTADOS[s.estado_nuevo].texto }}</span>
            </template>
            <div class="mensaje">{{ s.mensaje }}</div>
          </q-timeline-entry>
        </q-timeline>
      </q-tab-panel>

      <q-tab-panel name="revision" class="q-px-none">
        <resultado-validacion :revision="solicitud.revision">
          <template #despues-calificacion>
            <datos-cliente :cliente="solicitud.revision.cliente" />
          </template>
        </resultado-validacion>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Cambiar estado -->
    <q-dialog v-model="dialogoEstado">
      <q-card style="width: 520px; max-width: 95vw">
        <q-card-section class="text-subtitle1 text-bold">Cambiar estado</q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="formularioEstado" greedy class="column q-gutter-sm" @submit.prevent="guardarEstado">
            <q-select
              v-model="nuevoEstado.estado"
              :options="opcionesEstado"
              emit-value
              map-options
              outlined
              dense
              label="Nuevo estado"
              :rules="[(v) => !!v || 'Elija el estado']"
            />
            <div v-if="nuevoEstado.estado === 'LISTO_PARA_ENVIAR'" class="text-caption text-orange-9">
              Devuelve la solicitud al asesor para que la corrija y la vuelva a enviar.
            </div>
            <template v-if="nuevoEstado.estado === 'APROBADO'">
              <div class="row q-col-gutter-sm">
                <campo-numero
                  v-model="nuevoEstado.monto_aprobado"
                  class="col-12 col-sm-4"
                  prefix="$"
                  label="Monto aprobado"
                  outlined
                  dense
                  :rules="[(v) => (!!v && v > 0) || 'Obligatorio']"
                />
                <campo-numero
                  v-model="nuevoEstado.plazo_aprobado_anios"
                  :decimales="0"
                  class="col-12 col-sm-4"
                  label="Plazo (años)"
                  outlined
                  dense
                  :rules="[(v) => (!!v && v > 0) || 'Obligatorio']"
                />
                <campo-numero
                  v-model="nuevoEstado.cuota_aprobada"
                  class="col-12 col-sm-4"
                  prefix="$"
                  label="Cuota aprobada"
                  outlined
                  dense
                  hint="Vacía: se calcula"
                />
              </div>
            </template>
            <q-input
              v-model="nuevoEstado.comentario"
              type="textarea"
              autogrow
              outlined
              dense
              :label="requiereComentario ? 'Comentario (obligatorio)' : 'Comentario (opcional)'"
              :rules="[(v) => !requiereComentario || !!(v && v.trim()) || 'Escriba el motivo']"
            />
            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn flat no-caps label="Cancelar" v-close-popup />
              <q-btn unelevated no-caps color="primary" label="Guardar" type="submit" :loading="procesando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Pedir documento adicional -->
    <q-dialog v-model="dialogoDocumento">
      <q-card style="width: 460px; max-width: 95vw">
        <q-card-section class="text-subtitle1 text-bold">Pedir documento adicional</q-card-section>
        <q-card-section class="q-pt-none">
          <q-form class="column q-gutter-sm" @submit.prevent="pedirDocumento">
            <q-input v-model="pedido.nombre" label="Documento" outlined dense maxlength="150" :rules="[(v) => !!(v && v.trim()) || 'Obligatorio']" />
            <q-input v-model="pedido.detalle" label="Descripción (opcional)" outlined dense maxlength="255" />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat no-caps label="Cancelar" v-close-popup />
              <q-btn unelevated no-caps color="primary" label="Pedir" type="submit" :loading="procesando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { QForm } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import ResultadoValidacion from 'pages/revisionCreditos/view/components/ResultadoValidacion.vue'
import DatosCliente from 'pages/revisionCreditos/view/components/DatosCliente.vue'
import { obtenerMensajeError } from 'pages/revisionCreditos/domain/formato'
import { EstadoSolicitud, SolicitudCredito } from '../../domain/SolicitudCredito'
import { ESTADOS, ESTADOS_ADMINISTRADOR, ESTADOS_CON_COMENTARIO, estiloEstado } from '../../domain/estados'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'
import ResumenSolicitud from './ResumenSolicitud.vue'
import TarjetaDocumento from './TarjetaDocumento.vue'
import CampoNumero from './CampoNumero.vue'


const ICONOS_SEGUIMIENTO = { comentario: 'bi-chat-left-text', estado: 'bi-flag', documento: 'bi-file-earmark' }

const props = defineProps<{ solicitud: SolicitudCredito }>()
const emit = defineEmits<{ (e: 'actualizada', modelo: SolicitudCredito): void }>()

const { notificarCorrecto, notificarError } = useNotificaciones()

const pestania = ref('datos')
const procesando = ref(false)
const comentario = ref('')

// Lo más reciente primero
const seguimientoReciente = computed(() => [...props.solicitud.seguimiento].reverse())

async function ejecutar(accion: () => Promise<{ modelo: SolicitudCredito; mensaje: string | null }>, error: string) {
  procesando.value = true
  try {
    const respuesta = await accion()
    emit('actualizada', respuesta.modelo)
    if (respuesta.mensaje) notificarCorrecto(respuesta.mensaje)
    return true
  } catch (e) {
    notificarError(obtenerMensajeError(e, error))
    return false
  } finally {
    procesando.value = false
  }
}

/* Cambiar estado */
const dialogoEstado = ref(false)
const formularioEstado = ref<QForm | null>(null)
const nuevoEstado = reactive<{
  estado: EstadoSolicitud | null
  comentario: string
  monto_aprobado: number | null
  plazo_aprobado_anios: number | null
  cuota_aprobada: number | null
}>({ estado: null, comentario: '', monto_aprobado: null, plazo_aprobado_anios: null, cuota_aprobada: null })

const opcionesEstado = computed(() =>
  ESTADOS_ADMINISTRADOR.filter((e) => e !== props.solicitud.estado).map((e) => ({
    value: e,
    label: e === 'LISTO_PARA_ENVIAR' ? 'Listo para enviar (devolver al asesor)' : ESTADOS[e].texto,
  }))
)
const requiereComentario = computed(
  () => !!nuevoEstado.estado && ESTADOS_CON_COMENTARIO.includes(nuevoEstado.estado)
)

function abrirEstado() {
  Object.assign(nuevoEstado, {
    estado: null,
    comentario: '',
    monto_aprobado: props.solicitud.monto_solicitado,
    plazo_aprobado_anios: props.solicitud.plazo_meses ? Math.round(props.solicitud.plazo_meses / 12) : null,
    cuota_aprobada: null,
  })
  dialogoEstado.value = true
}

async function guardarEstado() {
  if (!(await formularioEstado.value?.validate())) return
  const cuerpo: Record<string, any> = { estado: nuevoEstado.estado, comentario: nuevoEstado.comentario || null }
  if (nuevoEstado.estado === 'APROBADO') {
    cuerpo.monto_aprobado = nuevoEstado.monto_aprobado
    // El plazo se ingresa en años; el servidor lo guarda en meses
    cuerpo.plazo_aprobado = (nuevoEstado.plazo_aprobado_anios ?? 0) * 12
    cuerpo.cuota_aprobada = nuevoEstado.cuota_aprobada || null
  }
  const ok = await ejecutar(() => solicitudesApi.cambiarEstado(props.solicitud.id, cuerpo), 'No se pudo cambiar el estado.')
  if (ok) dialogoEstado.value = false
}

/* Comentarios */
async function comentar() {
  const texto = comentario.value.trim()
  if (!texto) return
  const ok = await ejecutar(() => solicitudesApi.comentar(props.solicitud.id, texto), 'No se pudo agregar el comentario.')
  if (ok) comentario.value = ''
}

function cambiarComentariosAsesor(habilitado: boolean) {
  ejecutar(() => solicitudesApi.comentariosAsesor(props.solicitud.id, habilitado), 'No se pudo actualizar.')
}

/* Documento adicional */
const dialogoDocumento = ref(false)
const pedido = reactive({ nombre: '', detalle: '' })

async function pedirDocumento() {
  if (!pedido.nombre.trim()) return
  const ok = await ejecutar(
    () => solicitudesApi.pedirDocumento(props.solicitud.id, pedido.nombre.trim(), pedido.detalle.trim() || null),
    'No se pudo pedir el documento.'
  )
  if (ok) {
    dialogoDocumento.value = false
    pedido.nombre = ''
    pedido.detalle = ''
    pestania.value = 'documentos'
  }
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

.observacion {
  padding: 10px 14px;
  border-radius: 10px;
  color: #1565c0;
  background: rgba(30, 99, 214, 0.06);
  border: 1px solid rgba(30, 99, 214, 0.25);
}

.mensaje {
  white-space: pre-line;
}

// Los íconos de la línea de tiempo sobresalen a la izquierda: sin este margen
// el panel (sin padding lateral) los corta
.linea-tiempo {
  padding-left: 14px;
  margin-bottom: 0;
}
</style>
