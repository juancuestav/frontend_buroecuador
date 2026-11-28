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

      <!-- Solicitudes que ya tiene la cédula (de cualquier asesor) -->
      <div v-if="existentes.length" class="existentes q-mt-sm">
        <div class="row items-center q-mb-xs">
          <q-icon name="bi-folder2-open" class="q-mr-sm" />
          <b>El cliente ya tiene {{ existentes.length }} {{ existentes.length === 1 ? 'solicitud' : 'solicitudes' }}</b>
        </div>
        <div v-for="e in existentes" :key="e.id" class="existentes__fila row items-center q-gutter-x-sm">
          <span>#{{ e.id }}</span>
          <span class="text-bold">{{ e.banco_nombre ?? 'Sin banco' }}</span>
          <span class="chip-estado" :style="estiloEstado(e.estado)">{{ e.estado_texto }}</span>
          <span class="text-grey-7">Registrada el {{ formatearFechaHora(e.created_at) }}<template v-if="e.asesor"> · {{ e.asesor }}</template></span>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          No se permite otra solicitud en un banco donde ya tenga una, salvo que
          esté en "Negado" o "No procede".
          <template v-if="bancosBloqueados.length === 2"><b class="text-negative">Ya tiene solicitudes en los dos bancos.</b></template>
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

      <!-- Monto, plazo, día de pago y "Pertenece a" (obligatorios para continuar) -->
      <q-form
        v-if="resultado.habilitacion.puede_continuar && bancosBloqueados.length < 2"
        ref="formulario"
        greedy
        class="datos-cliente q-mt-md"
        @submit.prevent="continuar"
      >
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Monto que solicita el cliente</label>
            <campo-numero
              v-model="datos.monto_solicitado"
              prefix="$"
              :rules="[(v) => (!!v && v > 0) || 'Ingrese el monto']"
              :disable="!editable"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-8">
            <label class="q-mb-sm block">Plazo (años)</label>
            <q-btn-toggle
              v-model="plazoAnios"
              :options="opcionesPlazo"
              :disable="!editable"
              toggle-color="primary"
              unelevated
              no-caps
              class="plazo"
              :class="{ 'plazo--error': errorPlazo }"
            />
            <div v-if="errorPlazo" class="mensaje-error">Elija el plazo</div>
          </div>
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Comisión</label>
            <campo-numero
              v-model="datos.comision"
              suffix="%"
              :rules="[reglaComision]"
              :disable="!editable"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Día de pago</label>
            <selector-dia-pago v-model="datos.dia_pago" :disable="!editable" :error="errorDia" />
            <div v-if="errorDia" class="mensaje-error">Elija el día de pago</div>
            <div v-else class="text-caption text-grey-7 q-mt-xs">
              {{ datos.dia_pago ? `El cliente pagará el ${datos.dia_pago} de cada mes` : 'Días disponibles del 3 al 28' }}
            </div>
          </div>
          <div v-if="puedeAsignar" class="col-12 col-md-8">
            <label class="q-mb-sm block">Pertenece a</label>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="perteneceA"
                  :options="opcionesAsesor"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  :disable="!editable"
                  outlined
                  dense
                />
              </div>
              <div v-if="perteneceA === OTRO" class="col-12 col-sm-6">
                <q-input
                  v-model.trim="nombreOtro"
                  placeholder="Nombre del asesor"
                  maxlength="150"
                  :rules="[(v) => !!v || 'Escriba el nombre del asesor']"
                  :disable="!editable"
                  outlined
                  dense
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-end q-mt-md">
          <!-- Con @click (no submit): QForm no frena antes de marcar también plazo y día -->
          <q-btn
            color="primary"
            icon-right="bi-arrow-right"
            :label="solicitud ? 'Continuar' : 'Continuar solicitud'"
            :loading="procesando"
            no-caps
            unelevated
            @click="continuar"
          />
        </div>
      </q-form>

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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { QForm, useQuasar } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import ResultadoValidacion from 'pages/revisionCreditos/view/components/ResultadoValidacion.vue'
import DatosCliente from 'pages/revisionCreditos/view/components/DatosCliente.vue'
import {
  formatearFechaBarra,
  obtenerMensajeError,
} from 'pages/revisionCreditos/domain/formato'
import { useAuthenticationStore } from 'stores/authentication'
import {
  DatosCliente as DatosPasoCliente,
  RevisionParaSolicitud,
  SolicitudCredito,
} from '../../domain/SolicitudCredito'
import { estiloEstado } from '../../domain/estados'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'
import CampoNumero from './CampoNumero.vue'
import SelectorDiaPago from './SelectorDiaPago.vue'

const DIAS_VIGENCIA = 30

const props = defineProps<{ solicitud: SolicitudCredito | null }>()
const emit = defineEmits<{
  /** Paso 1 listo: crear la solicitud o guardar el paso con esta revisión y los datos del cliente */
  (e: 'continuar', revisionId: number, datos: DatosPasoCliente): void
}>()

const $q = useQuasar()
const { notificarError, notificarAdvertencia } = useNotificaciones()

const cedula = ref<string>(props.solicitud?.identificacion ?? '')
const forzarEquifax = ref(false)
const procesando = ref(false)
const resultado = ref<RevisionParaSolicitud | null>(null)

