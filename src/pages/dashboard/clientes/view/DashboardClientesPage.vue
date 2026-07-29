<template>
  <q-page class="dashboard-clientes-page">
    <div class="row justify-between items-center q-mb-md header-row">
      <div>
        <div class="text-h5 text-bold">Panel de Gestión de Clientes</div>
        <p class="text-caption text-grey-8 q-mb-none">
          Resumen mensual de gestión de clientes para asesores comerciales.
        </p>
      </div>
      <q-btn color="primary" unelevated no-caps @click="modalAbierto = true">
        <q-icon name="bi-pencil-square" size="xs" class="q-mr-xs"></q-icon
        >Editar datos
      </q-btn>
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
        <div class="chart-wrap">
          <svg viewBox="0 0 640 210" preserveAspectRatio="none">
            <path :d="pathAprobadosDiaria" fill="var(--blue)" opacity="0.28" />
            <path :d="pathIngresadosDiaria" fill="var(--teal)" opacity="0.55" />
            <polyline
              :points="puntosAprobadosDiaria"
              fill="none"
              stroke="var(--blue)"
              stroke-width="2.5"
            />
            <polyline
              :points="puntosIngresadosDiaria"
              fill="none"
              stroke="var(--teal)"
              stroke-width="2.5"
            />
          </svg>
          <div class="chart-labels">
            <span v-for="(etiqueta, i) in etiquetasSerieDiaria" :key="i">{{
              etiqueta
            }}</span>
          </div>
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
            <svg viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#F1F2F6"
                stroke-width="4"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                :stroke="indicador.colorVar"
                stroke-width="4"
                :stroke-dasharray="CIRCUNFERENCIA_DONUT"
                :stroke-dashoffset="calcularDashoffset(indicador.pct)"
                stroke-linecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div class="pct">{{ indicador.pct }}%</div>
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
        <div class="bars">
          <div
            class="bar-group"
            v-for="mes in serieEquipoCompleta"
            :key="mes.mes"
          >
            <div
              class="bar"
              :style="{
                height: alturaBarra(mes.revisadas),
                background: 'var(--purple-pastel)',
              }"
            ></div>
            <div
              class="bar"
              :style="{
                height: alturaBarra(mes.ingresadas),
                background: 'var(--teal)',
              }"
            ></div>
            <div
              class="bar"
              :style="{
                height: alturaBarra(mes.aprobadas),
                background: 'var(--blue)',
              }"
            ></div>
          </div>
        </div>
        <div class="bar-cats">
          <span v-for="mes in serieEquipoCompleta" :key="mes.mes">{{
            mes.mes
          }}</span>
        </div>
      </div>

      <div class="panel p-trend" v-if="datos.visibilidad.tendenciaMonto">
        <div class="panel-title">
          <span class="bar"></span>
          <h3>Tendencia de monto aprobado</h3>
        </div>
        <div class="trend-wrap">
          <svg viewBox="0 0 640 200" preserveAspectRatio="none">
            <path :d="pathTendencia" fill="var(--gold)" opacity="0.25" />
            <polyline
              :points="puntosTendencia"
              fill="none"
              stroke="var(--gold)"
              stroke-width="2.5"
            />
            <circle
              v-for="(punto, i) in puntosCoordTendencia"
              :key="i"
              :cx="punto.x"
              :cy="punto.y"
              r="4"
              fill="var(--gold)"
            />
          </svg>
        </div>
        <div class="chart-labels">
          <span v-for="mes in serieTendenciaCompleta" :key="mes.mes">{{
            mes.mes
          }}</span>
        </div>
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
import { computed, reactive, ref } from 'vue'
import EditarDashboardClientesModal from 'pages/dashboard/clientes/components/EditarDashboardClientesModal.vue'
import {
  AsesorDashboardClientes,
  crearDatosEjemploDashboardClientes,
  DashboardClientesData,
  MESES_ES,
  PALETA_AVATARES,
  TipoEventoCalendario,
  agruparMiles,
  calcularDashoffset,
  calcularPorcentaje,
  CIRCUNFERENCIA_DONUT,
  diasEnMes,
  formatearMonto,
  mesesCortosAnteriores,
  obtenerIniciales,
} from 'pages/dashboard/clientes/domain/DashboardClientes'

const datos = reactive<DashboardClientesData>(
  crearDatosEjemploDashboardClientes()
)

const modalAbierto = ref(false)

function onGuardarDatos(nuevosDatos: DashboardClientesData) {
  Object.assign(datos, nuevosDatos)
}

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

// ---- Indicadores clave (donas) ----
const indicadoresClave = computed(() => [
  {
    titulo: 'Perfil apto',
    colorVar: 'var(--orange)',
    pct: pctPerfilApto.value,
  },
  {
    titulo: 'Cédulas revisadas',
    colorVar: 'var(--purple-pastel)',
    pct: pctCedulasRevisadas.value,
  },
  {
    titulo: 'Clientes ingresados',
    colorVar: 'var(--teal)',
    pct: pctClientesIngresados.value,
  },
  {
    titulo: 'Tasa de aprobación',
    colorVar: 'var(--blue)',
    pct: pctTasaAprobacion.value,
  },
])

