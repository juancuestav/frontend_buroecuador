<template>
  <q-form ref="formulario" greedy @submit.prevent>
    <!-- Tipo de ingreso: solo los que tiene el cliente según la revisión -->
    <label class="q-mb-sm block text-bold">¿Con qué relación económica se ingresa la solicitud?</label>
    <div class="row q-col-gutter-sm q-mb-md">
      <div v-for="opcion in tiposIngreso" :key="opcion.tipo" class="col-12 col-sm-4">
        <button
          type="button"
          class="opcion-tipo full-width"
          :class="{ 'opcion-tipo--activa': tipo === opcion.tipo }"
          :disabled="!opcion.disponible || !editable"
          @click="tipo = opcion.tipo"
        >
          <span class="text-bold">{{ ETIQUETAS[opcion.tipo] }}</span>
          <span class="opcion-tipo__estado">{{ estadoTipo(opcion) }}</span>
        </button>
      </div>
    </div>

    <div v-if="tipo" class="row q-col-gutter-md">
      <div v-if="conIess" class="col-12 col-sm-6 col-md-4">
        <label class="q-mb-sm block">Ingreso como dependiente (IESS)</label>
        <campo-numero
          v-model="ingresoIess"
          prefix="$"
          :rules="[reglaIngreso]"
          :disable="!editable"
          outlined
          dense
          :hint="pistaIess"
        />
        <div v-if="ingresoModificado" class="text-caption text-orange-9 q-mt-xs">
          <q-icon name="bi-exclamation-triangle" /> Ingreso modificado: el
          administrador verá el valor original del IESS
          ({{ formatearMoneda(ingresoIessOriginal) }}).
        </div>
      </div>
      <div v-if="conRuc" class="col-12 col-sm-6 col-md-4">
        <label class="q-mb-sm block">Ingreso como independiente (RUC)</label>
        <campo-numero
          v-model="ingresoRuc"
          prefix="$"
          :rules="[reglaIngreso]"
          :disable="!editable"
          outlined
          dense
          hint="Ingreso mensual promedio; debe respaldarse con las declaraciones"
        />
      </div>
      <div v-if="conRuc" class="col-12">
        <label class="q-mb-sm row items-center">
          Descripción de la actividad del cliente
          <q-icon name="bi-info-circle" size="15px" class="q-ml-sm text-grey-7 cursor-pointer">
            <q-tooltip class="bg-dark" max-width="300px">
              Breve descripción de la actividad que realiza el cliente, mientras más detalles, mejor.
            </q-tooltip>
          </q-icon>
        </label>
        <q-input
          v-model="actividad"
          type="textarea"
          autogrow
          maxlength="2000"
          :rules="[(v) => !!(v && v.trim()) || 'Describa la actividad que realiza el cliente']"
          :disable="!editable"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <label class="q-mb-sm block">Cuota estimada buró de crédito</label>
        <q-input
          :model-value="formatearMoneda(cuotaBuro)"
          disable
          outlined
          dense
          :hint="`Equifax, consulta del ${formatearFechaBarra(solicitud.equifax_consultado_at)}`"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <label class="q-mb-sm block">Plazo (años)</label>
        <campo-numero
          v-model="plazoAnios"
          :decimales="0"
          :rules="[reglaPlazo]"
          :disable="!editable"
          outlined
          dense
          :hint="`Máximo ${aniosMaximos} ${aniosMaximos === 1 ? 'año' : 'años'}${plazoMeses ? ' · ' + plazoMeses + ' cuotas mensuales' : ''}`"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <label class="q-mb-sm block">Monto a solicitar</label>
        <campo-numero
          v-model="monto"
          prefix="$"
          :rules="[reglaMonto]"
          :disable="!editable"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Cálculo (vista previa; el servidor recalcula al guardar) -->
    <div v-if="tipo" class="calculo q-mt-lg">
      <div class="text-bold q-mb-sm">Capacidad de pago</div>
      <div class="row q-col-gutter-md">
        <div v-for="fila in filasCalculo" :key="fila.etiqueta" class="col-6 col-md-3">
          <div class="calculo__etiqueta">{{ fila.etiqueta }}</div>
          <div class="calculo__valor" :class="fila.clase">{{ fila.valor }}</div>
        </div>
      </div>
      <div class="text-caption text-grey-7 q-mt-sm">
        Capacidad de pago = {{ parametros.porcentaje_capacidad }}% × (ingresos − cuota buró).
      </div>
      <div v-if="calculo.ingresoNeto <= 0" class="text-negative q-mt-sm">
        <q-icon name="bi-x-octagon" /> Los ingresos no cubren la cuota actual
        del buró: no hay capacidad de pago.
      </div>
      <div v-else-if="excede" class="text-negative q-mt-sm">
        <q-icon name="bi-x-octagon" /> El monto supera la capacidad de pago.
        Máximo a {{ textoAnios }}: {{ formatearMoneda(calculo.montoSugerido) }}.
        Reduzca el monto, amplíe el plazo o revise los ingresos.
      </div>
    </div>

    <analisis-calculo
      v-if="tipo && plazoMeses && calculo.capacidad > 0"
      class="q-mt-md"
      :capacidad="calculo.capacidad"
      :tasa-anual="parametros.tasa_anual"
      :plazo-meses="plazoMeses"
      :monto-solicitado="monto"
    />
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QForm } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import { formatearFechaBarra, formatearMoneda } from 'pages/revisionCreditos/domain/formato'
import { SolicitudCredito, TipoIngreso, TipoIngresoDisponible } from '../../domain/SolicitudCredito'
import { calcular } from '../../domain/calculo'
import CampoNumero from './CampoNumero.vue'
import AnalisisCalculo from './AnalisisCalculo.vue'

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()
const { notificarAdvertencia } = useNotificaciones()

