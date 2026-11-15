<template>
  <button
    type="button"
    class="tarjeta-periodo"
    :class="{ 'tarjeta-periodo--activa': seleccionada }"
    :aria-pressed="seleccionada"
    @click="emit('seleccionar')"
  >
    <header class="tarjeta-periodo__encabezado">
      <span class="tarjeta-periodo__titulo">{{ titulo }}</span>
      <span class="tarjeta-periodo__fecha">{{ subtitulo }}</span>
    </header>

    <div class="tarjeta-periodo__cuerpo">
      <anillo-progreso
        :porcentaje="pctCalifica"
        :color="colores.califica"
        :tamano="92"
        :grosor="9"
        :etiqueta="
          pctCalifica === null
            ? 'Sin cédulas con resultado en el periodo'
            : `${pctCalifica} % de las cédulas con resultado califica`
        "
      >
        <span class="anillo-porcentaje">
          <numero-animado :valor="pctCalifica" sufijo=" %" />
        </span>
        <span class="anillo-leyenda">califica</span>
      </anillo-progreso>

      <div class="tarjeta-periodo__cifras">
        <div class="cifra-principal">
          <numero-animado :valor="cedulas.califican" />
        </div>
        <div class="texto-secundario">
          {{
            cedulas.califican === 1 ? 'cédula califica' : 'cédulas califican'
          }}
        </div>
        <div class="texto-secundario q-mt-xs">
          de
          <strong class="texto-principal">
            <numero-animado :valor="cedulas.unicas" />
          </strong>
          revisadas
        </div>
      </div>
    </div>

    <footer class="tarjeta-periodo__pie">
      <span class="dato">
        <span class="punto" :style="{ background: colores.no_califica }" />
        <numero-animado :valor="cedulas.no_califican" /> no califican
      </span>
      <span v-if="cedulas.sin_resultado" class="dato">
        <span
          class="punto"
          :style="{ background: colores.pendiente_equifax }"
        />
        <numero-animado :valor="cedulas.sin_resultado" /> sin resultado
      </span>
      <span class="dato dato--revisiones">
        <q-icon name="bi-arrow-repeat" size="13px" />
        <numero-animado :valor="metricas.revisiones.total" />
        {{ metricas.revisiones.total === 1 ? 'revisión' : 'revisiones' }}
      </span>
    </footer>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  COLORES_RESULTADO,
  MetricasPeriodo,
  porcentajeCalifica,
} from '../../../domain/ResumenRevisiones'
import AnilloProgreso from './AnilloProgreso.vue'
import NumeroAnimado from './NumeroAnimado.vue'

const props = defineProps<{
  titulo: string
  subtitulo: string
  metricas: MetricasPeriodo
  seleccionada: boolean
  colores: (typeof COLORES_RESULTADO)['claro']
}>()

const emit = defineEmits<{ (e: 'seleccionar'): void }>()

const cedulas = computed(() => props.metricas.cedulas)
const pctCalifica = computed(() => porcentajeCalifica(cedulas.value))
</script>

<style lang="scss" scoped>
.tarjeta-periodo {
  // Reinicio del botón nativo
  appearance: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: var(--dash-radio);
  background: var(--dash-superficie);
  border: 1px solid var(--dash-borde);
  box-shadow: var(--dash-sombra);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  // Acento superior que aparece al seleccionar
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: var(--dash-acento);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--dash-sombra-elevada);
  }

  &:focus-visible {
    outline: 2px solid var(--dash-acento);
    outline-offset: 2px;
  }

  &--activa {
    border-color: var(--dash-acento-borde);
    background: var(--dash-superficie-activa);

    &::before {
      transform: scaleX(1);
    }
  }

  &__encabezado {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  &__titulo {
    font-weight: 700;
    font-size: 0.95rem;
  }

  &__fecha {
    font-size: 0.75rem;
    color: var(--dash-texto-secundario);
    padding: 2px 10px;
    border-radius: 999px;
    background: var(--dash-chip);
    white-space: nowrap;
  }

  &__cuerpo {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  &__cifras {
    min-width: 0;
  }

  &__pie {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    padding-top: 14px;
    border-top: 1px dashed var(--dash-borde);
    font-size: 0.8rem;
    color: var(--dash-texto-secundario);
  }
}

.cifra-principal {
  font-size: 2.1rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.anillo-porcentaje {
  font-size: 1.15rem;
  font-weight: 800;
}

.anillo-leyenda {
  font-size: 0.68rem;
  color: var(--dash-texto-secundario);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.texto-secundario {
  font-size: 0.82rem;
  color: var(--dash-texto-secundario);
}

.texto-principal {
  color: var(--dash-texto);
}

.dato {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &--revisiones {
    margin-left: auto;
  }
}

.punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tarjeta-periodo,
  .tarjeta-periodo::before {
    transition: none;
  }

  .tarjeta-periodo:hover {
    transform: none;
  }
}
</style>
