<template>
  <div>
    <!-- Cédula: en una solicitud ya creada queda fija -->
    <q-form class="row q-col-gutter-sm items-end" @submit.prevent="revisar()">
      <div class="col-12 col-md-5">
        <label class="q-mb-sm block">Cédula del cliente</label>
        <q-input
          v-model="cedula"
          placeholder="10 dígitos"
          mask="##########"
          inputmode="numeric"
          :disable="procesando || !!solicitud"
          outlined
          dense
        >
          <template #after>
            <q-btn
              v-if="!solicitud"
              color="primary"
              icon="bi-search"
              label="Revisar"
              :loading="procesando"
              no-caps
              unelevated
              @click="revisar()"
            />
            <q-btn
              v-else
              color="primary"
              icon="bi-arrow-clockwise"
              label="Actualizar revisión"
              :loading="procesando"
              no-caps
              outline
              @click="revisar(false)"
            >
              <q-tooltip class="bg-dark" max-width="300px">
                Vuelve a buscar la revisión más reciente de la cédula. Solo se
                consulta Equifax si no hay una consulta de {{ DIAS_VIGENCIA }}
                días o menos.
              </q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div v-if="!solicitud" class="col-12 col-md-4">
        <q-checkbox
          v-model="forzarEquifax"
          label="Forzar nueva consulta a Equifax"
          :disable="procesando"
          dense
        >
          <q-tooltip class="bg-dark" max-width="300px">
            Sin marcar, se usa la última consulta guardada en Revisión de
            créditos si tiene {{ DIAS_VIGENCIA }} días o menos. Una consulta
            nueva tiene costo.
          </q-tooltip>
        </q-checkbox>
      </div>
    </q-form>

    <template v-if="resultado">
      <!-- Origen de los datos de Equifax -->
      <div class="aviso aviso--info row items-center no-wrap q-mt-md">
        <q-icon name="bi-database-check" size="18px" class="q-mr-sm" />
        <div>
          <template v-if="resultado.revision.equifax_consultado_at">
            Datos de Equifax consultados el
            <b>{{ fechaConsulta }}</b> (hace {{ diasConsulta }}
            {{ diasConsulta === 1 ? 'día' : 'días' }}).
          </template>
          <template v-else>La revisión no llegó a consultar Equifax.</template>
          {{
            resultado.reutilizada
              ? 'Se usó la revisión guardada en Revisión de créditos; no se volvió a consultar.'
              : 'Se hizo una revisión nueva.'
          }}
        </div>
      </div>

      <div
        v-for="activa in otrasActivas"
        :key="activa.id"
        class="aviso aviso--advertencia row items-center no-wrap q-mt-sm"
      >
        <q-icon name="bi-exclamation-triangle" size="18px" class="q-mr-sm" />
        <div>
          El cliente ya tiene la solicitud #{{ activa.id }} en
          {{ activa.banco ?? 'un banco' }} ({{ activa.estado }}). No se permite
          otra solicitud activa en el mismo banco.
        </div>
      </div>

      <div
        v-if="!resultado.habilitacion.puede_continuar"
        class="aviso aviso--error row items-center no-wrap q-mt-sm"
      >
        <q-icon name="bi-x-octagon" size="18px" class="q-mr-sm" />
        <div>{{ resultado.habilitacion.motivo }}</div>
      </div>
      <div
        v-else-if="resultado.habilitacion.con_autorizacion"
        class="aviso aviso--advertencia row items-center no-wrap q-mt-sm"
      >
        <q-icon name="bi-shield-check" size="18px" class="q-mr-sm" />
        <div>
          El perfil no califica, pero un administrador autorizó continuar
          {{
            resultado.habilitacion.autorizado_por
              ? '(' + resultado.habilitacion.autorizado_por + ')'
              : ''
          }}. La solicitud quedará marcada <b>"Con autorización"</b>.
        </div>
      </div>

      <div class="row justify-end q-mt-md">
        <q-btn
          v-if="resultado.habilitacion.puede_continuar"
          color="primary"
          icon-right="bi-arrow-right"
          :label="solicitud ? 'Continuar' : 'Continuar solicitud'"
          :loading="procesando"
          no-caps
          unelevated
          @click="continuar"
        />
      </div>

      <resultado-validacion
        class="q-mt-md"
        :revision="resultado.revision"
        :cargando="procesando"
        @continuar="autorizar"
        @reintentar="autorizar"
      >
        <template #despues-calificacion>
          <datos-cliente :cliente="resultado.revision.cliente" />
        </template>
      </resultado-validacion>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import ResultadoValidacion from 'pages/revisionCreditos/view/components/ResultadoValidacion.vue'
