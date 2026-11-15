<template>
  <section class="panel-dash">
    <header class="panel-dash__encabezado">
      <div>
        <h3 class="panel-dash__titulo">Consumo de Equifax</h3>
        <p class="panel-dash__subtitulo">
          Consultas pagadas frente a respuestas reutilizadas.
        </p>
      </div>
    </header>

    <div class="principal">
      <span
        class="principal__icono"
        :style="{ color: colores.equifax, background: colores.equifax + '1f' }"
      >
        <q-icon name="bi-cloud-check" size="22px" />
      </span>
      <div>
        <div class="principal__cifra">
          <numero-animado :valor="equifax.consultas_exitosas" />
        </div>
        <div class="principal__leyenda">
          consultas reales
          <q-icon name="bi-info-circle" size="12px">
            <q-tooltip class="bg-dark" max-width="300px">
              Llamadas a Equifax que devolvieron un reporte. Son las que
              consumen el servicio.
            </q-tooltip>
          </q-icon>
        </div>
      </div>
    </div>

    <!-- Proporción reales / reutilizadas -->
    <div class="proporcion">
      <div class="proporcion__barra" role="img" :aria-label="textoProporcion">
        <span
          class="proporcion__segmento"
          :style="{
            flexGrow: montado ? equifax.consultas_exitosas : 0,
            background: colores.equifax,
          }"
        />
        <span
          class="proporcion__segmento"
          :style="{
            flexGrow: montado ? equifax.reutilizadas : 0,
            background: colores.equifax + '59',
          }"
        />
      </div>
      <div class="proporcion__leyenda">
        <span>
          <span class="punto" :style="{ background: colores.equifax }" />
          Pagadas
        </span>
        <span>
          <span class="punto" :style="{ background: colores.equifax + '59' }" />
          Reutilizadas
        </span>
        <span class="proporcion__ahorro">
          Ahorro
          <strong>
            <numero-animado :valor="porcentajeAhorro(equifax)" sufijo=" %" />
          </strong>
        </span>
      </div>
    </div>

    <div class="mini-datos">
      <div class="mini-dato">
        <q-icon name="bi-recycle" size="18px" class="mini-dato__icono" />
        <div>
          <div class="mini-dato__cifra">
            <numero-animado :valor="equifax.reutilizadas" />
          </div>
          <div class="mini-dato__leyenda">
            reutilizadas, sin costo
            <q-icon name="bi-info-circle" size="11px">
              <q-tooltip class="bg-dark" max-width="300px">
                Revisiones que usaron una respuesta de Equifax de la misma
                cédula de menos de 30 días, sin nueva consulta.
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>
      <div
        class="mini-dato"
        :class="{ 'mini-dato--alerta': equifax.intentos_fallidos > 0 }"
      >
        <q-icon
          name="bi-exclamation-triangle"
          size="18px"
          class="mini-dato__icono"
        />
        <div>
          <div class="mini-dato__cifra">
            <numero-animado :valor="equifax.intentos_fallidos" />
          </div>
          <div class="mini-dato__leyenda">
            intentos fallidos
            <q-icon name="bi-info-circle" size="11px">
              <q-tooltip class="bg-dark" max-width="300px">
                Llamadas que fallaron (error o tiempo de espera agotado). Un
                tiempo agotado pudo haberse cobrado si Equifax respondió tarde.
                Se registran desde la activación de la bitácora.
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  COLORES_RESULTADO,
  MetricasPeriodo,
  porcentajeAhorro,
} from '../../../domain/ResumenRevisiones'
import NumeroAnimado from './NumeroAnimado.vue'

const props = defineProps<{
  equifax: MetricasPeriodo['equifax']
  colores: (typeof COLORES_RESULTADO)['claro']
}>()

const montado = ref(false)
onMounted(() => requestAnimationFrame(() => (montado.value = true)))

const textoProporcion = computed(
  () =>
    `${props.equifax.consultas_exitosas} consultas pagadas y ${props.equifax.reutilizadas} reutilizadas`
)
</script>

<style lang="scss" scoped>
.principal {
  display: flex;
  align-items: center;
  gap: 14px;

  &__icono {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__cifra {
    font-size: 2.1rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  &__leyenda {
    font-size: 0.82rem;
    color: var(--dash-texto-secundario);
    margin-top: 4px;
  }
}

.proporcion {
  margin-top: 22px;

  &__barra {
    display: flex;
    gap: 2px;
    height: 10px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--dash-pista);
  }

  &__segmento {
    flex-basis: 0;
    transition: flex-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__leyenda {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 16px;
    margin-top: 10px;
    font-size: 0.8rem;
    color: var(--dash-texto-secundario);

    > span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  &__ahorro {
    margin-left: auto;

    strong {
      color: var(--dash-texto);
      font-size: 0.95rem;
    }
  }
}

.punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.mini-datos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.mini-dato {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: var(--dash-chip);
  transition: background 0.3s ease;

  &__icono {
    color: var(--dash-texto-secundario);
    margin-top: 2px;
  }

  &__cifra {
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.1;
  }

  &__leyenda {
    font-size: 0.75rem;
    color: var(--dash-texto-secundario);
  }

  &--alerta {
    background: var(--dash-alerta-fondo);

    .mini-dato__icono {
      color: var(--dash-alerta);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .proporcion__segmento {
    transition: none;
  }
}
</style>
