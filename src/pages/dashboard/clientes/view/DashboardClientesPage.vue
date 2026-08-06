<template>
  <q-page ref="paginaRef" class="dashboard-clientes-page">
    <div class="row justify-between items-center q-mb-md header-row">
      <div>
        <div class="text-h5 text-bold">Panel de Gestión de Clientes</div>
        <p class="text-caption text-grey-8 q-mb-none">
          Resumen mensual de gestión de clientes para asesores comerciales.
        </p>
      </div>
      <div v-if="!estaEnPantallaCompleta" class="row items-center q-gutter-sm">
        <q-btn
          color="primary"
          outline
          unelevated
          no-caps
          @click="alternarPantallaCompleta"
        >
          <q-icon name="bi-arrows-fullscreen" size="xs" class="q-mr-xs"></q-icon
          >Pantalla completa
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
        <div class="area-chart-wrap">
          <transition name="chart-fade">
            <VueApexCharts
              :key="`area-diaria-${instanciaId}`"
              type="area"
              width="100%"
              height="100%"
              :options="opcionesAreaDiaria"
              :series="seriesAreaDiaria"
            />
          </transition>
        </div>
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
              :height="alturaRadial"
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
        <div class="panel-title" style="margin-bottom: 10px">
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
        <div class="cal-grid">
          <div class="cal-weekdays">
            <span
              v-for="(letra, j) in ['D', 'L', 'M', 'M', 'J', 'V', 'S']"
              :key="j"
              class="cal-weekday"
              :class="{ 'cal-weekend': j === 0 || j === 6 }"
              >{{ letra }}</span
            >
          </div>
          <div class="cal-days">
            <div
              v-for="(celda, k) in celdasCalendario"
              :key="k"
              class="cal-day-cell"
              :class="{ 'cal-weekend': k % 7 === 0 || k % 7 === 6 }"
            >
              <template v-if="celda.dia">
                <span
                  class="cal-day-num"
                  :class="{
                    'cal-day-today': celda.esHoy,
                    'cal-day-today-reunion':
                      celda.esHoy && celda.evento === 'reunion',
                    'cal-day-today-corte':
                      celda.esHoy && celda.evento === 'corte',
                  }"
                  >{{ celda.dia }}</span
                >
                <span
                  v-if="celda.evento && !celda.esHoy"
                  class="cal-day-dot"
                  :class="`dot-${celda.evento}`"
                ></span>
              </template>
            </div>
          </div>
        </div>
        <div class="cal-events" v-if="eventosDelMesCalendario.length">
          <div class="cal-events-title">Eventos del mes</div>
          <div
            class="cal-event-row"
            :class="`tipo-${evento.tipo}`"
            v-for="evento in eventosDelMesCalendario"
            :key="evento.dia"
          >
            <span class="cal-event-dot" :class="`dot-${evento.tipo}`"></span>
            <span class="cal-event-label">{{ evento.etiqueta }}</span>
            <span class="cal-event-day">{{ evento.diaTexto }}</span>
          </div>
        </div>
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

        <transition-group tag="div" name="advisor-row" class="advisors-list">
          <div
            v-for="(asesor, i) in datos.asesores"
            :key="`${asesor.id}-${instanciaId}`"
            class="advisor-row"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="advisor-row-identity">
              <span class="advisor-avatar" :style="estiloAvatar(asesor, i)">{{
                obtenerIniciales(asesor.nombre)
              }}</span>
              <span class="advisor-row-name">{{ asesor.nombre }}</span>
            </div>
            <div class="advisor-row-stats">
              <div class="advisor-stat">
                <span class="advisor-stat-value">{{
                  agruparMiles(asesor.cedulasRevisadas)
                }}</span>
                <span class="advisor-stat-label">Revisadas</span>
              </div>
              <div class="advisor-stat">
                <span class="advisor-stat-value">{{
                  agruparMiles(asesor.cedulasIngresadas)
                }}</span>
                <span class="advisor-stat-label">Ingresadas</span>
              </div>
              <div class="advisor-stat advisor-stat-monto">
                <span class="advisor-stat-value">{{
                  formatearMonto(asesor.montoAprobado)
                }}</span>
                <span class="advisor-stat-label">Monto</span>
              </div>
            </div>
          </div>
        </transition-group>

        <div class="advisors-total">
          <span class="advisors-total-label">Total</span>
          <div class="advisor-row-stats">
            <div class="advisor-stat">
              <span class="advisor-stat-value">{{
                agruparMiles(sumaAsesoresRevisadas)
              }}</span>
              <span class="advisor-stat-label">Revisadas</span>
            </div>
            <div class="advisor-stat">
              <span class="advisor-stat-value">{{
                agruparMiles(sumaAsesoresIngresadas)
              }}</span>
              <span class="advisor-stat-label">Ingresadas</span>
            </div>
            <div class="advisor-stat advisor-stat-monto">
              <span class="advisor-stat-value">{{
                formatearMonto(sumaAsesoresMonto)
              }}</span>
              <span class="advisor-stat-label">Monto</span>
            </div>
          </div>
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
          :height="alturaBarras"
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
            :height="alturaTendencia"
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
        <transition name="advisor-row">
          <div
            v-if="asesorDestacado"
            :key="`${asesorDestacado.id}-${instanciaId}`"
            class="advisor-row featured-row"
          >
            <div class="advisor-row-identity">
              <span
                class="advisor-avatar featured-avatar-lg"
                :style="estiloAvatar(asesorDestacado, indiceAsesorDestacado)"
                >{{ obtenerIniciales(asesorDestacado.nombre) }}</span
              >
              <div class="featured-row-info">
                <span class="advisor-row-name">{{
                  asesorDestacado.nombre
                }}</span>
                <span class="badge-top">🏆 Mejor tasa de conversión</span>
              </div>
            </div>
            <div class="advisor-row-stats">
              <div class="advisor-stat">
                <span class="advisor-stat-value">{{
                  agruparMiles(asesorDestacado.cedulasIngresadas)
                }}</span>
                <span class="advisor-stat-label">Ingresados</span>
              </div>
            </div>
          </div>
          <div key="sin-destacado" v-else class="text-caption text-grey-7">
            Agrega asesores en "Detalle de asesores" para ver el destacado.
          </div>
        </transition>
      </div>

      <div class="panel p-updates" v-if="datos.visibilidad.novedades">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Novedades</h3>
        </div>
        <transition-group tag="div" name="advisor-row" class="advisors-list">
          <div
            v-for="(nota, i) in datos.novedades"
            :key="`${i}-${instanciaId}`"
            class="advisor-row update-row"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="advisor-row-identity">
              <span class="advisor-avatar update-avatar">{{ i + 1 }}</span>
              <span class="advisor-row-name">{{ nota }}</span>
            </div>
          </div>
        </transition-group>
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
  obtenerPeriodoActual,
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

