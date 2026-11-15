<template>
  <section class="dashboard-revisiones" aria-label="Resumen de revisiones">
    <!-- Encabezado -->
    <header class="dash-encabezado">
      <div class="dash-encabezado__titulo">
        <span class="dash-encabezado__icono">
          <q-icon name="bi-graph-up-arrow" size="18px" />
        </span>
        <div>
          <h2>Resumen de revisiones</h2>
          <p>
            <transition name="fundido" mode="out-in">
              <span v-if="datos" :key="datos.generado_at">
                Actualizado a las {{ horaActualizacion }}
              </span>
              <span v-else-if="!error" key="cargando">Cargando cifras…</span>
            </transition>
          </p>
        </div>
      </div>
      <div class="dash-encabezado__acciones">
        <q-btn
          flat
          round
          dense
          icon="bi-arrow-clockwise"
          class="boton-actualizar"
          :class="{ 'boton-actualizar--girando': cargando }"
          :disable="cargando"
          @click="cargar"
        >
          <q-tooltip class="bg-dark">Actualizar</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="bi-chevron-up"
          class="boton-plegar"
          :class="{ 'boton-plegar--cerrado': !abierto }"
          :aria-expanded="abierto"
          @click="abierto = !abierto"
        >
          <q-tooltip class="bg-dark">
            {{ abierto ? 'Ocultar resumen' : 'Mostrar resumen' }}
          </q-tooltip>
        </q-btn>
      </div>
    </header>

    <q-slide-transition>
      <div v-show="abierto">
        <transition name="fundido">
          <div v-if="error" class="dash-error">
            <q-icon name="bi-exclamation-triangle" size="18px" />
            <span>{{ error }}</span>
            <q-btn flat dense no-caps label="Reintentar" @click="cargar" />
          </div>
        </transition>

        <!-- Primera carga -->
        <div v-if="!datos && cargando" class="dash-esqueleto">
          <div class="grid-periodos">
            <q-skeleton
              v-for="n in 4"
              :key="n"
              height="196px"
              class="esqueleto-tarjeta"
            />
          </div>
          <div class="grid-detalle q-mt-lg">
            <q-skeleton height="280px" class="esqueleto-tarjeta" />
            <q-skeleton height="280px" class="esqueleto-tarjeta" />
          </div>
        </div>

        <transition name="aparecer" appear>
          <div v-if="datos" class="dash-contenido">
            <!-- 1. Periodos: cédulas que califican -->
            <div class="dash-seccion">
              <div class="dash-seccion__titulo">
                <h3>Cédulas que califican</h3>
                <span>Elige un periodo para ver su detalle</span>
              </div>
              <div class="grid-periodos">
                <tarjeta-periodo
                  v-for="(periodo, i) in PERIODOS"
                  :key="periodo"
                  :style="{ '--retraso': `${i * 60}ms` }"
                  class="entrada-escalonada"
                  :titulo="TITULOS[periodo]"
                  :subtitulo="subtituloPeriodo(periodo)"
                  :metricas="datos.resumen[periodo]"
                  :seleccionada="periodoSeleccionado === periodo"
                  :colores="colores"
                  @seleccionar="periodoSeleccionado = periodo"
                />
              </div>
            </div>

            <!-- 2. Detalle del periodo seleccionado -->
            <div class="dash-seccion">
              <div class="dash-seccion__titulo">
                <h3>
                  Detalle ·
                  <transition name="fundido" mode="out-in">
                    <span :key="periodoSeleccionado" class="nombre-periodo">
                      {{ nombrePeriodo(periodoSeleccionado) }}
                    </span>
                  </transition>
                </h3>
                <span>Haz clic en un resultado para verlo en el historial</span>
              </div>
              <div class="grid-detalle">
                <estados-revision
                  :revisiones="metricasSeleccionadas.revisiones"
                  :colores="colores"
                  @ver="verEnHistorial"
                />
                <consumo-equifax
                  :equifax="metricasSeleccionadas.equifax"
                  :colores="colores"
                />
              </div>
            </div>

            <!-- 3. Por asesor (solo quien puede ver todas las revisiones) -->
            <div v-if="datos.por_asesor" class="dash-seccion">
              <tabla-asesores
                :por-asesor="datos.por_asesor"
                :periodo="periodoSeleccionado"
                :nombre-periodo="nombrePeriodo(periodoSeleccionado)"
                :total="metricasSeleccionadas"
                :colores="colores"
              />
            </div>

            <!-- 4. Revisiones por día del mes -->
            <div class="dash-seccion">
              <section class="panel-dash">
                <header class="panel-dash__encabezado">
                  <div>
                    <h3 class="panel-dash__titulo">
                      Revisiones por día · {{ nombreMes }}
                    </h3>
                    <p class="panel-dash__subtitulo">
                      Barras: revisiones por resultado. Línea: consultas reales
                      a Equifax del día.
                    </p>
                  </div>
                </header>
                <grafico-revisiones-mes :serie="datos.serie_mes" />
              </section>
            </div>

            <!-- Cómo se calcula cada cifra -->
            <div class="dash-metodologia">
              <button
                type="button"
                class="enlace-dash"
                :aria-expanded="mostrarMetodologia"
                @click="mostrarMetodologia = !mostrarMetodologia"
              >
                <q-icon name="bi-question-circle" size="14px" />
                ¿Cómo se calculan estas cifras?
                <q-icon
                  name="bi-chevron-down"
                  size="12px"
                  class="flecha"
                  :class="{ 'flecha--abierta': mostrarMetodologia }"
                />
              </button>
              <q-slide-transition>
                <ul v-show="mostrarMetodologia">
                  <li>
                    <strong>Cédulas:</strong> cada cédula cuenta una sola vez
                    por periodo, con el resultado de su última revisión.
                    <em>No califican</em> incluye las detenidas (una validación
                    fallida nunca permite calificar); <em>sin resultado</em> son
                    las pendientes de Equifax.
                  </li>
                  <li>
                    <strong>% califica:</strong> cédulas que califican sobre las
                    que tienen resultado (califican + no califican).
                  </li>
                  <li>
                    <strong>Revisiones:</strong> cada revisión cuenta, aunque se
                    repita la cédula, con su estado actual (igual que la columna
                    Resultado del historial).
                  </li>
                  <li>
                    <strong>Equifax:</strong> las consultas reales son llamadas
                    que devolvieron un reporte y consumen el servicio. Las
                    reutilizadas tomaron una respuesta de menos de 30 días sin
                    costo. El ahorro es reutilizadas ÷ (reales + reutilizadas).
                  </li>
                  <li>
                    <strong>Periodos:</strong> hora de Ecuador. La semana
                    empieza el lunes y el mes el día 1; todos llegan hasta
                    ahora.
                  </li>
                </ul>
              </q-slide-transition>
            </div>
          </div>
        </transition>
      </div>
    </q-slide-transition>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import {
  COLORES_RESULTADO,
  EstadoResultado,
  PERIODOS,
  PeriodoResumen,
  ResumenRevisiones,
} from '../../domain/ResumenRevisiones'
import { obtenerMensajeError } from '../../domain/formato'
import TarjetaPeriodo from './dashboard/TarjetaPeriodo.vue'
import EstadosRevision from './dashboard/EstadosRevision.vue'
import ConsumoEquifax from './dashboard/ConsumoEquifax.vue'
import TablaAsesores from './dashboard/TablaAsesores.vue'

