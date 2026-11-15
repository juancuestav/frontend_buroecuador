<template>
  <section class="panel-dash">
    <header class="panel-dash__encabezado panel-dash__encabezado--envolver">
      <div>
        <h3 class="panel-dash__titulo">Por asesor · {{ nombrePeriodo }}</h3>
        <p class="panel-dash__subtitulo">
          {{
            atribucion === 'consulto'
              ? 'Cada revisión se atribuye a quien la hizo.'
              : 'Cada revisión se atribuye al asesor al que pertenece.'
          }}
        </p>
      </div>
      <div class="selector-dash" role="group" aria-label="Atribuir revisiones">
        <button
          v-for="opcion in OPCIONES_ATRIBUCION"
          :key="opcion.value"
          type="button"
          class="selector-dash__opcion"
          :class="{
            'selector-dash__opcion--activa': atribucion === opcion.value,
          }"
          :aria-pressed="atribucion === opcion.value"
          @click="atribucion = opcion.value"
        >
          <q-icon :name="opcion.icono" size="14px" />
          {{ opcion.label }}
        </button>
      </div>
    </header>

    <div class="tabla-dash">
      <div class="tabla-dash__contenido">
        <div class="fila-asesor fila-asesor--cabecera">
          <span>Asesor</span>
          <span class="num">Revisiones</span>
          <span class="num">Cédulas</span>
          <span class="num">Califican</span>
          <span class="num">No califican</span>
          <span class="num">% califica</span>
          <span class="num">Equifax</span>
          <span class="num">Reutilizadas</span>
        </div>

        <transition-group name="fila" tag="div" class="filas">
          <div
            v-for="fila in filasVisibles"
            :key="fila.asesor_id"
            class="fila-asesor"
            :class="{
              'fila-asesor--inactiva': !fila.metricas.revisiones.total,
            }"
          >
            <span class="asesor">
              <span class="asesor__avatar">{{ iniciales(fila.asesor) }}</span>
              <span class="asesor__datos">
                <span class="asesor__nombre">{{ fila.asesor }}</span>
                <span class="asesor__barra" aria-hidden="true">
                  <span
                    class="asesor__relleno"
                    :style="{ width: participacion(fila.metricas) }"
                  />
                </span>
              </span>
            </span>
            <span class="num num--fuerte">
              <numero-animado :valor="fila.metricas.revisiones.total" />
            </span>
            <span class="num">
              <numero-animado :valor="fila.metricas.cedulas.unicas" />
              <q-tooltip
                v-if="fila.metricas.cedulas.sin_resultado"
                class="bg-dark"
              >
                Incluye {{ fila.metricas.cedulas.sin_resultado }} sin resultado
                (Equifax pendiente)
              </q-tooltip>
            </span>
            <span class="num">
              <numero-animado :valor="fila.metricas.cedulas.califican" />
            </span>
            <span class="num">
              <numero-animado :valor="fila.metricas.cedulas.no_califican" />
            </span>
            <span class="num">
              <span class="pct">
                <numero-animado
                  :valor="porcentajeCalifica(fila.metricas.cedulas)"
                  sufijo=" %"
                />
                <span class="pct__pista">
                  <span
                    class="pct__relleno"
                    :style="{
                      width: `${
                        porcentajeCalifica(fila.metricas.cedulas) ?? 0
                      }%`,
                      background: colores.califica,
                    }"
                  />
                </span>
              </span>
            </span>
            <span class="num">
              <numero-animado
                :valor="fila.metricas.equifax.consultas_exitosas"
              />
            </span>
            <span class="num">
              <numero-animado :valor="fila.metricas.equifax.reutilizadas" />
            </span>
          </div>
        </transition-group>

        <div v-if="!filasVisibles.length" class="vacio-dash">
          Ningún asesor tiene revisiones en este periodo.
        </div>

        <div class="fila-asesor fila-asesor--total">
          <span class="asesor">
            Total equipo
            <q-icon name="bi-info-circle" size="12px" class="q-ml-xs">
              <q-tooltip class="bg-dark" max-width="300px">
                Una cédula revisada por dos asesores cuenta para cada uno, pero
                una sola vez en el total del equipo.
              </q-tooltip>
            </q-icon>
          </span>
          <span class="num"
            ><numero-animado :valor="total.revisiones.total"
          /></span>
          <span class="num"
            ><numero-animado :valor="total.cedulas.unicas"
          /></span>
          <span class="num"
            ><numero-animado :valor="total.cedulas.califican"
          /></span>
          <span class="num">
            <numero-animado :valor="total.cedulas.no_califican" />
          </span>
          <span class="num">
            <numero-animado
              :valor="porcentajeCalifica(total.cedulas)"
              sufijo=" %"
            />
          </span>
          <span class="num">
            <numero-animado :valor="total.equifax.consultas_exitosas" />
          </span>
          <span class="num">
            <numero-animado :valor="total.equifax.reutilizadas" />
          </span>
        </div>
      </div>
    </div>

    <footer v-if="inactivos" class="panel-dash__pie">
      <button
        type="button"
        class="enlace-dash"
        @click="mostrarInactivos = !mostrarInactivos"
      >
        <q-icon
          :name="mostrarInactivos ? 'bi-eye-slash' : 'bi-eye'"
          size="14px"
        />
        {{
          mostrarInactivos
            ? 'Ocultar asesores sin actividad'
            : `Mostrar ${inactivos} ${
                inactivos === 1 ? 'asesor' : 'asesores'
              } sin actividad`
        }}
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AtribucionAsesor,
  COLORES_RESULTADO,
  FilaAsesor,
  MetricasPeriodo,
  PeriodoResumen,
  porcentajeCalifica,
} from '../../../domain/ResumenRevisiones'
import NumeroAnimado from './NumeroAnimado.vue'

