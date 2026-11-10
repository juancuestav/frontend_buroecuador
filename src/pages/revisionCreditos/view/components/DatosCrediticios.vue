<template>
  <seccion-revision
    label="Datos crediticios"
    :caption="`Equifax · consultado el ${consultadoAt || '—'}`"
  >
    <!-- Resumen de operaciones activas -->
    <div class="row items-center chips-operaciones q-mb-md">
      <span
        v-for="tag in tagsOperaciones"
        :key="tag.texto"
        class="chip-moderno"
        :class="`chip-moderno--${tag.tono}`"
      >
        <q-icon :name="tag.icono" size="14px" />
        {{ tag.texto }}
      </span>
    </div>

    <!-- Scores: se dibujan cuando el contenedor es visible y sin transformación (ver script) -->
    <div
      ref="contenedorGraficos"
      class="row q-col-gutter-md items-center q-mb-md"
    >
      <!-- Score crediticio -->
      <div class="col-12 col-md-6 text-center">
        <div class="text-bold">Score crediticio</div>
        <VueApexCharts
          v-if="visible"
          class="grafico"
          :key="`score-${instanciaId}`"
          type="radialBar"
          width="320"
          height="260"
          :options="opcionesScore"
          :series="[porcentaje(equifax.score.valor, ESCALA_SCORE)]"
        />
        <div class="score__pie">
          <span
            class="chip-moderno"
            :style="estiloChip(colorScore(equifax.score.valor))"
          >
            {{ calificacionScore(equifax.score.valor) }}
          </span>
          <div class="text-caption text-grey-8 q-mt-sm">
            Mínimo para calificar: {{ SCORE_MINIMO }}
          </div>
        </div>
      </div>

      <!-- Score sobreendeudamiento -->
      <div class="col-12 col-md-6 text-center">
        <div class="text-bold">Score sobreendeudamiento</div>
        <VueApexCharts
          v-if="visible"
          class="grafico"
          :key="`sobre-${instanciaId}`"
          type="radialBar"
          width="320"
          height="260"
          :options="opcionesSobreendeudamiento"
          :series="[porcentaje(sobre.valor, ESCALA_SCORE)]"
        />
        <div class="score__pie">
          <span
            v-if="sobre.segmentacion"
            class="chip-moderno"
            :style="estiloChip(colorSobreendeudamiento(sobre.segmentacion))"
          >
            Nivel {{ sobre.segmentacion }}
          </span>
          <div
            v-if="sobre.probabilidad !== null"
            class="text-caption text-grey-8 q-mt-sm"
          >
            Probabilidad de sobreendeudamiento: {{ sobre.probabilidad }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores clave -->
    <div class="row q-col-gutter-md">
      <div
        v-for="k in indicadores"
        :key="k.titulo"
        class="col-12"
        :class="indicadores.length === 4 ? 'col-sm-6 col-lg-3' : 'col-md-4'"
      >
        <div class="kpi" :class="`kpi--${k.tono}`">
          <div class="kpi__titulo">{{ k.titulo }}</div>
          <div class="kpi__valor">{{ k.valor }}</div>
          <div class="kpi__detalle">{{ k.detalle }}</div>
        </div>
      </div>
    </div>

    <!-- Operaciones activas: bancos siempre; cooperativas y casas comerciales si tiene -->
    <template v-for="grupo in gruposOperaciones" :key="grupo.sistema">
      <div class="text-bold q-mt-lg q-mb-sm">
        {{ grupo.titulo }} ({{ grupo.filas.length }})
      </div>
      <tabla-operaciones :operaciones="grupo.filas" />
    </template>

    <!-- Últimas operaciones -->
    <div class="text-bold q-mt-lg q-mb-sm">
      Últimas operaciones 12 meses ({{ recientes.length }})
    </div>
    <essential-table
      v-if="recientes.length"
      :configuracionColumnas="columnasRecientes"
      :datos="recientes"
      :mostrar-header="false"
      :mostrar-footer="false"
      :alto-fijo="false"
      :grid="false"
    />
    <div v-else class="sin-datos">
      Equifax no reporta operaciones otorgadas en los últimos 12 meses.
    </div>

    <!-- Consultas al buró -->
    <div class="text-bold q-mt-lg q-mb-sm">
      Consultas al buró ({{ equifax.consultas_buro.total }} en 12 meses)
    </div>
    <essential-table
      v-if="consultas.length"
      :configuracionColumnas="columnasConsultas"
      :datos="consultas"
      :mostrar-header="false"
      :mostrar-footer="false"
      :alto-fijo="false"
      :grid="false"
    />
    <div v-else class="sin-datos">
      Equifax no reporta consultas al buró en los últimos 12 meses.
    </div>

    <!-- Vencimientos -->
    <div class="text-bold q-mt-lg q-mb-sm">
      Vencimientos actuales o recientes
    </div>
    <campos-lectura :campos="camposVencimientos" />

    <template v-if="porAntiguedad.length">
      <div class="text-bold q-mt-md q-mb-sm">
        Vencido por antigüedad
        <span v-if="vencimientos.fecha_corte" class="text-weight-regular">
          (corte {{ formatearFecha(vencimientos.fecha_corte) }})
        </span>
      </div>
      <essential-table
        :configuracionColumnas="columnasAntiguedad"
        :datos="porAntiguedad"
        :mostrar-header="false"
        :mostrar-footer="false"
        :alto-fijo="false"
        :grid="false"
      />
    </template>
  </seccion-revision>
</template>

<script setup lang="ts">
// Este componente se carga de forma diferida (defineAsyncComponent en la
// página): ApexCharts solo se descarga cuando hay datos de Equifax.
import { computed, onActivated, onBeforeUnmount, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import {
  CampoLectura,
  ClienteRevision,
  DatosEquifax,
  OperacionActiva,
  RevisionCredito,
} from '../../domain/RevisionCredito'
import {
  calificacionScore,
  colorScore,
  colorSobreendeudamiento,
  formatearFecha,
  estiloChip,
  formatearMoneda,
  textoAnios,
} from '../../domain/formato'
import SeccionRevision from './SeccionRevision.vue'
import CamposLectura from './CamposLectura.vue'
import TablaOperaciones from './TablaOperaciones.vue'

const SCORE_MINIMO = 750
// Escala fija de ambos scores (Equifax 0–999)
const ESCALA_SCORE = 999

const props = defineProps<{
  equifax: DatosEquifax
  consultadoAt: string | null
  cliente: ClienteRevision
  relacion: RevisionCredito['relacion_laboral']
}>()

// La sección puede montarse dentro de una pestaña oculta (al abrir una
// revisión desde el historial) o mientras el panel entra con la transición
// de escala de q-tab-panels. ApexCharts mide con getBoundingClientRect, que
// incluye esa transformación, y dibujaría el arco diminuto. Por eso los
// gráficos se crean (o recrean) solo cuando el contenedor es visible y su
// tamaño en pantalla coincide con el del layout (transición terminada).
const contenedorGraficos = ref<HTMLElement | null>(null)
const visible = ref(false)
const instanciaId = ref(0)
let observador: ResizeObserver | null = null
let esperando = 0

function sinTransformacion(el: HTMLElement): boolean {
  return (
    el.offsetWidth > 0 &&
    Math.abs(el.getBoundingClientRect().width - el.offsetWidth) < 1
  )
}

function mostrarCuandoEsteEstable() {
  cancelAnimationFrame(esperando)
  let intentos = 0
  const revisar = () => {
    const el = contenedorGraficos.value
    if (!el || el.offsetWidth === 0) return
    if (sinTransformacion(el) || ++intentos > 90) {
      visible.value = true
      instanciaId.value++
    } else esperando = requestAnimationFrame(revisar)
  }
  esperando = requestAnimationFrame(revisar)
}

onMounted(() => {
  observador = new ResizeObserver(([entrada]) => {
    if (entrada.contentRect.width === 0) visible.value = false
    else if (!visible.value) mostrarCuandoEsteEstable()
  })
  if (contenedorGraficos.value) observador.observe(contenedorGraficos.value)
})
onBeforeUnmount(() => {
  observador?.disconnect()
  cancelAnimationFrame(esperando)
})
// Al volver a la página (keep-alive) o a la pestaña, se redibujan
onActivated(() => {
  visible.value = false
  mostrarCuandoEsteEstable()
})

const sobre = computed(() => props.equifax.score_sobreendeudamiento)
const vencimientos = computed(() => props.equifax.vencimientos)

function porcentaje(valor: number | null, maximo: number): number {
  if (valor === null || !maximo) return 0
  return Math.max(0, Math.min(100, Math.round((valor / maximo) * 1000) / 10))
}

// ApexCharts no resuelve var(--x): se usan colores hex. Las opciones se
// recalculan solo cuando cambia el valor (no en cada render).
function opcionesRadial(color: string, valor: number | null): ApexOptions {
  return {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 900 },
    },
    colors: [color],
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: { size: '64%' },
        track: { background: '#eceff1', strokeWidth: '100%' },
        dataLabels: {
          name: {
            show: true,
            offsetY: 26,
            fontSize: '12px',
            color: '#78909c',
          },
          value: {
            offsetY: -10,
            fontSize: '42px',
            fontWeight: 800,
            color: color,
            formatter: () => (valor === null ? 'N/D' : String(valor)),
          },
        },
      },
    },
    stroke: { lineCap: 'round' },
    labels: [`de ${ESCALA_SCORE}`],
  }
}