// Persistencia: como esta página todavía no tiene backend, "guardar" deja
// los datos en localStorage (como JSON) para que una recarga de la página no
// vuelva a mostrar el dataset de ejemplo.
const CLAVE_ALMACENAMIENTO_DATOS = 'dashboard-clientes:datos'

function cargarDatosGuardados(): DashboardClientesData | null {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO_DATOS)
    return guardado ? (JSON.parse(guardado) as DashboardClientesData) : null
  } catch {
    return null
  }
}

// El período ya no es editable (siempre es "hoy"): se sobreescribe al cargar
// y al guardar sin importar lo que traiga el dataset de ejemplo o lo
// persistido en localStorage, para que nunca quede una fecha vieja.
const datos = reactive<DashboardClientesData>({
  ...(cargarDatosGuardados() ?? crearDatosEjemploDashboardClientes()),
  periodo: obtenerPeriodoActual(),
})

const modalAbierto = ref(false)

function onGuardarDatos(nuevosDatos: DashboardClientesData) {
  Object.assign(datos, nuevosDatos, { periodo: obtenerPeriodoActual() })
  localStorage.setItem(CLAVE_ALMACENAMIENTO_DATOS, JSON.stringify(datos))
  $q.notify({ type: 'positive', message: 'Datos guardados.' })
}