const ETIQUETAS: Record<TipoIngreso, string> = { IESS: 'IESS', RUC: 'RUC', AMBOS: 'Ambos (IESS y RUC)' }
const parametros = computed(() => props.solicitud.parametros)
const tiposIngreso = computed(() => props.solicitud.economicos.tipos_ingreso)
const ingresoIessOriginal = computed(() => props.solicitud.economicos.ingreso_iess)
const cuotaBuro = computed(() => props.solicitud.cuota_buro ?? 0)
// El plazo se ingresa en años; el servidor lo guarda en meses (cuotas)
const aniosMaximos = computed(() => Math.floor(parametros.value.plazo_maximo / 12))

const tipo = ref<TipoIngreso | null>(props.solicitud.tipo_ingreso)
const ingresoIess = ref<number | null>(props.solicitud.ingreso_iess ?? ingresoIessOriginal.value)
const ingresoRuc = ref<number | null>(props.solicitud.ingreso_ruc)
const plazoAnios = ref<number | null>(
  props.solicitud.plazo_meses ? Math.round(props.solicitud.plazo_meses / 12) : aniosMaximos.value
)
const monto = ref<number | null>(props.solicitud.monto_solicitado)
const actividad = ref<string>(props.solicitud.actividad_descripcion ?? '')

const plazoMeses = computed(() => (plazoAnios.value && plazoAnios.value > 0 ? plazoAnios.value * 12 : null))
const textoAnios = computed(() => `${plazoAnios.value} ${plazoAnios.value === 1 ? 'año' : 'años'}`)

const conIess = computed(() => tipo.value === 'IESS' || tipo.value === 'AMBOS')
const conRuc = computed(() => tipo.value === 'RUC' || tipo.value === 'AMBOS')

function estadoTipo(opcion: TipoIngresoDisponible) {
  if (!opcion.disponible) return 'No disponible para este cliente'
  if (opcion.validacion === 'cumple') return 'Cumple la validación'
  if (opcion.validacion === 'autorizada') return 'Autorizada por un administrador'
  if (opcion.validacion === 'no_cumple') return 'No cumple la validación'
  return 'Disponible'
}

const pistaIess = computed(() => {
  const original = ingresoIessOriginal.value
  if (original === null) return 'Sin sueldo en la base del IESS: ingréselo'
  const corte = props.solicitud.economicos.iess_fecha_corte
  return `Sueldo según el IESS${corte ? ' (corte ' + formatearFechaBarra(corte) + ')' : ''}: ${formatearMoneda(original)}`
})
const ingresoModificado = computed(
  () =>
    conIess.value &&
    ingresoIessOriginal.value !== null &&
    Number(ingresoIess.value ?? 0).toFixed(2) !== Number(ingresoIessOriginal.value).toFixed(2)
)