const props = defineProps<{
  porAsesor: Record<AtribucionAsesor, FilaAsesor[]>
  periodo: PeriodoResumen
  nombrePeriodo: string
  total: MetricasPeriodo
  colores: (typeof COLORES_RESULTADO)['claro']
}>()

const OPCIONES_ATRIBUCION: {
  label: string
  value: AtribucionAsesor
  icono: string
}[] = [
  { label: 'Quién consultó', value: 'consulto', icono: 'bi-person-check' },
  { label: 'Pertenece a', value: 'pertenece', icono: 'bi-briefcase' },
]

const atribucion = ref<AtribucionAsesor>('consulto')
const mostrarInactivos = ref(false)

// Más revisiones primero; a igualdad, por nombre
const filas = computed(() =>
  props.porAsesor[atribucion.value]
    .map((fila) => ({
      asesor_id: fila.asesor_id,
      asesor: fila.asesor,
      metricas: fila[props.periodo],
    }))
    .sort(
      (a, b) =>
        b.metricas.revisiones.total - a.metricas.revisiones.total ||
        a.asesor.localeCompare(b.asesor)
    )
)

const inactivos = computed(
  () => filas.value.filter((f) => !f.metricas.revisiones.total).length
)

const filasVisibles = computed(() =>
  mostrarInactivos.value
    ? filas.value
    : filas.value.filter((f) => f.metricas.revisiones.total)
)

const maximo = computed(() =>
  Math.max(1, ...filas.value.map((f) => f.metricas.revisiones.total))
)

// Barra bajo el nombre: revisiones del asesor frente al que más tiene
const participacion = (m: MetricasPeriodo) =>
  `${(m.revisiones.total / maximo.value) * 100}%`

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}
</script>

<style lang="scss" scoped>
.tabla-dash {
  overflow-x: auto;
  margin: 0 -8px;

  &__contenido {
    min-width: 820px;
    padding: 0 8px;
  }
}

.fila-asesor {
  display: grid;
  grid-template-columns: minmax(220px, 2.4fr) repeat(7, minmax(80px, 1fr));
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: background 0.2s ease, opacity 0.3s ease;

  &:not(&--cabecera):not(&--total):hover {
    background: var(--dash-hover);
  }

  &--cabecera {
    padding-block: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--dash-texto-secundario);
  }

  &--inactiva {
    opacity: 0.55;
  }

  &--total {
    margin-top: 6px;
    border-top: 1px solid var(--dash-borde);
    border-radius: 0;
    font-weight: 700;
  }
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;

  &--fuerte {
    font-weight: 700;
  }
}

.asesor {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  &__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--dash-acento);
    background: var(--dash-acento-suave);
    flex-shrink: 0;
  }

  &__datos {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  &__nombre {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__barra {
    display: block;
    height: 4px;
    border-radius: 999px;
    background: var(--dash-pista);
    overflow: hidden;
    max-width: 180px;
  }

  &__relleno {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--dash-acento);
    transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.pct {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  &__pista {
    width: 48px;
    height: 4px;
    border-radius: 999px;
    background: var(--dash-pista);
    overflow: hidden;
  }

  &__relleno {
    display: block;
    height: 100%;
    border-radius: 999px;
    transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

// Reordenamiento y entrada/salida de filas
.fila-move,
.fila-enter-active,
.fila-leave-active {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}

.fila-enter-from,
.fila-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fila-leave-active {
  position: absolute;
  width: calc(100% - 16px);
}

.filas {
  position: relative;
}

@media (prefers-reduced-motion: reduce) {
  .fila-move,
  .fila-enter-active,
  .fila-leave-active,
  .asesor__relleno,
  .pct__relleno {
    transition: none;
  }
}
</style>