// ApexCharts (pesado) solo se descarga cuando se muestra el resumen
const GraficoRevisionesMes = defineAsyncComponent(
  () => import('./dashboard/GraficoRevisionesMes.vue')
)

const emit = defineEmits<{
  // Aplica en el historial los filtros que reproducen una cifra
  (
    e: 'ver-en-historial',
    filtro: { resultado: EstadoResultado | null; desde: string | null }
  ): void
}>()

const $q = useQuasar()
const axios = AxiosHttpRepository.getInstance()

const abierto = ref(true)
const cargando = ref(false)
const error = ref<string | null>(null)
const datos = ref<ResumenRevisiones | null>(null)
const periodoSeleccionado = ref<PeriodoResumen>('mes')
const mostrarMetodologia = ref(false)

async function cargar() {
  if (cargando.value) return
  cargando.value = true
  error.value = null
  try {
    const response: any = await axios.get(
      axios.getEndpoint(endpoints.revision_creditos_resumen)
    )
    datos.value = response.data
  } catch (e: any) {
    error.value = obtenerMensajeError(e, 'No se pudo cargar el resumen.')
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
defineExpose({ cargar })

const colores = computed(
  () => COLORES_RESULTADO[$q.dark.isActive ? 'oscuro' : 'claro']
)

const metricasSeleccionadas = computed(
  () => (datos.value as ResumenRevisiones).resumen[periodoSeleccionado.value]
)

/*************
 * Textos de periodos
 *************/
const TITULOS: Record<PeriodoResumen, string> = {
  hoy: 'Hoy',
  semana: 'Esta semana',
  mes: 'Este mes',
  total: 'Total',
}

// Fechas "AAAA-MM-DD" sin pasar por la zona horaria del navegador
function fecha(desde: string): Date {
  const [a, m, d] = desde.split('-').map(Number)
  return new Date(a, m - 1, d)
}

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1)

const horaActualizacion = computed(
  () => datos.value?.generado_at.substring(11, 16) ?? ''
)

const nombreMes = computed(() => {
  const desde = datos.value?.periodos.mes.desde
  if (!desde) return ''
  return capitalizar(
    fecha(desde).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })
  )
})

