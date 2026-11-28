<template>
  <section class="dashboard-solicitudes" aria-label="Resumen de solicitudes">
    <header class="row items-center no-wrap q-mb-md">
      <span class="icono-titulo"><q-icon name="bi-graph-up-arrow" size="18px" /></span>
      <div class="col">
        <h2 class="titulo">Resumen de solicitudes</h2>
        <p class="subtitulo">{{ puedeVerTodas ? 'Todas las solicitudes enviadas' : 'Sus solicitudes' }} (sin pendientes)</p>
      </div>
      <q-btn
        v-if="puedeGestionar"
        flat
        no-caps
        dense
        icon="bi-sliders"
        label="Parámetros"
        class="q-mr-sm"
        @click="emit('parametros')"
      />
      <q-btn flat round dense icon="bi-arrow-clockwise" :loading="cargando" @click="cargar">
        <q-tooltip class="bg-dark">Actualizar</q-tooltip>
      </q-btn>
      <q-btn flat round dense :icon="abierto ? 'bi-chevron-up' : 'bi-chevron-down'" @click="abierto = !abierto">
        <q-tooltip class="bg-dark">{{ abierto ? 'Ocultar resumen' : 'Mostrar resumen' }}</q-tooltip>
      </q-btn>
    </header>

    <q-slide-transition>
      <div v-show="abierto">
        <div v-if="!datos && cargando" class="row q-col-gutter-md">
          <div v-for="n in 4" :key="n" class="col-6 col-md-3"><q-skeleton height="90px" class="redondeado" /></div>
        </div>

        <div v-if="datos">
          <!-- Estados por periodo -->
          <div class="panel q-mb-md">
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="panel__titulo">Solicitudes por estado</div>
                <div class="panel__subtitulo">{{ datos.periodos[periodo].total }} {{ NOMBRES_PERIODO[periodo] }} · clic para ver en el historial</div>
              </div>
              <div class="selector">
                <button
                  v-for="p in PERIODOS"
                  :key="p"
                  type="button"
                  class="selector__opcion"
                  :class="{ 'selector__opcion--activa': periodo === p }"
                  @click="periodo = p"
                >
                  {{ ETIQUETAS_PERIODO[p] }}
                </button>
              </div>
            </div>
            <div class="grid-estados">
              <button
                v-for="e in datos.estados"
                :key="e.estado"
                type="button"
                class="tarjeta-estado"
                :style="{ '--color': ESTADOS[e.estado].color }"
                @click="emit('ver-en-historial', { estado: e.estado, desde: inicioPeriodo })"
              >
                <q-icon :name="ESTADOS[e.estado].icono" size="18px" class="tarjeta-estado__icono" />
                <span class="tarjeta-estado__numero">{{ datos.periodos[periodo].por_estado[e.estado] }}</span>
                <span class="tarjeta-estado__texto">{{ e.etiqueta }}</span>
              </button>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <!-- Montos y tiempos -->
            <div class="col-12 col-md-4">
              <div class="panel full-height">
                <div class="panel__titulo q-mb-md">Montos y tiempos</div>
                <div class="metrica">
                  <span class="metrica__etiqueta">Total solicitado</span>
                  <span class="metrica__valor">{{ formatearMoneda(datos.montos.solicitado) }}</span>
                </div>
                <div class="metrica">
                  <span class="metrica__etiqueta">Total aprobado</span>
                  <span class="metrica__valor text-positive">{{ formatearMoneda(datos.montos.aprobado) }}</span>
                </div>
                <div class="metrica">
                  <span class="metrica__etiqueta">Tiempo promedio de respuesta</span>
                  <span class="metrica__valor">
                    {{ datos.tiempo_promedio_dias === null ? '—' : `${formatearNumero(datos.tiempo_promedio_dias)} días` }}
                  </span>
                  <span class="metrica__pie">De "Enviado" a Aprobado o Negado</span>
                </div>
              </div>
            </div>
            <!-- Por banco -->
            <div class="col-12 col-md-8">
              <div class="panel full-height">
                <div class="panel__titulo q-mb-md">Por banco</div>
                <div class="row q-col-gutter-md">
                  <div v-for="b in datos.por_banco" :key="b.banco" class="col-12 col-sm-6">
                    <div class="banco">
                      <div class="row items-center q-mb-sm">
                        <q-icon name="bi-bank" class="q-mr-sm" />
                        <b class="col">{{ b.nombre }}</b>
                        <span class="text-grey-7">{{ b.total }} solicitudes</span>
                      </div>
                      <q-linear-progress
                        :value="b.tasa_aprobacion === null ? 0 : b.tasa_aprobacion / 100"
                        color="positive"
                        track-color="red-2"
                        rounded
                        size="8px"
                      />
                      <div class="row text-caption text-grey-7 q-mt-xs">
                        <span class="col">{{ b.aprobadas }} aprobadas · {{ b.negadas }} negadas</span>
                        <span>Aprobación: {{ b.tasa_aprobacion === null ? '—' : b.tasa_aprobacion + '%' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Por asesor (solo quien ve todas) -->
          <div v-if="datos.por_asesor" class="panel q-mb-md">
            <div class="panel__titulo q-mb-sm">Solicitudes por asesor</div>
            <q-markup-table flat dense separator="horizontal" class="tabla-asesores">
              <thead>
                <tr>
                  <th class="text-left">Asesor</th>
                  <th v-for="e in datos.estados" :key="e.estado" class="text-center">{{ e.etiqueta }}</th>
                  <th class="text-right">Total</th>
                  <th class="text-right">Solicitado</th>
                  <th class="text-right">Aprobado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!datos.por_asesor.length">
                  <td :colspan="datos.estados.length + 4" class="text-center text-grey-7">Sin solicitudes.</td>
                </tr>
                <tr v-for="(a, i) in datos.por_asesor" :key="i">
                  <td>{{ a.asesor }}</td>
                  <td v-for="e in datos.estados" :key="e.estado" class="text-center">{{ a.por_estado[e.estado] || '·' }}</td>
                  <td class="text-right text-bold">{{ a.total }}</td>
                  <td class="text-right">{{ formatearMoneda(a.monto_solicitado) }}</td>
                  <td class="text-right">{{ formatearMoneda(a.monto_aprobado) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div class="panel">
            <div class="panel__titulo">Este mes</div>
            <div class="panel__subtitulo q-mb-sm">Solicitudes ingresadas y aprobadas por día</div>
            <grafico-solicitudes-mes :serie="datos.serie_mes" />
          </div>
        </div>
      </div>
    </q-slide-transition>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { formatearMoneda, formatearNumero, obtenerMensajeError } from 'pages/revisionCreditos/domain/formato'
import { EstadoSolicitud } from '../../domain/SolicitudCredito'
import { Periodo, ResumenSolicitudes } from '../../domain/ResumenSolicitudes'
import { ESTADOS } from '../../domain/estados'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'

const GraficoSolicitudesMes = defineAsyncComponent(() => import('./GraficoSolicitudesMes.vue'))

const PERIODOS: Periodo[] = ['hoy', 'semana', 'mes', 'total']
const ETIQUETAS_PERIODO: Record<Periodo, string> = { hoy: 'Hoy', semana: 'Semana', mes: 'Mes', total: 'Total' }
const NOMBRES_PERIODO: Record<Periodo, string> = {
  hoy: 'ingresadas hoy',
  semana: 'ingresadas esta semana',
  mes: 'ingresadas este mes',
  total: 'en total',
}

const emit = defineEmits<{
  (e: 'ver-en-historial', filtro: { estado: EstadoSolicitud; desde: string | null }): void
  (e: 'parametros'): void
}>()

const autenticacion = useAuthenticationStore()
const puedeVerTodas = autenticacion.can('ver.solicitudes_credito_todas')
const puedeGestionar = autenticacion.can('gestionar.solicitudes_credito')
const { notificarError } = useNotificaciones()

const datos = ref<ResumenSolicitudes | null>(null)
const cargando = ref(false)
const abierto = ref(true)
const periodo = ref<Periodo>('mes')

// Inicio del periodo (mismo criterio que el backend), para filtrar el historial
const inicioPeriodo = computed(() => {
  const hoy = new Date()
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  switch (periodo.value) {
    case 'hoy':
      return iso(hoy)
    case 'semana': {
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7))
      return iso(lunes)
    }
    case 'mes':
      return iso(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
    default:
      return null
  }
})

async function cargar() {
  cargando.value = true
  try {
    datos.value = await solicitudesApi.resumen()
  } catch (error) {
    notificarError(obtenerMensajeError(error, 'No se pudo cargar el resumen.'))
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
defineExpose({ cargar })
</script>

<style scoped lang="scss">
.dashboard-solicitudes {
  --borde: #e2e4ec;
  --superficie: rgba(255, 255, 255, 0.72);
  --secundario: #6b6e8a;
  margin-bottom: 28px;
}

.body--dark .dashboard-solicitudes {
  --borde: rgba(255, 255, 255, 0.1);
  --superficie: rgba(255, 255, 255, 0.04);
  --secundario: #a9abbe;
}

.icono-titulo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(81, 84, 122, 0.1);
  margin-right: 12px;
}

.titulo {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
}

.subtitulo {
  margin: 0;
  font-size: 0.8rem;
  color: var(--secundario);
}

.redondeado {
  border-radius: 16px;
}

.panel {
  padding: 20px;
  border-radius: 16px;
  background: var(--superficie);
  border: 1px solid var(--borde);
  box-shadow: 0 1px 2px rgba(26, 25, 46, 0.04), 0 8px 22px -14px rgba(26, 25, 46, 0.18);

  &__titulo {
    font-size: 1rem;
    font-weight: 700;
  }

  &__subtitulo {
    font-size: 0.8rem;
    color: var(--secundario);
  }
}

.selector {
  display: inline-flex;
  padding: 4px;
  gap: 2px;
  border-radius: 999px;
  border: 1px solid var(--borde);

  &__opcion {
    appearance: none;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    border: 0;
    background: transparent;
    color: var(--secundario);
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;

    &--activa {
      background: #1a192e;
      color: #fff;
    }
  }
}

.grid-estados {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;

  // Los 8 estados en una fila cuando hay espacio
  @media (min-width: 1280px) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
}

.tarjeta-estado {
  appearance: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
  background: color-mix(in srgb, var(--color) 8%, transparent);
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px -12px var(--color);
  }

  &__icono {
    color: var(--color);
  }

  &__numero {
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1.1;
  }

  &__texto {
    font-size: 0.8rem;
    color: var(--secundario);
  }
}

.metrica {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;

  &__etiqueta {
    font-size: 0.78rem;
    color: var(--secundario);
  }

  &__valor {
    font-size: 1.35rem;
    font-weight: 800;
  }

  &__pie {
    font-size: 0.72rem;
    color: var(--secundario);
  }
}

.banco {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--borde);
}

.tabla-asesores {
  background: transparent;
  overflow-x: auto;
}
</style>