const opcionesScore = computed(() =>
  opcionesRadial(
    colorScore(props.equifax.score.valor),
    props.equifax.score.valor
  )
)
const opcionesSobreendeudamiento = computed(() =>
  opcionesRadial(
    colorSobreendeudamiento(sobre.value.segmentacion),
    sobre.value.valor
  )
)

// Ingresos: sueldo de las afiliaciones vigentes del IESS (suma si tiene varios empleadores)
const ingresos = computed(() => {
  const vigentes = props.relacion.iess.filter(
    (a) => a.vigente && a.sueldo !== null
  )
  if (!vigentes.length) return null
  return {
    total: vigentes.reduce((suma, a) => suma + (a.sueldo ?? 0), 0),
    empleadores: vigentes.length,
  }
})

const indicadores = computed(() => {
  const cuota = props.equifax.cuota_mensual
  const lista = [
    {
      titulo: 'Cuota mensual estimada',
      tono: 'morado',
      valor: formatearMoneda(cuota),
      detalle: 'Carga financiera mensual total',
    },
  ]

  const i = ingresos.value
  if (i) {
    lista.push({
      titulo: 'Ingresos mensuales',
      tono: 'verde',
      valor: formatearMoneda(i.total),
      detalle:
        i.empleadores > 1
          ? `Sueldo IESS · ${i.empleadores} empleadores`
          : 'Sueldo registrado en el IESS',
    })
  }

  lista.push(
    {
      titulo: 'Deuda total',
      tono: 'azul',
      valor: formatearMoneda(props.equifax.deuda_total),
      detalle: 'Bancos, cooperativas y casas comerciales',
    },
    {
      titulo: 'Vencido actual',
      tono: 'rojo',
      valor: formatearMoneda(vencimientos.value.vencido_actual),
      detalle: 'Valor vencido a la última fecha de corte',
    }
  )
  return lista
})