function subtituloPeriodo(periodo: PeriodoResumen): string {
  const desde = datos.value?.periodos[periodo].desde
  if (!desde) return 'Histórico'
  const d = fecha(desde)
  if (periodo === 'hoy') {
    return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })
  }
  if (periodo === 'semana') {
    return (
      'Desde el ' +
      d.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric' })
    )
  }
  return capitalizar(d.toLocaleDateString('es-EC', { month: 'long' }))
}

function nombrePeriodo(periodo: PeriodoResumen): string {
  if (periodo === 'total') return 'total histórico'
  if (periodo === 'mes') return nombreMes.value
  return TITULOS[periodo].toLowerCase()
}

function verEnHistorial(resultado: EstadoResultado | null) {
  emit('ver-en-historial', {
    resultado,
    desde: datos.value?.periodos[periodoSeleccionado.value].desde ?? null,
  })
}
</script>

<!-- Tokens y piezas compartidas por los componentes del resumen (sin scoped) -->
<style lang="scss">
.dashboard-revisiones {
  --dash-radio: 16px;
  --dash-texto: #1a192e;
  --dash-texto-secundario: #6b6e8a;
  --dash-superficie: rgba(255, 255, 255, 0.72);
  --dash-superficie-activa: #ffffff;
  --dash-borde: #e2e4ec;
  --dash-sombra: 0 1px 2px rgba(26, 25, 46, 0.04),
    0 8px 22px -14px rgba(26, 25, 46, 0.18);
  --dash-sombra-elevada: 0 2px 6px rgba(26, 25, 46, 0.06),
    0 18px 36px -16px rgba(26, 25, 46, 0.3);
  --dash-acento: #1a192e;
  --dash-acento-borde: rgba(26, 25, 46, 0.38);
  --dash-acento-suave: rgba(81, 84, 122, 0.12);
  --dash-chip: rgba(81, 84, 122, 0.07);
  --dash-pista: rgba(81, 84, 122, 0.12);
  --dash-hover: rgba(81, 84, 122, 0.06);
  --dash-alerta: #b7791f;
  --dash-alerta-fondo: rgba(230, 165, 64, 0.16);

  color: var(--dash-texto);
  margin-bottom: 28px;
}

.body--dark .dashboard-revisiones {
  --dash-texto: #eceef6;
  --dash-texto-secundario: #a9abbe;
  --dash-superficie: rgba(255, 255, 255, 0.04);
  --dash-superficie-activa: rgba(255, 255, 255, 0.08);
  --dash-borde: rgba(255, 255, 255, 0.1);
  --dash-sombra: 0 8px 22px -14px rgba(0, 0, 0, 0.6);
  --dash-sombra-elevada: 0 18px 36px -16px rgba(0, 0, 0, 0.75);
  --dash-acento: #a5a8f0;
  --dash-acento-borde: rgba(165, 168, 240, 0.55);
  --dash-acento-suave: rgba(165, 168, 240, 0.16);
  --dash-chip: rgba(255, 255, 255, 0.05);
  --dash-pista: rgba(255, 255, 255, 0.08);
  --dash-hover: rgba(255, 255, 255, 0.05);
  --dash-alerta: #e6a540;
  --dash-alerta-fondo: rgba(230, 165, 64, 0.14);
}