// Pantalla completa: solo del contenido del dashboard (no del navegador
// entero), así al activarla se oculta el menú/toolbar de la app y queda
// mejor para mostrar en una pantalla/TV.
const $q = useQuasar()
const paginaRef = ref<{ $el: HTMLElement } | null>(null)
const estaEnPantallaCompleta = computed(() => $q.fullscreen.isActive)

// Los gráficos tienen alto fijo (vue3-apexcharts no se ajusta solo al
// contenedor). En pantalla completa se reduce ese alto junto con los
// paddings/gaps del CSS de modo compacto de arriba — así el contenido
// natural ya es más bajo de entrada y el zoom de ajuste-a-pantalla (ver
// ajustarZoomPantallaCompleta) necesita achicar mucho menos para que todo
// quepa sin scroll, dejando el texto más grande y legible.
const alturaRadial = computed(() => (estaEnPantallaCompleta.value ? 92 : 120))
const alturaBarras = computed(() => (estaEnPantallaCompleta.value ? 170 : 220))
const alturaTendencia = computed(() =>
  estaEnPantallaCompleta.value ? 150 : 190
)

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
      // nextTick espera el DOM de Vue, pero el resize interno de ApexCharts
      // (disparado por el alto reactivo de los gráficos) puede tardar un
      // poco más — un segundo ajuste 80ms después cubre ese caso sin que
      // se note un salto visual.
      nextTick(ajustarZoomPantallaCompleta)
      setTimeout(ajustarZoomPantallaCompleta, 80)
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

// Array plano (no por semanas): el grid CSS de 7 columnas envuelve cada
// fila automáticamente, así que no hace falta agrupar las celdas a mano.
const celdasCalendario = computed<CeldaCalendario[]>(() => {
  const primerDia = new Date(datos.periodo.anio, mesIndice.value, 1).getDay()
  const totalDias = diasEnMes(mesIndice.value, datos.periodo.anio)
  const dias: (number | null)[] = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]
  while (dias.length % 7 !== 0) dias.push(null)

  return dias.map((dia) => ({
    dia,
    esHoy: dia === datos.periodo.diaActual,
    evento: dia
      ? datos.eventosCalendario.find((e) => e.dia === dia)?.tipo
      : undefined,
  }))
})

const ETIQUETAS_EVENTO_CALENDARIO: Record<TipoEventoCalendario, string> = {
  reunion: 'Reunión de equipo',
  corte: 'Corte de cédulas',
}

interface EventoCalendarioResumen {
  dia: number
  tipo: TipoEventoCalendario
  etiqueta: string
  diaTexto: string
}

const eventosDelMesCalendario = computed<EventoCalendarioResumen[]>(() =>
  [...datos.eventosCalendario]
    .sort((a, b) => a.dia - b.dia)
    .map((evento) => ({
      dia: evento.dia,
      tipo: evento.tipo,
      etiqueta: ETIQUETAS_EVENTO_CALENDARIO[evento.tipo],
      diaTexto: `${evento.dia} de ${mesCorto.value.toLowerCase()}`,
    }))
)

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

