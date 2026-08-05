<template>
  <q-page ref="paginaRef" class="dashboard-clientes-page">
    <div class="row justify-between items-center q-mb-md header-row">
      <div>
        <div class="text-h5 text-bold">Panel de Gestión de Clientes</div>
        <p class="text-caption text-grey-8 q-mb-none">
          Resumen mensual de gestión de clientes para asesores comerciales.
        </p>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-btn
          color="primary"
          outline
          unelevated
          no-caps
          @click="alternarPantallaCompleta"
        >
          <q-icon
            :name="
              estaEnPantallaCompleta
                ? 'bi-fullscreen-exit'
                : 'bi-arrows-fullscreen'
            "
            size="xs"
            class="q-mr-xs"
          ></q-icon
          >{{ estaEnPantallaCompleta ? '' : 'Pantalla completa' }}
        </q-btn>
        <q-btn color="primary" unelevated no-caps @click="modalAbierto = true">
          <q-icon name="bi-pencil-square" size="xs" class="q-mr-xs"></q-icon>
        </q-btn>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-row" v-if="datos.visibilidad.estadisticas">
      <div
        v-for="tarjeta in tarjetasEstadisticas"
        :key="tarjeta.etiqueta"
        class="stat-card"
        :class="tarjeta.color"
      >
        <div class="num">{{ tarjeta.numero }}</div>
        <div class="label">{{ tarjeta.etiqueta }}</div>
        <div class="sub">{{ tarjeta.sub }}</div>
      </div>
    </div>

    <!-- ROW 1 -->
    <div class="row-1">
      <div class="panel" v-if="datos.visibilidad.resumenDiario">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Resumen diario — Ingresados vs. Aprobados</h3>
          <span class="legend">
            <span
              ><span class="dot-sm" style="background: var(--teal)"></span
              >Ingresados</span
            >
            <span
              ><span class="dot-sm" style="background: var(--blue)"></span
              >Aprobados</span
            >
          </span>
        </div>
        <transition name="chart-fade">
          <VueApexCharts
            :key="`area-diaria-${instanciaId}`"
            type="area"
            width="100%"
            height="220"
            :options="opcionesAreaDiaria"
            :series="seriesAreaDiaria"
          />
        </transition>
      </div>

      <div class="panel" v-if="datos.visibilidad.indicadoresClave">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Indicadores clave</h3>
        </div>
        <div class="donut-grid">
          <div
            class="donut-card"
            v-for="indicador in indicadoresClave"
            :key="indicador.titulo"
          >
            <div class="title">{{ indicador.titulo }}</div>
            <VueApexCharts
              :key="`radial-${indicador.titulo}-${instanciaId}`"
              type="radialBar"
              width="100%"
              height="120"
              :options="opcionesRadial(indicador.colorVar)"
              :series="[indicador.pct]"
            />
          </div>
        </div>
      </div>

      <div class="panel" v-if="datos.visibilidad.calendario">
        <div class="cal-head">
          <span class="cal-nav">‹</span>
          <span class="month"
            >{{ datos.periodo.mes }} {{ datos.periodo.anio }}</span
          >
          <span class="cal-nav">›</span>
        </div>
        <div class="panel-title" style="margin-bottom: 8px">
          <span class="legend" style="margin-left: 0">
            <span
              ><span class="dot-sm" style="background: var(--blue)"></span
              >Reunión</span
            >
            <span
              ><span class="dot-sm" style="background: var(--gold)"></span
              >Corte</span
            >
          </span>
        </div>
        <table class="cal">
          <thead>
            <tr>
              <th>D</th>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(semana, i) in matrizCalendario" :key="i">
              <td
                v-for="(celda, j) in semana"
                :key="j"
                :class="{
                  'cal-today': celda.esHoy,
                  'cal-event': celda.evento === 'reunion',
                  'cal-cutoff': celda.evento === 'corte',
                }"
              >
                <span v-if="celda.dia">{{ celda.dia }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ROW 2 -->
    <div class="row-2">
      <div class="panel p-table" v-if="datos.visibilidad.detalleAsesores">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>
            Detalle de asesores — {{ datos.periodo.mes }}
            {{ datos.periodo.anio }}
          </h3>
        </div>

        <div class="table-scroll">
          <table class="advisors">
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Cédulas revisadas</th>
                <th>Cédulas ingresadas</th>
                <th>Monto aprobado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(asesor, i) in datos.asesores" :key="asesor.id">
                <td>
                  <div class="advisor-name">
                    <span
                      class="advisor-avatar"
                      :style="estiloAvatar(asesor, i)"
                      >{{ obtenerIniciales(asesor.nombre) }}</span
                    >
                    <span class="advisor-name-text">{{ asesor.nombre }}</span>
                  </div>
                </td>
                <td>{{ agruparMiles(asesor.cedulasRevisadas) }}</td>
                <td>{{ agruparMiles(asesor.cedulasIngresadas) }}</td>
                <td>{{ formatearMonto(asesor.montoAprobado) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td>Total</td>
                <td>{{ agruparMiles(sumaAsesoresRevisadas) }}</td>
                <td>{{ agruparMiles(sumaAsesoresIngresadas) }}</td>
                <td>{{ formatearMonto(sumaAsesoresMonto) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="table-foot">
          Última actualización manual: {{ ultimaActualizacionTexto }} · usa el
          botón "Editar datos" para modificarlos.
        </div>
      </div>

      <div class="panel p-bar" v-if="datos.visibilidad.comparativoAsesores">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Comparativo de asesores</h3>
          <span class="legend">
            <span
              ><span
                class="dot-sm"
                style="background: var(--purple-pastel)"
              ></span
              >Revisadas</span
            >
            <span
              ><span class="dot-sm" style="background: var(--teal)"></span
              >Ingresadas</span
            >
            <span
              ><span class="dot-sm" style="background: var(--blue)"></span
              >Aprobadas</span
            >
          </span>
        </div>
        <VueApexCharts
          :key="`barras-${instanciaId}`"
          type="bar"
          width="100%"
          height="220"
          :options="opcionesBarras"
          :series="seriesBarras"
        />
      </div>

      <div class="panel p-trend" v-if="datos.visibilidad.tendenciaMonto">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Tendencia de monto aprobado</h3>
        </div>
        <transition name="chart-fade">
          <VueApexCharts
            :key="`tendencia-${instanciaId}`"
            type="area"
            width="100%"
            height="190"
            :options="opcionesTendencia"
            :series="seriesTendencia"
          />
        </transition>
      </div>

      <div class="panel p-featured" v-if="datos.visibilidad.asesorDestacado">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Asesor destacado</h3>
        </div>
        <div class="featured-card" v-if="asesorDestacado">
          <div class="featured-avatar">
            {{ obtenerIniciales(asesorDestacado.nombre) }}
          </div>
          <div class="featured-info">
            <h4>{{ asesorDestacado.nombre }}</h4>
            <div class="role">
              {{ agruparMiles(asesorDestacado.cedulasIngresadas) }} clientes
              ingresados este mes
            </div>
            <span class="badge-top">🏆 Mejor tasa de conversión</span>
          </div>
        </div>
        <div v-else class="text-caption text-grey-7">
          Agrega asesores en "Detalle de asesores" para ver el destacado.
        </div>
      </div>

      <div class="panel p-updates" v-if="datos.visibilidad.novedades">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Novedades</h3>
        </div>
        <ul class="updates-list">
          <li v-for="(nota, i) in datos.novedades" :key="i">
            <span class="n">{{ i + 1 }}</span>
            <span class="update-text">{{ nota }}</span>
          </li>
        </ul>
      </div>
    </div>

    <editar-dashboard-clientes-modal
      v-model="modalAbierto"
      :datos="datos"
      @guardar="onGuardarDatos"
    />
  </q-page>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { ApexOptions } from 'apexcharts'
import { useQuasar } from 'quasar'
import VueApexCharts from 'vue3-apexcharts'
import EditarDashboardClientesModal from 'pages/dashboard/clientes/components/EditarDashboardClientesModal.vue'
import {
  AsesorDashboardClientes,
  crearDatosEjemploDashboardClientes,
  DashboardClientesData,
  MESES_ES,
  PALETA_AVATARES,
  TipoEventoCalendario,
  agruparMiles,
  calcularPorcentaje,
  diasEnMes,
  formatearMonto,
  mesesCortosAnteriores,
  obtenerIniciales,
} from 'pages/dashboard/clientes/domain/DashboardClientes'

// Mismos valores que las variables CSS del tema (--teal, --blue, etc.) —
// ApexCharts necesita colores reales, no puede leer var(--x) para sus cálculos internos.
const COLOR_ORANGE = '#f97316'
const COLOR_PURPLE_PASTEL = '#a78bfa'
const COLOR_TEAL = '#0d9488'
const COLOR_BLUE = '#2563eb'
const COLOR_GOLD = '#d97706'
const COLOR_TEXT_SOFT = '#6b7280'

// Identificador que fuerza a Vue a crear instancias de ApexCharts nuevas
// (en vez de reutilizar las anteriores) cada vez que esta página vuelve a
// mostrarse. MainLayout.vue envuelve las rutas en <keep-alive>, así que al
// navegar a otra página y volver este componente NUNCA se destruye/remonta
// de verdad — solo se "desactiva" y "reactiva" (onDeactivated/onActivated),
// sin volver a ejecutar <script setup>. Por eso una constante fija no sirve:
// hay que regenerar este id explícitamente en onActivated para que el
// binding `:key` de cada gráfico cambie y Vue los recree desde cero.
function generarInstanciaId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
const instanciaId = ref(generarInstanciaId())

const datos = reactive<DashboardClientesData>(
  crearDatosEjemploDashboardClientes()
)

const modalAbierto = ref(false)

function onGuardarDatos(nuevosDatos: DashboardClientesData) {
  Object.assign(datos, nuevosDatos)
}

// Pantalla completa: solo del contenido del dashboard (no del navegador
// entero), así al activarla se oculta el menú/toolbar de la app y queda
// mejor para mostrar en una pantalla/TV.
const $q = useQuasar()
const paginaRef = ref<{ $el: HTMLElement } | null>(null)
const estaEnPantallaCompleta = computed(() => $q.fullscreen.isActive)

function alternarPantallaCompleta() {
  const el = paginaRef.value?.$el as HTMLElement | undefined
  $q.fullscreen.toggle(el).catch(() => {
    $q.notify({
      type: 'negative',
      message: 'El navegador no permitió activar pantalla completa.',
    })
  })
}

// En pantalla completa, todo el dashboard debe caber sin necesidad de hacer
// scroll. El contenido normalmente es más alto que una pantalla (5 tarjetas +
// 3 paneles + 5 paneles), así que se mide su tamaño real y se aplica un
// "zoom" (encoge todo por igual, texto incluido, sin recortar nada) que lo
// ajuste exactamente al alto y ancho disponibles. Nunca amplía más allá del
// 100% si el contenido ya cabe solo.
function ajustarZoomPantallaCompleta() {
  const el = paginaRef.value?.$el as HTMLElement | undefined
  if (!el || !$q.fullscreen.isActive) return

  el.style.zoom = '1'
  void el.offsetHeight // fuerza a medir el tamaño real, sin zoom aplicado

  const factor = Math.min(
    window.innerHeight / el.scrollHeight,
    window.innerWidth / el.scrollWidth,
    1
  )
  el.style.zoom = String(factor)
}

function quitarZoomPantallaCompleta() {
  const el = paginaRef.value?.$el as HTMLElement | undefined
  if (el) el.style.zoom = ''
}

// El usuario puede salir de pantalla completa con Escape sin pasar por
// alternarPantallaCompleta(), así que el ajuste/reset del zoom se maneja
// reactivamente sobre el estado real, no solo al hacer clic en el botón.
watch(
  () => $q.fullscreen.isActive,
  (activo) => {
    if (activo) {
      nextTick(ajustarZoomPantallaCompleta)
    } else {
      quitarZoomPantallaCompleta()
    }
  }
)

function manejarResizePantallaCompleta() {
  if ($q.fullscreen.isActive) ajustarZoomPantallaCompleta()
}
onMounted(() =>
  window.addEventListener('resize', manejarResizePantallaCompleta)
)
onUnmounted(() =>
  window.removeEventListener('resize', manejarResizePantallaCompleta)
)

// Cada gráfico se recarga (se recrea desde cero) una vez por minuto
// mientras esta pantalla está activa — reutiliza el mismo mecanismo del
// :key que fuerza la recreación al volver de otra página (ver
// generarInstanciaId más arriba), en vez de recargar el navegador entero:
// así no se pierde el scroll ni lo que el usuario esté editando en el
// modal. Se detiene si el usuario navega a otra página — de lo contrario,
// gracias al <keep-alive>, el temporizador seguiría corriendo en segundo
// plano sobre una pantalla distinta.
const INTERVALO_RECARGA_MS = 30000
let temporizadorRecarga: ReturnType<typeof setInterval> | null = null

function iniciarRecargaAutomatica() {
  detenerRecargaAutomatica()
  temporizadorRecarga = setInterval(() => {
    instanciaId.value = generarInstanciaId()
  }, INTERVALO_RECARGA_MS)
}

function detenerRecargaAutomatica() {
  if (temporizadorRecarga) {
    clearInterval(temporizadorRecarga)
    temporizadorRecarga = null
  }
}

onMounted(iniciarRecargaAutomatica)
onUnmounted(detenerRecargaAutomatica)

// onActivated también se dispara justo después del primer montaje (no solo
// al volver de otra página). Regenerar el id ahí forzaría a los 7 gráficos a
// destruirse y recrearse dos veces seguidas en el primer render, lo cual
// confunde a ApexCharts ("Element not found"). Por eso el id solo se
// regenera a partir de la SEGUNDA activación en adelante — las siguientes,
// que sí corresponden a "volver de otra página" de verdad.
let primeraActivacion = true
onActivated(() => {
  if (!primeraActivacion) {
    instanciaId.value = generarInstanciaId()
  }
  primeraActivacion = false
  iniciarRecargaAutomatica()
})
onDeactivated(detenerRecargaAutomatica)

function sum(valores: number[]): number {
  return valores.reduce((acumulado, valor) => acumulado + valor, 0)
}

// ---- Suma propia de la tabla de asesores (independiente de los indicadores manuales) ----
const sumaAsesoresRevisadas = computed(() =>
  sum(datos.asesores.map((a) => a.cedulasRevisadas))
)
const sumaAsesoresIngresadas = computed(() =>
  sum(datos.asesores.map((a) => a.cedulasIngresadas))
)
const sumaAsesoresMonto = computed(() =>
  sum(datos.asesores.map((a) => a.montoAprobado))
)

// ---- Indicadores clave: siempre calculados a partir de los campos manuales ----
// Perfil apto      = perfilApto / totalClientesPool
// Cédulas revisadas = perfilApto / cedulasAsignadas (meta del mes)
// Clientes ingresados = clientesIngresados / perfilApto
// Tasa de aprobación  = clientesAprobados / clientesIngresados
const pctPerfilApto = computed(() =>
  calcularPorcentaje(datos.perfilApto, datos.totalClientesPool)
)
const pctCedulasRevisadas = computed(() =>
  calcularPorcentaje(datos.perfilApto, datos.cedulasAsignadas)
)
const pctClientesIngresados = computed(() =>
  calcularPorcentaje(datos.clientesIngresados, datos.perfilApto)
)
const pctTasaAprobacion = computed(() =>
  calcularPorcentaje(datos.clientesAprobados, datos.clientesIngresados)
)

// ---- Mes vigente ----
const mesIndice = computed(() => MESES_ES.indexOf(datos.periodo.mes))
const mesCorto = computed(() => datos.periodo.mes.slice(0, 3))

// ---- Stat cards ----
const tarjetasEstadisticas = computed(() => [
  {
    color: 'c-purple',
    etiqueta: `Clientes ${datos.periodo.mes}`,
    numero: agruparMiles(datos.totalClientesPool),
    sub: `${datos.periodo.mes} ${datos.periodo.anio}`,
  },
  {
    color: 'c-orange',
    etiqueta: 'Perfil apto',
    numero: agruparMiles(datos.perfilApto),
    sub: `${pctPerfilApto.value}% del total`,
  },
  {
    color: 'c-teal',
    etiqueta: 'Clientes ingresados',
    numero: agruparMiles(datos.clientesIngresados),
    sub: `${pctClientesIngresados.value}% de perfil apto`,
  },
  {
    color: 'c-blue',
    etiqueta: 'Clientes aprobados',
    numero: agruparMiles(datos.clientesAprobados),
    sub: `${pctTasaAprobacion.value}% de ingresados`,
  },
  {
    color: 'c-gold',
    etiqueta: 'Monto aprobado',
    numero: formatearMonto(datos.montoAprobadoTotal),
    sub: `Acumulado ${datos.periodo.mes.toLowerCase()}`,
  },
])

// ---- Indicadores clave (donas ApexCharts radialBar) ----
const indicadoresClave = computed(() => [
  { titulo: 'Perfil apto', colorVar: COLOR_ORANGE, pct: pctPerfilApto.value },
  {
    titulo: 'Cédulas revisadas',
    colorVar: COLOR_PURPLE_PASTEL,
    pct: pctCedulasRevisadas.value,
  },
  {
    titulo: 'Clientes ingresados',
    colorVar: COLOR_TEAL,
    pct: pctClientesIngresados.value,
  },
  {
    titulo: 'Tasa de aprobación',
    colorVar: COLOR_BLUE,
    pct: pctTasaAprobacion.value,
  },
])

const ANIMACION_BASE = {
  enabled: true,
  easing: 'easeinout' as const,
  speed: 500,
  animateGradually: { enabled: true, delay: 80 },
  dynamicAnimation: { enabled: true, speed: 350 },
}

// Los gráficos tipo 'area'/'line' animan su entrada con una máscara SVG que
// crece de 0 a su ancho final. Esa máscara puede quedar atascada en 0 (el
// gráfico se ve en blanco para siempre) cuando el componente se desmonta y
// se vuelve a montar rápido — por ejemplo, al navegar a otra ruta y volver.
// Para esos dos gráficos se desactivan las animaciones por completo, priorizando
// que siempre se vean sobre el efecto de entrada.
const SIN_ANIMACION = { enabled: false }

// Options por color, creadas UNA sola vez y cacheadas: si se reconstruyera un
// objeto `options` nuevo en cada render, vue3-apexcharts lo interpreta como un
// cambio de configuración y redibuja el gráfico entero sin animar la
// transición — por eso antes las donas no se veían animadas. Solo `series`
// (el array `[pct]`) debe cambiar de referencia; `options` se queda fijo.
const cacheOpcionesRadial = new Map<string, ApexOptions>()
function opcionesRadial(color: string): ApexOptions {
  const cacheada = cacheOpcionesRadial.get(color)
  if (cacheada) return cacheada

  const opciones: ApexOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      animations: ANIMACION_BASE,
    },
    colors: [color],
    plotOptions: {
      radialBar: {
        hollow: { size: '62%' },
        track: { background: '#f1f2f6' },
        dataLabels: {
          name: { show: false },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 700,
            color: '#1e2333',
            offsetY: 6,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    stroke: { lineCap: 'round' },
  }
  cacheOpcionesRadial.set(color, opciones)
  return opciones
}

// ---- Gráfico de área: serie diaria (aleatoria, siempre a beneficio) ----
const OFFSETS_SERIE_DIARIA = [0, 1, 4, 8, 12, 16, 20, 24]

function formatearDiaMes(dia: number, mesIdx: number, anio: number): string {
  const fecha = new Date(anio, mesIdx, dia)
  const d = String(fecha.getDate()).padStart(2, '0')
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}`
}

const etiquetasSerieDiaria = computed(() =>
  datos.serieDiariaRatios.map((_, i) => {
    if (i === 0) return 'Hoy'
    if (i === 1) return 'Ayer'
    return formatearDiaMes(
      datos.periodo.diaActual - OFFSETS_SERIE_DIARIA[i],
      mesIndice.value,
      datos.periodo.anio
    )
  })
)

// promedio diario estimado a partir de lo ingresado en lo que va del mes
const promedioDiario = computed(
  () => datos.clientesIngresados / Math.max(datos.periodo.diaActual, 1)
)

const serieDiariaValores = computed(() =>
  datos.serieDiariaRatios.map((ratio) => {
    const ingresados = Math.max(
      1,
      Math.round(promedioDiario.value * ratio.ingresadosFactor)
    )
    const aprobados = Math.max(
      0,
      Math.round(ingresados * ratio.aprobadosFraccion)
    )
    return { ingresados, aprobados }
  })
)

const ingresadosSerieDiaria = computed(() =>
  serieDiariaValores.value.map((p) => p.ingresados)
)
const aprobadosSerieDiaria = computed(() =>
  serieDiariaValores.value.map((p) => p.aprobados)
)

const ejeCategoriasBase: ApexOptions['xaxis'] = {
  labels: { style: { fontSize: '10.5px', colors: COLOR_TEXT_SOFT } },
  axisBorder: { show: false },
  axisTicks: { show: false },
}

const opcionesAreaDiaria = computed<ApexOptions>(() => ({
  chart: { type: 'area', toolbar: { show: false }, animations: SIN_ANIMACION },
  colors: [COLOR_TEAL, COLOR_BLUE],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.05 } },
  xaxis: { ...ejeCategoriasBase, categories: etiquetasSerieDiaria.value },
  yaxis: { labels: { show: false } },
  grid: { show: false },
  legend: { show: false },
  tooltip: { theme: 'light' },
}))

const seriesAreaDiaria = computed(() => [
  { name: 'Ingresados', data: ingresadosSerieDiaria.value },
  { name: 'Aprobados', data: aprobadosSerieDiaria.value },
])

// ---- Barras: comparativo de asesores por mes (histórico aleatorio + mes vigente manual) ----
const serieEquipoCompleta = computed(() => {
  const etiquetas = mesesCortosAnteriores(
    mesIndice.value,
    datos.serieEquipoHistoricaRatios.length
  )
  const historico = datos.serieEquipoHistoricaRatios.map((ratio, i) => ({
    mes: etiquetas[i],
    revisadas: Math.round(datos.perfilApto * ratio.revisadasRatio),
    ingresadas: Math.round(datos.clientesIngresados * ratio.ingresadasRatio),
    aprobadas: Math.round(datos.clientesAprobados * ratio.aprobadasRatio),
  }))
  return [
    ...historico,
    {
      mes: mesCorto.value,
      revisadas: datos.perfilApto,
      ingresadas: datos.clientesIngresados,
      aprobadas: datos.clientesAprobados,
    },
  ]
})

const opcionesBarras = computed<ApexOptions>(() => ({
  chart: { type: 'bar', toolbar: { show: false }, animations: ANIMACION_BASE },
  colors: [COLOR_PURPLE_PASTEL, COLOR_TEAL, COLOR_BLUE],
  plotOptions: {
    bar: {
      columnWidth: '55%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    ...ejeCategoriasBase,
    categories: serieEquipoCompleta.value.map((m) => m.mes),
    labels: { style: { fontSize: '11px', colors: COLOR_TEXT_SOFT } },
  },
  yaxis: { labels: { show: false } },
  grid: { show: false },
  legend: { show: false },
  tooltip: { theme: 'light' },
}))

const seriesBarras = computed(() => [
  {
    name: 'Revisadas',
    data: serieEquipoCompleta.value.map((m) => m.revisadas),
  },
  {
    name: 'Ingresadas',
    data: serieEquipoCompleta.value.map((m) => m.ingresadas),
  },
  {
    name: 'Aprobadas',
    data: serieEquipoCompleta.value.map((m) => m.aprobadas),
  },
])

// ---- Tendencia de monto aprobado (histórico aleatorio + mes vigente manual) ----
const serieTendenciaCompleta = computed(() => {
  const etiquetas = mesesCortosAnteriores(
    mesIndice.value,
    datos.serieTendenciaHistoricaRatios.length
  )
  const historico = datos.serieTendenciaHistoricaRatios.map((ratio, i) => ({
    mes: etiquetas[i],
    monto: Math.round(datos.montoAprobadoTotal * ratio),
  }))
  return [
    ...historico,
    { mes: mesCorto.value, monto: datos.montoAprobadoTotal },
  ]
})

const opcionesTendencia = computed<ApexOptions>(() => ({
  chart: { type: 'area', toolbar: { show: false }, animations: SIN_ANIMACION },
  colors: [COLOR_GOLD],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  markers: { size: 4, colors: [COLOR_GOLD], strokeWidth: 0 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
  xaxis: {
    ...ejeCategoriasBase,
    categories: serieTendenciaCompleta.value.map((p) => p.mes),
  },
  yaxis: { labels: { show: false } },
  grid: { show: false },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    y: { formatter: (val: number) => formatearMonto(val) },
  },
}))

const seriesTendencia = computed(() => [
  {
    name: 'Monto aprobado',
    data: serieTendenciaCompleta.value.map((p) => p.monto),
  },
])

// ---- Calendario ----
interface CeldaCalendario {
  dia: number | null
  esHoy: boolean
  evento?: TipoEventoCalendario
}

const matrizCalendario = computed<CeldaCalendario[][]>(() => {
  const primerDia = new Date(datos.periodo.anio, mesIndice.value, 1).getDay()
  const totalDias = diasEnMes(mesIndice.value, datos.periodo.anio)
  const celdas: (number | null)[] = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]
  while (celdas.length % 7 !== 0) celdas.push(null)

  const semanas: CeldaCalendario[][] = []
  for (let i = 0; i < celdas.length; i += 7) {
    semanas.push(
      celdas.slice(i, i + 7).map((dia) => ({
        dia,
        esHoy: dia === datos.periodo.diaActual,
        evento: dia
          ? datos.eventosCalendario.find((e) => e.dia === dia)?.tipo
          : undefined,
      }))
    )
  }
  return semanas
})

// ---- Asesor destacado (mejor tasa ingresadas/revisadas, entre los asesores actuales) ----
const asesorDestacado = computed<AsesorDashboardClientes | null>(() => {
  let mejor: AsesorDashboardClientes | null = null
  let mejorRatio = -1
  for (const asesor of datos.asesores) {
    const ratio = asesor.cedulasRevisadas
      ? asesor.cedulasIngresadas / asesor.cedulasRevisadas
      : 0
    if (ratio > mejorRatio) {
      mejorRatio = ratio
      mejor = asesor
    }
  }
  return mejor
})

const ultimaActualizacionTexto = computed(
  () =>
    `${datos.periodo.diaActual} de ${datos.periodo.mes.toLowerCase()} de ${
      datos.periodo.anio
    }`
)

function estiloAvatar(asesor: AsesorDashboardClientes, indice: number) {
  const color =
    asesor.colorAvatar ?? PALETA_AVATARES[indice % PALETA_AVATARES.length]
  return { background: `var(--${color})` }
}
</script>

<style scoped>
.dashboard-clientes-page {
  --purple: #7c3aed;
  --purple-dark: #5b21b6;
  --purple-pastel: #a78bfa;
  --orange: #f97316;
  --orange-dark: #ea580c;
  --teal: #0d9488;
  --teal-dark: #0f766e;
  --blue: #2563eb;
  --blue-dark: #1d4ed8;
  --gold: #d97706;
  --gold-dark: #b45309;
  --indigo: #4f46e5;
  --indigo-dark: #4338ca;
  --bg: #eef1f7;
  --card: #ffffff;
  --text: #1e2333;
  --text-soft: #6b7280;
  --border: #e7e9f0;
  --radius: 16px;

  background: var(--bg);
  color: var(--text);
  padding: 26px 30px 40px;
}

/* Animación de entrada propia para los gráficos de área (Resumen diario y
   Tendencia de monto aprobado). ApexCharts anima su propia entrada con una
   máscara SVG que crece de 0 a su ancho final, pero esa máscara queda
   atascada en 0 (el gráfico desaparece para siempre) cada vez que el
   componente se recrea — al volver de otra página o en cada refresco
   periódico de 30s. Por eso esos dos gráficos llevan animations:false y en
   su lugar se recrean detrás de este fade/slide en CSS, que sí es 100%
   confiable sin importar cuántas veces se repita. */
.chart-fade-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* El navegador pinta un fondo negro (::backdrop) detrás del elemento en
   pantalla completa por defecto; sin esto se ve negro alrededor/detrás
   del contenido en vez del fondo del dashboard. */
.dashboard-clientes-page:fullscreen,
.dashboard-clientes-page:-webkit-full-screen {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: var(--bg);
}
.dashboard-clientes-page::backdrop,
.dashboard-clientes-page:-webkit-full-screen::backdrop {
  /* ::backdrop no hereda custom properties del elemento, así que va el
     valor literal (mismo que --bg) en vez de var(--bg). */
  background: #eef1f7;
}

/* ---------- Stat cards ---------- */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  padding: 20px 20px 26px;
  color: #fff;
  min-height: 118px;
}
.stat-card::after {
  content: '';
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -38px;
  height: 70px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 50%;
}
.stat-card .num {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}
.stat-card .label {
  font-size: 13px;
  opacity: 0.95;
  margin-top: 6px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}
.stat-card .sub {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 2px;
}
.c-purple {
  background: linear-gradient(135deg, var(--purple), var(--purple-dark));
}
.c-orange {
  background: linear-gradient(135deg, var(--orange), var(--orange-dark));
}
.c-teal {
  background: linear-gradient(135deg, var(--teal), var(--teal-dark));
}
.c-blue {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
}
.c-gold {
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
}

/* ---------- Paneles genéricos ---------- */
.panel {
  background: var(--card);
  border-radius: var(--radius);
  padding: 20px 22px;
  border: 1px solid var(--border);
  min-width: 0;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  row-gap: 6px;
}
.panel-title .bar {
  width: 3px;
  height: 16px;
  background: var(--purple);
  border-radius: 2px;
}
.panel-title h3 {
  font-size: 14.5px;
  margin: 0;
  font-weight: 700;
  min-width: 0;
  overflow-wrap: anywhere;
}
.panel-title .legend {
  margin-left: auto;
  display: flex;
  gap: 14px;
  font-size: 11.5px;
  color: var(--text-soft);
}
.legend .dot-sm {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

/* Row 1 */
.row-1 {
  display: grid;
  grid-template-columns: 2fr 1.25fr 1.2fr;
  gap: 18px;
  margin-bottom: 18px;
  align-items: start;
}

.donut-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}
.donut-card {
  background: #fafafd;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 0;
  overflow: hidden;
}
.donut-card > div[id^='apexcharts'] {
  width: 100% !important;
  max-width: 100%;
}
.donut-card .title {
  font-size: 12px;
  color: var(--text-soft);
  margin-bottom: 4px;
  font-weight: 600;
}

/* calendario */
.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.cal-head .month {
  font-weight: 700;
  color: var(--purple);
  font-size: 14px;
  text-transform: uppercase;
}
.cal-nav {
  color: var(--text-soft);
  font-size: 13px;
  cursor: default;
}
table.cal {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
table.cal th {
  color: var(--text-soft);
  font-weight: 600;
  padding: 4px 0;
  font-size: 11px;
}
table.cal td {
  text-align: center;
  padding: 6px 0;
  color: var(--text);
}
table.cal td span {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.cal-today span {
  background: var(--purple);
  color: #fff;
  font-weight: 700;
}
.cal-event span {
  background: var(--blue);
  color: #fff;
  font-weight: 700;
}
.cal-cutoff span {
  background: var(--gold);
  color: #fff;
  font-weight: 700;
}

/* Row 2 */
.row-2 {
  display: grid;
  grid-template-columns: 2fr 1.25fr 1.2fr;
  grid-template-areas:
    'tabla barras destacado'
    'tabla tendencia novedades';
  gap: 18px;
}
.p-table {
  grid-area: tabla;
}
.p-bar {
  grid-area: barras;
}
.p-trend {
  grid-area: tendencia;
}
.p-featured {
  grid-area: destacado;
}
.p-updates {
  grid-area: novedades;
}

.manual-note {
  background: #fffbea;
  border: 1px dashed #f3d98b;
  color: #92400e;
  font-size: 11.5px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
}
table.advisors {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
table.advisors th {
  text-align: left;
  font-size: 11.5px;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 8px 6px;
  border-bottom: 2px solid var(--border);
}
table.advisors td {
  padding: 11px 6px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
table.advisors td:not(:first-child) {
  white-space: nowrap;
}
.advisor-name {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.advisor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.advisor-name-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-foot {
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-soft);
}
.total-row td {
  font-weight: 700;
  background: #f6f4ff;
  border-top: 2px solid var(--purple);
  border-bottom: none !important;
  color: var(--purple-dark);
}

/* trend line */

/* destacado */
.featured-card {
  display: flex;
  gap: 12px;
  align-items: center;
}
.featured-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--teal), var(--blue));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}
.featured-info {
  min-width: 0;
}
.featured-info h4 {
  margin: 0 0 3px;
  font-size: 13.5px;
  overflow-wrap: break-word;
}
.featured-info .role {
  font-size: 11.5px;
  color: var(--text-soft);
  margin-bottom: 6px;
}
.badge-top {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ecfdf5;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
}

/* novedades */
.updates-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 12.5px;
}
.updates-list li {
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 8px;
}
.updates-list li:last-child {
  border-bottom: none;
}
.updates-list .n {
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: var(--indigo);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.updates-list .update-text {
  min-width: 0;
}

.table-scroll {
  overflow-x: auto;
}

@media (max-width: 1180px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .row-1 {
    grid-template-columns: 1fr;
  }
  .row-2 {
    grid-template-columns: 1fr;
    grid-template-areas:
      'tabla'
      'barras'
      'tendencia'
      'destacado'
      'novedades';
  }
}
@media (max-width: 760px) {
  .dashboard-clientes-page {
    padding: 18px 14px 28px;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .donut-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
  }
}
@media (max-width: 480px) {
  .dashboard-clientes-page {
    padding: 16px 10px 26px;
  }
  .stats-row {
    grid-template-columns: 1fr;
  }
  .stat-card .num {
    font-size: 22px;
  }
  .panel {
    padding: 14px;
  }
  table.advisors {
    font-size: 12px;
  }
  .donut-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