.dashboard-revisiones {
  // Panel base de cada bloque
  .panel-dash {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px;
    border-radius: var(--dash-radio);
    background: var(--dash-superficie);
    border: 1px solid var(--dash-borde);
    box-shadow: var(--dash-sombra);

    &__encabezado {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;

      &--envolver {
        flex-wrap: wrap;
      }
    }

    &__titulo {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3;
    }

    &__subtitulo {
      margin: 4px 0 0;
      font-size: 0.8rem;
      color: var(--dash-texto-secundario);
    }

    &__pie {
      margin-top: auto;
    }
  }

  // Botón con aspecto de enlace
  .enlace-dash {
    appearance: none;
    font: inherit;
    border: 0;
    background: transparent;
    padding: 4px 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--dash-acento);
    transition: gap 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
      gap: 10px;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }

    &:focus-visible {
      outline: 2px solid var(--dash-acento);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  // Control segmentado
  .selector-dash {
    display: inline-flex;
    padding: 4px;
    gap: 2px;
    border-radius: 999px;
    background: var(--dash-chip);
    border: 1px solid var(--dash-borde);

    &__opcion {
      appearance: none;
      font: inherit;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: transparent;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--dash-texto-secundario);
      transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        color: var(--dash-texto);
      }

      &--activa {
        background: var(--dash-superficie-activa);
        color: var(--dash-texto);
        box-shadow: 0 1px 3px rgba(26, 25, 46, 0.12);
      }

      &:focus-visible {
        outline: 2px solid var(--dash-acento);
        outline-offset: 1px;
      }
    }
  }

  .vacio-dash {
    padding: 28px 16px;
    text-align: center;
    color: var(--dash-texto-secundario);
    font-size: 0.85rem;
  }
}
</style>

<style lang="scss" scoped>
.dash-encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  &__titulo {
    display: flex;
    align-items: center;
    gap: 14px;

    h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      line-height: 1.3;
    }

    p {
      margin: 2px 0 0;
      font-size: 0.8rem;
      color: var(--dash-texto-secundario);
      min-height: 1.2em;
    }
  }

  &__icono {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--dash-acento);
    background: var(--dash-acento-suave);
  }

  &__acciones {
    display: flex;
    gap: 4px;
  }
}

.boton-actualizar--girando :deep(.q-icon) {
  animation: girar 0.9s linear infinite;
}

.boton-plegar :deep(.q-icon) {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.boton-plegar--cerrado :deep(.q-icon) {
  transform: rotate(180deg);
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

.dash-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  color: #b3263f;
  background: rgba(211, 64, 94, 0.08);
  border: 1px solid rgba(211, 64, 94, 0.22);
}

.dash-seccion {
  & + & {
    margin-top: 28px;
  }

  &__titulo {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px 16px;
    margin-bottom: 14px;

    h3 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
    }

    span:not(.nombre-periodo) {
      font-size: 0.8rem;
      color: var(--dash-texto-secundario);
    }
  }
}

.nombre-periodo {
  display: inline-block;
}

.grid-periodos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.grid-detalle {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 16px;
}

@media (max-width: 1279px) {
  .grid-periodos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1023px) {
  .grid-detalle {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 599px) {
  .grid-periodos {
    grid-template-columns: minmax(0, 1fr);
  }

  .dash-encabezado__titulo h2 {
    font-size: 1.05rem;
  }
}

.esqueleto-tarjeta {
  border-radius: var(--dash-radio);
}

.dash-metodologia {
  margin-top: 20px;

  ul {
    margin: 10px 0 0;
    padding: 16px 20px 16px 36px;
    border-radius: 12px;
    background: var(--dash-chip);
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--dash-texto-secundario);

    strong {
      color: var(--dash-texto);
    }
  }

  .flecha {
    transition: transform 0.3s ease;

    &--abierta {
      transform: rotate(180deg);
    }
  }
}

// Entrada escalonada de las tarjetas de periodo (backwards: al terminar no
// fija transform, así el hover de la tarjeta sigue funcionando)
.entrada-escalonada {
  animation: subir 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: var(--retraso, 0ms);
}

@keyframes subir {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

.fundido-enter-active,
.fundido-leave-active {
  transition: opacity 0.2s ease;
}

.fundido-enter-from,
.fundido-leave-to {
  opacity: 0;
}

.aparecer-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.aparecer-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .entrada-escalonada,
  .boton-actualizar--girando :deep(.q-icon) {
    animation: none;
  }

  .aparecer-enter-active,
  .fundido-enter-active,
  .fundido-leave-active {
    transition: none;
  }
}
</style>