// Índice del destacado dentro de `datos.asesores`, para que su avatar use el
// mismo color que muestra en "Detalle de asesores" (estiloAvatar deriva el
// color del índice cuando el asesor no trae `colorAvatar` propio).
const indiceAsesorDestacado = computed(() =>
  datos.asesores.findIndex((a) => a.id === asesorDestacado.value?.id)
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

/* Modo compacto en pantalla completa: reduce paddings/separaciones (no el
   texto, que se deja grande a propósito) para que TODO quepa sin scroll
   vertical con la menor reducción posible del zoom de ajuste-a-pantalla
   (ver ajustarZoomPantallaCompleta en el script) — así el contenido no se
   ve chico en una pantalla grande. */
.dashboard-clientes-page:fullscreen,
.dashboard-clientes-page:-webkit-full-screen {
  padding: 14px 18px 16px;
}
.dashboard-clientes-page:fullscreen .header-row,
.dashboard-clientes-page:-webkit-full-screen .header-row {
  margin-bottom: 10px;
}
.dashboard-clientes-page:fullscreen .stats-row,
.dashboard-clientes-page:-webkit-full-screen .stats-row {
  gap: 10px;
  margin-bottom: 12px;
}
.dashboard-clientes-page:fullscreen .stat-card,
.dashboard-clientes-page:-webkit-full-screen .stat-card {
  padding: 12px 14px 16px;
  min-height: 88px;
}
.dashboard-clientes-page:fullscreen .row-1,
.dashboard-clientes-page:-webkit-full-screen .row-1 {
  gap: 12px;
  margin-bottom: 12px;
}
.dashboard-clientes-page:fullscreen .row-2,
.dashboard-clientes-page:-webkit-full-screen .row-2 {
  gap: 12px;
}
.dashboard-clientes-page:fullscreen .panel,
.dashboard-clientes-page:-webkit-full-screen .panel {
  padding: 12px 14px;
}
.dashboard-clientes-page:fullscreen .panel-title,
.dashboard-clientes-page:-webkit-full-screen .panel-title {
  margin-bottom: 8px;
}
.dashboard-clientes-page:fullscreen .advisor-row,
.dashboard-clientes-page:-webkit-full-screen .advisor-row {
  padding: 8px 14px;
}
.dashboard-clientes-page:fullscreen .advisors-list,
.dashboard-clientes-page:-webkit-full-screen .advisors-list {
  gap: 6px;
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

/* Row 1 — los 3 cards (área, donas, calendario) deben verse siempre a la
   misma altura sin importar el ancho de pantalla. En vez de fijar un alto en
   píxeles (frágil: el ancho de cada columna cambia con el viewport y eso
   reflowea textos/leyendas de forma distinta en cada card), se usa el
   stretch por defecto de CSS Grid: la fila toma el alto del card más alto
   ("Indicadores clave", con contenido intrínseco fijo) y los otros dos se
   estiran para igualarlo — válido en cualquier resolución. */
.row-1 {
  display: grid;
  grid-template-columns: 2fr 1.25fr 1.2fr;
  gap: 18px;
  margin-bottom: 18px;
  align-items: stretch;
}
.row-1 > .panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* El gráfico de área ocupa todo el espacio que el stretch de arriba le deje
   sobre "Indicadores clave" (height:100% en vez de un alto fijo). */
.area-chart-wrap {
  flex: 1 1 auto;
  min-height: 0;
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

/* calendario — número normal + punto de color debajo para los días con
   evento (en vez de "pintar" todo el círculo del día, que competía visualmente
   con "hoy" y se veía más anticuado); "hoy" es el único círculo relleno. */
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f2f8;
  color: var(--text-soft);
  font-size: 13px;
  cursor: default;
}

/* Grilla envuelta en una tarjeta propia, mismo lenguaje visual que
   .donut-card/.advisor-row (fondo suave + borde), en vez de flotar sola
   sobre el fondo blanco del panel. Construida con CSS Grid puro (sin
   <table>): un <table> trae semántica y estilos por defecto de hoja de
   cálculo (líneas de encabezado, celdas pegadas) que es justo lo que se
   quería evitar — con divs se controla cada espaciado a propósito. */
.cal-grid {
  background: #fafafd;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 10px 12px;
}
.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}
.cal-weekday {
  text-align: center;
  color: var(--text-soft);
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.cal-weekday.cal-weekend {
  color: #c3c8d6;
}
.cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 10px;
}
.cal-day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-height: 20px;
}
.cal-day-num {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text);
  font-weight: 500;
}
.cal-weekend .cal-day-num {
  color: #9aa0b1;
}
.cal-day-today {
  background: linear-gradient(135deg, var(--purple), var(--purple-dark));
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(124, 58, 237, 0.35);
}
.cal-day-today-reunion {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3),
    0 3px 8px rgba(124, 58, 237, 0.35);
}
.cal-day-today-corte {
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.3),
    0 3px 8px rgba(124, 58, 237, 0.35);
}
.cal-day-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.cal-day-dot.dot-reunion {
  background: var(--blue);
}
.cal-day-dot.dot-corte {
  background: var(--gold);
}