// Otras solicitudes de la cédula (la propia, si ya existe, no cuenta)
const existentes = computed(() =>
  (resultado.value?.solicitudes_existentes ?? []).filter((e) => e.id !== props.solicitud?.id)
)
const bancosBloqueados = computed(() => [
  ...new Set(existentes.value.filter((e) => e.bloquea && e.banco).map((e) => e.banco)),
])

// "2026-11-24 00:45" → "24/11/2026"
const formatearFechaHora = (fecha: string | null) => formatearFechaBarra(fecha)

/* Monto, plazo, día de pago y "Pertenece a" */
const editable = computed(() => props.solicitud?.permisos.editar ?? true)
const formulario = ref<QForm | null>(null)
const datos = reactive<{ monto_solicitado: number | null; dia_pago: number | null; comision: number | null }>({
  monto_solicitado: props.solicitud?.monto_solicitado ?? null,
  dia_pago: props.solicitud?.dia_pago ?? null,
  comision: props.solicitud?.comision ?? null,
})
const plazoMaximo = ref(props.solicitud?.parametros.plazo_maximo ?? 60)
const plazoAnios = ref<number | null>(props.solicitud?.plazo_meses ? Math.round(props.solicitud.plazo_meses / 12) : null)
const opcionesPlazo = computed(() =>
  Array.from({ length: Math.max(1, Math.floor(plazoMaximo.value / 12)) }, (_, i) => ({
    label: `${i + 1} ${i === 0 ? 'año' : 'años'}`,
    value: i + 1,
  }))
)
const intentoContinuar = ref(false)
const errorPlazo = computed(() => intentoContinuar.value && !plazoAnios.value)
const errorDia = computed(() => intentoContinuar.value && !datos.dia_pago)
// CampoNumero pasa a las reglas el texto del campo ('' si está vacío), no el número
const reglaComision = (v: string | number | null) => {
  if (v === null || v === undefined || String(v).trim() === '') return 'Ingrese la comisión'
  const valor = Number(String(v).replace(',', '.'))
  return (valor >= 0 && valor <= 100) || 'Debe estar entre 0 y 100'
}

const autenticacion = useAuthenticationStore()
const puedeAsignar = autenticacion.can('asignar.asesor_solicitudes_credito')
const OTRO = -1
const usuarioActual = { id: autenticacion.user?.id as number, nombre: autenticacion.nombreUsuario as string }
const asesores = ref<{ id: number; nombre: string }[]>([])
const opcionesAsesor = computed(() => [
  ...(asesores.value.length ? asesores.value : [usuarioActual]),
  { id: OTRO, nombre: 'Otro' },
])
const perteneceA = ref<number>(
  props.solicitud?.pertenece_a_nombre ? OTRO : (props.solicitud?.asesor_id ?? usuarioActual.id)
)
const nombreOtro = ref<string>(props.solicitud?.pertenece_a_nombre ?? '')

onMounted(async () => {
  if (!props.solicitud) {
    try {
      plazoMaximo.value = (await solicitudesApi.parametros()).modelo.plazo_maximo
    } catch {
      // se usa el plazo máximo por defecto
    }
  }
  if (!puedeAsignar) return
  try {
    asesores.value = (await solicitudesApi.asesores()).asesores
  } catch {
    // sin la lista, "Pertenece a" ofrece al usuario actual y "Otro"
  }
})

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

async function continuar() {
  if (!resultado.value) return
  intentoContinuar.value = true
  const valido = await formulario.value?.validate()
  if (!valido || !plazoAnios.value || !datos.dia_pago) return

  const cliente: DatosPasoCliente = {
    monto_solicitado: datos.monto_solicitado,
    plazo_meses: plazoAnios.value * 12,
    dia_pago: datos.dia_pago,
    comision: datos.comision,
  }
  // Solo quien tiene el permiso envía "Pertenece a"
  if (puedeAsignar) {
    cliente.asesor_id = perteneceA.value === OTRO ? null : perteneceA.value
    cliente.pertenece_a_nombre = perteneceA.value === OTRO ? nombreOtro.value : null
  }
  emit('continuar', resultado.value.revision.id, cliente)
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
      solicitudes_existentes: solicitud.otras_solicitudes,
    }
  },
  { immediate: true }
)

defineExpose({ revisar })
</script>

<style scoped lang="scss">
.existentes {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(230, 81, 0, 0.28);
  background: rgba(230, 81, 0, 0.05);
  font-size: 0.9rem;

  &__fila {
    padding: 3px 0 3px 24px;
  }
}

.chip-estado {
  display: inline-flex;
  padding: 1px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.datos-cliente {
  padding: 16px;
  border: 1px solid #e6e8eb;
  border-radius: 12px;
}

.plazo {
  border: 1px solid rgba(0, 0, 0, 0.24);

  // Mismo resaltado que un campo de Quasar con error
  &--error {
    border-color: var(--q-negative);
  }
}

// Mismo mensaje que el de las reglas de Quasar (q-field__bottom) para los
// campos que no son q-field (plazo y día de pago)
.mensaje-error {
  padding: 8px 12px 0;
  font-size: 12px;
  line-height: 1;
  color: var(--q-negative);
}

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