const camposVencimientos = computed<CampoLectura[]>(() => {
  const v = vencimientos.value
  return [
    { etiqueta: 'Operaciones impagas', valor: v.operaciones_impagas },
    { etiqueta: 'Monto impago', valor: formatearMoneda(v.monto_impago) },
    { etiqueta: 'Meses con mora (12 meses)', valor: v.meses_con_mora_12m },
    {
      etiqueta: 'Demanda judicial',
      valor: formatearMoneda(v.demanda_judicial),
    },
    {
      etiqueta: 'Cartera castigada',
      valor: formatearMoneda(v.cartera_castigada),
    },
  ]
})

const SISTEMAS: {
  sistema: OperacionActiva['sistema']
  titulo: string
  plural: string
  tono: string
  icono: string
}[] = [
  {
    sistema: 'SB',
    titulo: 'Operaciones activas en bancos',
    plural: 'en bancos',
    tono: 'azul',
    icono: 'bi-bank',
  },
  {
    sistema: 'SEPS',
    titulo: 'Operaciones activas en cooperativas',
    plural: 'en cooperativas',
    tono: 'violeta',
    icono: 'bi-people',
  },
  {
    sistema: 'SICOM',
    titulo: 'Operaciones activas en casas comerciales',
    plural: 'en casas comerciales',
    tono: 'teal',
    icono: 'bi-shop',
  },
]