/* Resumen de los eventos del mes debajo de la grilla, como chips con fondo
   tenue del color del evento — reutiliza los mismos colores de la leyenda de
   arriba para que sea inmediato asociar cada punto. */
.cal-events {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cal-events-title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}
.cal-event-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
}
.cal-event-row.tipo-reunion {
  background: rgba(37, 99, 235, 0.07);
}
.cal-event-row.tipo-corte {
  background: rgba(217, 119, 6, 0.08);
}
.cal-event-row .cal-event-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.cal-event-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  min-width: 0;
  flex: 1 1 auto;
}
.cal-event-day {
  font-size: 11.5px;
  color: var(--text-soft);
  flex-shrink: 0;
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
/* ---------- Detalle de asesores: lista vertical (no grid, no tabla) ----------
   Sin scroll: es un dashboard de pantalla grande sin interacción, así que
   ningún asesor puede quedar escondido — la lista simplemente crece hacia
   abajo, una fila por asesor, todas siempre visibles. */
.advisors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.advisor-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #fafafd;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.advisor-row:hover {
  border-color: var(--purple);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.12);
}
.advisor-row-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1 1 auto;
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
.advisor-row-name {
  font-size: 12.5px;
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.advisor-row-stats {
  display: flex;
  gap: 28px;
  flex-shrink: 0;
}
.advisor-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.advisor-stat-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}
.advisor-stat-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.advisor-stat-monto .advisor-stat-value {
  color: var(--purple-dark);
}

.advisors-total {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 18px;
  background: #f6f4ff;
  border: 1px solid #e4defc;
  border-radius: 12px;
  padding: 10px 16px;
}
.advisors-total-label {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--purple-dark);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}
.advisors-total .advisor-row-stats {
  gap: 32px;
}
.advisors-total .advisor-stat-value {
  color: var(--purple-dark);
}

/* Entrada fluida de izquierda a derecha, en cascada (ver transitionDelay en
   el template). Al salir, position:absolute evita que las demás filas
   "salten" bruscamente — algo que no era posible con filas de tabla. */
.advisor-row-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.advisor-row-enter-from {
  opacity: 0;
  transform: translateX(-26px);
}
.advisor-row-leave-active {
  transition: opacity 0.2s ease;
  position: absolute;
}
.advisor-row-leave-to {
  opacity: 0;
}
.advisor-row-move {
  transition: transform 0.4s ease;
}

/* destacado — misma tarjeta-fila que "Detalle de asesores" (.advisor-row),
   con el avatar un poco más grande para mantener el protagonismo que tenía
   el diseño anterior. */
.featured-row {
  align-items: center;
}
.featured-avatar-lg {
  width: 44px;
  height: 44px;
  font-size: 14px;
}
.featured-row-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.featured-row-info .advisor-row-name {
  white-space: normal;
  font-size: 13.5px;
}
.badge-top {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  background: #ecfdf5;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
}

/* novedades — mismas filas que "Detalle de asesores" (.advisor-row), pero
   con el texto libre y sin truncar (una novedad puede ocupar varias
   líneas), y el número identificador en vez de un avatar con iniciales. */
.update-row {
  align-items: flex-start;
}
.update-row .advisor-row-name {
  white-space: normal;
  font-weight: 500;
  line-height: 1.4;
}
.update-avatar {
  background: var(--indigo);
}

@media (max-width: 1180px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .row-1 {
    grid-template-columns: 1fr;
  }
  /* Con una sola columna cada card ocupa su propia fila del grid, así que
     ya no hay un hermano más alto contra el cual estirarse (align-items:
     stretch deja de tener efecto) — el gráfico de área necesita un alto
     explícito propio en vez de depender del 100% que resolvía bien en el
     layout de 3 columnas de escritorio. */
  .area-chart-wrap {
    flex: none;
    height: 260px;
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
  .advisor-row {
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .advisor-row-stats {
    gap: 16px;
  }
  .donut-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