// ---- Helpers de coordenadas SVG (compartidos por área y tendencia) ----
function calcularX(indice: number, totalPuntos: number, ancho = 640): number {
  return totalPuntos <= 1 ? 0 : (indice * ancho) / (totalPuntos - 1)
}

function construirPuntos(
  valores: number[],
  y: (v: number) => number,
  ancho = 640
): string {
  return valores
    .map((v, i) => `${calcularX(i, valores.length, ancho)},${y(v)}`)
    .join(' ')
}

function construirPathArea(
  valores: number[],
  y: (v: number) => number,
  ancho: number,
  alto: number
): string {
  const segmentos = valores
    .map((v, i) => `L${calcularX(i, valores.length, ancho)},${y(v)}`)
    .join(' ')
  return `M0,${alto} ${segmentos} L${ancho},${alto} Z`
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

const escalaSerieDiaria = computed(() => {
  const maxValor = Math.max(
    ...serieDiariaValores.value.flatMap((p) => [p.ingresados, p.aprobados])
  )
  return maxValor * 1.15 || 1
})

function ySerieDiaria(v: number): number {
  return 210 * (1 - v / escalaSerieDiaria.value)
}

const pathIngresadosDiaria = computed(() =>
  construirPathArea(ingresadosSerieDiaria.value, ySerieDiaria, 640, 210)
)
const pathAprobadosDiaria = computed(() =>
  construirPathArea(aprobadosSerieDiaria.value, ySerieDiaria, 640, 210)
)
const puntosIngresadosDiaria = computed(() =>
  construirPuntos(ingresadosSerieDiaria.value, ySerieDiaria, 640)
)
const puntosAprobadosDiaria = computed(() =>
  construirPuntos(aprobadosSerieDiaria.value, ySerieDiaria, 640)
)

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

const escalaEquipo = computed(() => {
  const maxValor = Math.max(
    ...serieEquipoCompleta.value.flatMap((m) => [
      m.revisadas,
      m.ingresadas,
      m.aprobadas,
    ])
  )
  return maxValor * 1.12 || 1
})

function alturaBarra(valor: number): string {
  return `${((valor / escalaEquipo.value) * 100).toFixed(1)}%`
}

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

const PAD_SUP_TENDENCIA = 20
const PAD_INF_TENDENCIA = 10
const ALTO_UTIL_TENDENCIA = 200 - PAD_SUP_TENDENCIA - PAD_INF_TENDENCIA

const minMontoTendencia = computed(() =>
  Math.min(...serieTendenciaCompleta.value.map((p) => p.monto))
)
const maxMontoTendencia = computed(() =>
  Math.max(...serieTendenciaCompleta.value.map((p) => p.monto))
)

function yTendencia(v: number): number {
  const rango = maxMontoTendencia.value - minMontoTendencia.value
  return rango === 0
    ? PAD_SUP_TENDENCIA + ALTO_UTIL_TENDENCIA / 2
    : PAD_SUP_TENDENCIA +
        (1 - (v - minMontoTendencia.value) / rango) * ALTO_UTIL_TENDENCIA
}

const puntosCoordTendencia = computed(() =>
  serieTendenciaCompleta.value.map((p, i) => ({
    x: calcularX(i, serieTendenciaCompleta.value.length, 640),
    y: yTendencia(p.monto),
  }))
)

const pathTendencia = computed(() => {
  const segmentos = puntosCoordTendencia.value
    .map((p) => `L${p.x},${p.y}`)
    .join(' ')
  return `M0,200 ${segmentos} L640,200 Z`
})

const puntosTendencia = computed(() =>
  puntosCoordTendencia.value.map((p) => `${p.x},${p.y}`).join(' ')
)

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

.chart-wrap svg {
  width: 100%;
  height: 190px;
  display: block;
}
.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--text-soft);
  margin-top: 6px;
}

.donut-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.donut-card {
  background: #fafafd;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.donut-card .title {
  font-size: 12px;
  color: var(--text-soft);
  margin-bottom: 8px;
  font-weight: 600;
}
.donut-card svg {
  width: 82px;
  height: 82px;
}
.donut-card .pct {
  font-size: 17px;
  font-weight: 700;
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

/* bar chart */
.bars {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  height: 150px;
  padding-top: 6px;
}
.bar-group {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 100%;
}
.bar-group .bar {
  width: 9px;
  border-radius: 4px 4px 0 0;
}
.bar-cats {
  display: flex;
  margin-top: 8px;
}
.bar-cats span {
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: var(--text-soft);
}

/* trend line */
.trend-wrap svg {
  width: 100%;
  height: 130px;
  display: block;
}

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
    grid-template-columns: 1fr 1fr;
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
  .bars {
    height: 120px;
  }
}
</style>