// "TITULAR" → "Titular"
const capitalizar = (v: string | null) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : '—'

const gruposOperaciones = computed(() =>
  SISTEMAS.map((s) => ({
    ...s,
    filas: props.equifax.operaciones_activas.filter(
      (o) => o.sistema === s.sistema
    ),
  })).filter((g) => g.sistema === 'SB' || g.filas.length > 0)
)

// Perfil del cliente en verde: edad, años afiliado y años de RUC (si están vigentes)
const tagsPerfil = computed(() => {
  const tags: { texto: string; tono: string; icono: string }[] = []
  const { edad } = props.cliente
  if (edad !== null)
    tags.push({ texto: `${edad} años`, tono: 'verde', icono: 'bi-person' })

  const afiliacion = props.relacion.iess[0]
  if (afiliacion?.vigente && afiliacion.anios !== null)
    tags.push({
      texto: `Afiliado ${textoAnios(afiliacion.anios)}`,
      tono: 'verde',
      icono: 'bi-building',
    })

  // Estado de Equifax con prioridad; años desde la base del SRI (considera reinicio)
  const ruc = props.relacion.ruc
  const rucEquifax = props.relacion.ruc_equifax
  const estadoRuc = rucEquifax?.estado ?? ruc?.estado
  const aniosRuc = ruc?.anios ?? rucEquifax?.anios ?? null
  if (estadoRuc === 'ACTIVO' && aniosRuc !== null)
    tags.push({
      texto: `RUC ${textoAnios(aniosRuc)}`,
      tono: 'verde',
      icono: 'bi-shop',
    })

  return tags
})

const tagConsultas = computed(() => {
  const n = props.equifax.consultas_buro.total
  return {
    texto: `${n} ${n === 1 ? 'consulta' : 'consultas'} al buró`,
    tono: 'gris',
    icono: 'bi-search',
  }
})

// Perfil, operaciones y consultas en una sola fila de etiquetas
type Etiqueta = { texto: string; tono: string; icono: string }

const plural = (n: number, uno: string, varios: string) =>
  `${n} ${n === 1 ? uno : varios}`

// Orden por importancia: perfil, alertas (micro, mora, codeudor/garante),
// consultas y, al final, dónde tiene las operaciones
const tagsOperaciones = computed(() => [
  ...tagsPerfil.value,
  ...tagsAlertas.value,
  tagConsultas.value,
  ...tagsSistemas.value,
])