const ingresos = computed(
  () => (conIess.value ? Number(ingresoIess.value) || 0 : 0) + (conRuc.value ? Number(ingresoRuc.value) || 0 : 0)
)
const calculo = computed(() =>
  calcular(
    ingresos.value,
    cuotaBuro.value,
    parametros.value.porcentaje_capacidad,
    parametros.value.tasa_anual,
    plazoMeses.value,
    monto.value && monto.value > 0 ? monto.value : null
  )
)
const excede = computed(
  () => !!monto.value && calculo.value.montoSugerido !== null && monto.value > calculo.value.montoSugerido
)

const filasCalculo = computed(() => [
  { etiqueta: 'Ingresos totales', valor: formatearMoneda(ingresos.value), clase: '' },
  { etiqueta: 'Cuota buró', valor: formatearMoneda(cuotaBuro.value), clase: '' },
  { etiqueta: 'Ingreso neto', valor: formatearMoneda(calculo.value.ingresoNeto), clase: '' },
  {
    etiqueta: `Capacidad de pago (${parametros.value.porcentaje_capacidad}%)`,
    valor: formatearMoneda(calculo.value.capacidad),
    clase: 'text-primary',
  },
  { etiqueta: 'Monto sugerido (máximo)', valor: formatearMoneda(calculo.value.montoSugerido), clase: 'text-positive' },
  { etiqueta: 'Cuota del préstamo', valor: formatearMoneda(calculo.value.cuota), clase: excede.value ? 'text-negative' : '' },
  { etiqueta: 'Nueva cuota buró', valor: formatearMoneda(calculo.value.nuevaCuotaBuro), clase: '' },
])

const reglaIngreso = (v: number | null) => (v !== null && Number(v) > 0) || 'Ingrese el ingreso mensual'
const reglaPlazo = (v: number | null) => {
  if (!v || !Number.isInteger(Number(v)) || Number(v) < 1) return 'Ingrese el plazo en años'
  if (Number(v) > aniosMaximos.value) return `El plazo máximo es de ${aniosMaximos.value} años`
  return true
}
const reglaMonto = (v: number | null) => {
  if (!v || Number(v) <= 0) return 'Ingrese el monto'
  const { monto_minimo: minimo, monto_maximo: maximo } = parametros.value
  if (minimo !== null && Number(v) < minimo) return `El monto mínimo es ${formatearMoneda(minimo)}`
  if (maximo !== null && Number(v) > maximo) return `El monto máximo es ${formatearMoneda(maximo)}`
  return true
}

const formulario = ref<QForm | null>(null)

async function obtenerDatos() {
  if (!tipo.value) {
    notificarAdvertencia('Elija la relación económica.')
    return null
  }
  const valido = await formulario.value?.validate()
  if (!valido) return null
  if (calculo.value.ingresoNeto <= 0 || excede.value) {
    notificarAdvertencia('El monto supera la capacidad de pago.')
    return null
  }
  return {
    tipo_ingreso: tipo.value,
    ingreso_iess: conIess.value ? ingresoIess.value : null,
    ingreso_ruc: conRuc.value ? ingresoRuc.value : null,
    plazo_meses: plazoMeses.value,
    monto_solicitado: monto.value,
    actividad_descripcion: conRuc.value ? actividad.value.trim() : null,
  }
}

defineExpose({ obtenerDatos })
</script>

<style scoped lang="scss">
.opcion-tipo {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border: 2px solid #e0e4e8;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &--activa {
    border-color: #1e63d6;
    background: rgba(30, 99, 214, 0.06);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__estado {
    font-size: 0.78rem;
    color: #78909c;
  }
}

.calculo {
  padding: 16px;
  border: 1px solid #e6e8eb;
  border-radius: 12px;

  &__etiqueta {
    font-size: 0.75rem;
    color: #78909c;
  }

  &__valor {
    font-size: 1.05rem;
    font-weight: 700;
  }
}
</style>