import DatosCliente from 'pages/revisionCreditos/view/components/DatosCliente.vue'
import {
  formatearFechaBarra,
  obtenerMensajeError,
} from 'pages/revisionCreditos/domain/formato'
import { RevisionParaSolicitud, SolicitudCredito } from '../../domain/SolicitudCredito'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'

const DIAS_VIGENCIA = 30

const props = defineProps<{ solicitud: SolicitudCredito | null }>()
const emit = defineEmits<{
  /** Paso 1 listo: crear la solicitud o guardar el paso con esta revisión */
  (e: 'continuar', revisionId: number): void
}>()

const $q = useQuasar()
const { notificarError, notificarAdvertencia } = useNotificaciones()

const cedula = ref<string>(props.solicitud?.identificacion ?? '')
const forzarEquifax = ref(false)
const procesando = ref(false)
const resultado = ref<RevisionParaSolicitud | null>(null)

// La propia solicitud (si ya existe) no cuenta como otra activa
const otrasActivas = computed(() =>
  (resultado.value?.solicitudes_activas ?? []).filter((a) => a.id !== props.solicitud?.id)
)

const fechaConsulta = computed(() =>
  formatearFechaBarra(resultado.value?.revision.equifax_consultado_at)
)
const diasConsulta = computed(() => {
  const fecha = resultado.value?.revision.equifax_consultado_at
  if (!fecha) return null
  return Math.floor((Date.now() - new Date(fecha.replace(' ', 'T')).getTime()) / 86400000)
})

/**
 * Busca primero en el historial de Revisión de créditos (el backend solo hace
 * una revisión nueva si no hay una vigente).
 */
async function revisar(forzar = forzarEquifax.value) {
  if (procesando.value) return
  if (!/^\d{10}$/.test(cedula.value ?? '')) {
    notificarAdvertencia('Ingrese una cédula de 10 dígitos.')
    return
  }
  if (forzar) {
    const confirmado = await new Promise<boolean>((resolve) =>
      $q
        .dialog({
          title: 'Nueva consulta a Equifax',
          message: 'La consulta a Equifax tiene costo. ¿Desea continuar?',
          cancel: { label: 'Cancelar', flat: true, noCaps: true },
          ok: { label: 'Consultar', color: 'primary', unelevated: true, noCaps: true },
        })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    )
    if (!confirmado) return
  }

  resultado.value = null
  procesando.value = true
  try {
    resultado.value = await solicitudesApi.revisar(cedula.value, forzar)
    forzarEquifax.value = false
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudo revisar la cédula.'))
  } finally {
    procesando.value = false
  }
}

/**
 * Revisión detenida: con permiso se autoriza en Revisión de créditos (o se
 * reintenta Equifax) y se vuelve a revisar para ver si ya puede continuar.
 */
async function autorizar() {
  if (!resultado.value) return
  procesando.value = true
  try {
    await solicitudesApi.continuarRevision(resultado.value.revision.id)
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudo continuar la revisión.'))
    procesando.value = false
    return
  }
  procesando.value = false
  await revisar(false)
}

function continuar() {
  if (resultado.value) emit('continuar', resultado.value.revision.id)
}

// Solicitud existente: se muestra su revisión sin llamar al API (si la
// consulta venció, el asesor la actualiza con "Actualizar revisión")
watch(
  () => props.solicitud,
  (solicitud) => {
    if (!solicitud) return
    cedula.value = solicitud.identificacion
    resultado.value = {
      revision: solicitud.revision,
      reutilizada: true,
      habilitacion: {
        puede_continuar: solicitud.equifax_vigente,
        con_autorizacion: solicitud.con_autorizacion,
        autorizado_por: solicitud.autorizado_por,
        motivo: solicitud.equifax_vigente
          ? null
          : `La consulta de Equifax tiene más de ${DIAS_VIGENCIA} días. Actualice la revisión para continuar.`,
      },
      solicitudes_activas: [],
    }
  },
  { immediate: true }
)

defineExpose({ revisar })
</script>

<style scoped lang="scss">
.aviso {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 0.9rem;

  &--info {
    color: #1565c0;
    background: rgba(30, 99, 214, 0.06);
    border-color: rgba(30, 99, 214, 0.25);
  }
  &--advertencia {
    color: #9a5b00;
    background: rgba(230, 81, 0, 0.07);
    border-color: rgba(230, 81, 0, 0.28);
  }
  &--error {
    color: #b71c1c;
    background: rgba(211, 47, 47, 0.07);
    border-color: rgba(211, 47, 47, 0.28);
  }
}
</style>