// Microcréditos, mora y operaciones como codeudor o garante
const tagsAlertas = computed(() => {
  const ops = props.equifax.operaciones_activas
  const tags: Etiqueta[] = []

  // Microcréditos activos (cualquier sistema): se destacan en rojo
  const micro = ops.filter((o) =>
    /micro/i.test(
      (o.tipo_credito ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    )
  ).length
  if (micro)
    tags.push({
      texto: plural(micro, 'microcrédito', 'microcréditos'),
      tono: 'rojo',
      icono: 'bi-cash-coin',
    })

  const enMora = ops.filter((o) => o.vencido > 0).length
  if (enMora)
    tags.push({
      texto: `${plural(enMora, 'operación', 'operaciones')} en mora`,
      tono: 'rojo',
      icono: 'bi-exclamation-triangle',
    })

  for (const rol of ['CODEUDOR', 'GARANTE']) {
    const n = ops.filter((o) => o.tipo_deudor === rol).length
    if (n)
      tags.push({
        texto: `${capitalizar(rol)} en ${plural(
          n,
          'operación',
          'operaciones'
        )}`,
        tono: 'naranja',
        icono: 'bi-person-check',
      })
  }

  return tags
})

// Operaciones por sistema (bancos, cooperativas, casas comerciales)
const tagsSistemas = computed<Etiqueta[]>(() => {
  const ops = props.equifax.operaciones_activas
  if (!ops.length)
    return [
      {
        texto: 'Sin operaciones activas',
        tono: 'gris',
        icono: 'bi-dash-circle',
      },
    ]

  return SISTEMAS.map((s) => ({
    s,
    n: ops.filter((o) => o.sistema === s.sistema).length,
  }))
    .filter(({ n }) => n > 0)
    .map(({ s, n }) => ({
      texto: `${plural(n, 'operación', 'operaciones')} ${s.plural}`,
      tono: s.tono,
      icono: s.icono,
    }))
})

const recientes = computed(() =>
  props.equifax.ultimas_operaciones_12m.map((o, i) => ({
    id: i,
    fecha_concesion: formatearFecha(o.fecha_concesion),
    institucion: o.institucion ?? '—',
    tipo_credito: o.tipo_credito ?? '—',
    valor: formatearMoneda(o.valor),
    situacion: o.estado ?? '—',
  }))
)

const consultas = computed(() =>
  props.equifax.consultas_buro.entidades.map((e, i) => ({
    id: i,
    institucion: e.institucion ?? '—',
    consultas: `${e.consultas} ${e.consultas === 1 ? 'mes' : 'meses'}`,
  }))
)

const porAntiguedad = computed(() =>
  vencimientos.value.por_antiguedad.map((r, i) => ({
    id: i,
    rango: r.rango,
    valor: formatearMoneda(r.valor),
  }))
)

type Fila<T extends { value: unknown[] }> = T['value'][number]

const columnasRecientes: ColumnConfig<Fila<typeof recientes>>[] = [
  {
    name: 'fecha_concesion',
    field: 'fecha_concesion',
    label: 'Concesión',
    align: 'left',
  },
  {
    name: 'institucion',
    field: 'institucion',
    label: 'Institución',
    align: 'left',
  },
  { name: 'tipo_credito', field: 'tipo_credito', label: 'Tipo', align: 'left' },
  { name: 'valor', field: 'valor', label: 'Valor', align: 'right' },
  { name: 'situacion', field: 'situacion', label: 'Estado', align: 'left' },
]

const columnasConsultas: ColumnConfig<Fila<typeof consultas>>[] = [
  {
    name: 'institucion',
    field: 'institucion',
    label: 'Institución',
    align: 'left',
  },
  {
    name: 'consultas',
    field: 'consultas',
    label: 'Consultó en',
    align: 'left',
  },
]

const columnasAntiguedad: ColumnConfig<Fila<typeof porAntiguedad>>[] = [
  { name: 'rango', field: 'rango', label: 'Antigüedad', align: 'left' },
  {
    name: 'valor',
    field: 'valor',
    label: 'Vencido',
    align: 'right',
    classes: 'text-negative',
  },
]
</script>

<style scoped lang="scss">
@import './chip-moderno.scss';

.chips-operaciones {
  gap: 8px;
}

// Ancho fijo (320px) centrado: se ve igual en pantalla y cabe en media hoja impresa
.grafico {
  display: flex;
  justify-content: center;
}

.sin-datos {
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(96, 125, 139, 0.06);
  color: #607d8b;
  font-size: 0.85rem;
}

// Indicadores clave: número grande en azul, a la par de los scores
.kpi {
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 18px 20px 16px;
  border: 1px solid #e6e8eb;
  border-radius: 14px;

  // Franja superior y círculo decorativo del color del indicador
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: linear-gradient(90deg, var(--kpi-color), var(--kpi-claro));
  }

  &::after {
    content: '';
    position: absolute;
    right: -24px;
    bottom: -32px;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: var(--kpi-fondo);
  }

  // Paleta de la web: info (#003dff), negative (#c10015) y violeta del acento
  &--morado {
    --kpi-color: #6d28d9;
    --kpi-claro: #a78bfa;
    --kpi-fondo: rgba(109, 40, 217, 0.07);
  }
  &--azul {
    --kpi-color: #003dff;
    --kpi-claro: #6b8cff;
    --kpi-fondo: rgba(0, 61, 255, 0.06);
  }
  &--rojo {
    --kpi-color: #c10015;
    --kpi-claro: #ef5350;
    --kpi-fondo: rgba(193, 0, 21, 0.06);
  }
  // Verde de la web (positive #21ba45), oscurecido para que el número se lea bien
  &--verde {
    --kpi-color: #15803d;
    --kpi-claro: #21ba45;
    --kpi-fondo: rgba(33, 186, 69, 0.07);
  }

  &__titulo {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a99ad;
  }

  &__valor {
    margin-top: 4px;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.15;
    color: var(--kpi-color);
  }

  &__detalle {
    margin-top: 2px;
    font-size: 0.8rem;
    color: #78909c;
  }
}

.score__pie {
  margin-top: -14px;
}
</style>
