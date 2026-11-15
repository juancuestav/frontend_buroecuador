<template>
  <section class="panel-dash">
    <header class="panel-dash__encabezado">
      <div>
        <h3 class="panel-dash__titulo">Revisiones por resultado</h3>
        <p class="panel-dash__subtitulo">
          Cada revisión cuenta, aunque se repita la cédula.
        </p>
      </div>
      <div class="total">
        <span class="total__cifra">
          <numero-animado :valor="revisiones.total" />
        </span>
        <span class="total__leyenda">revisiones</span>
      </div>
    </header>

    <div class="estados">
      <button
        v-for="estado in ESTADOS_RESULTADO"
        :key="estado.clave"
        type="button"
        class="estado"
        :disabled="!revisiones[estado.clave]"
        @click="emit('ver', estado.clave)"
      >
        <span
          class="estado__icono"
          :style="{
            color: colores[estado.clave],
            background: colores[estado.clave] + '1f',
          }"
        >
          <q-icon :name="estado.icono" size="16px" />
        </span>

        <span class="estado__contenido">
          <span class="estado__fila">
            <span class="estado__nombre">
              {{ estado.label }}
              <q-icon
                name="bi-info-circle"
                size="12px"
                class="estado__ayuda"
                @click.stop
              >
                <q-tooltip class="bg-dark" max-width="300px">
                  {{ estado.ayuda }}
                </q-tooltip>
              </q-icon>
            </span>
            <span class="estado__valores">
              <strong>
                <numero-animado :valor="revisiones[estado.clave]" />
              </strong>
              <span class="estado__porcentaje">
                <numero-animado
                  :valor="
                    porcentaje(revisiones[estado.clave], revisiones.total)
                  "
                  sufijo=" %"
                />
              </span>
            </span>
          </span>
          <span class="barra">
            <span
              class="barra__relleno"
              :style="{
                width: ancho(revisiones[estado.clave]),
                background: colores[estado.clave],
              }"
            />
          </span>
        </span>

        <q-icon name="bi-chevron-right" size="14px" class="estado__ir" />
      </button>
    </div>

    <footer class="panel-dash__pie">
      <button
        type="button"
        class="enlace-dash"
        :disabled="!revisiones.total"
        @click="emit('ver', null)"
      >
        Ver todas en el historial
        <q-icon name="bi-arrow-right" size="14px" />
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  COLORES_RESULTADO,
  ESTADOS_RESULTADO,
  EstadoResultado,
  MetricasPeriodo,
  porcentaje,
} from '../../../domain/ResumenRevisiones'
import NumeroAnimado from './NumeroAnimado.vue'

const props = defineProps<{
  revisiones: MetricasPeriodo['revisiones']
  colores: (typeof COLORES_RESULTADO)['claro']
}>()

const emit = defineEmits<{
  // null = todas las revisiones del periodo
  (e: 'ver', resultado: EstadoResultado | null): void
}>()

// Las barras arrancan vacías y crecen al montarse
const montado = ref(false)
onMounted(() => requestAnimationFrame(() => (montado.value = true)))

function ancho(valor: number): string {
  if (!montado.value || !props.revisiones.total) return '0%'
  return `${(valor / props.revisiones.total) * 100}%`
}
</script>

<style lang="scss" scoped>
.total {
  text-align: right;
  line-height: 1;

  &__cifra {
    display: block;
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__leyenda {
    font-size: 0.75rem;
    color: var(--dash-texto-secundario);
  }
}

.estados {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.estado {
  appearance: none;
  font: inherit;
  color: inherit;
  text-align: left;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--dash-hover);

    .estado__ir {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--dash-acento);
    outline-offset: 1px;
  }

  &:disabled {
    cursor: default;
  }

  &__icono {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__contenido {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__fila {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  &__nombre {
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__ayuda {
    margin-left: 4px;
    color: var(--dash-texto-secundario);
  }

  &__valores {
    display: inline-flex;
    align-items: baseline;
    gap: 10px;
    white-space: nowrap;

    strong {
      font-size: 1rem;
    }
  }

  &__porcentaje {
    font-size: 0.78rem;
    color: var(--dash-texto-secundario);
    min-width: 40px;
    text-align: right;
  }

  &__ir {
    color: var(--dash-texto-secundario);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
}

.barra {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: var(--dash-pista);
  overflow: hidden;

  &__relleno {
    display: block;
    height: 100%;
    border-radius: 999px;
    min-width: 0;
    transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
  }
}

@media (prefers-reduced-motion: reduce) {
  .barra__relleno,
  .estado__ir {
    transition: none;
  }
}
</style>
