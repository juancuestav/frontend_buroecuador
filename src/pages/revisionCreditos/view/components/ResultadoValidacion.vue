<template>
  <seccion-revision
    label="Resultado de la revisión"
    :caption="`Revisión #${revision.id} · ${revision.created_at}${
      revision.asesor ? ' · ' + revision.asesor : ''
    }${
      revision.registrado_por
        ? ' (registrada por ' + revision.registrado_por + ')'
        : ''
    }`"
  >
    <!-- Resultado (callout) -->
    <div
      class="callout row items-start no-wrap q-mb-md"
      :class="`callout--${resultado.tono}`"
    >
      <q-icon :name="resultado.icono" size="20px" class="callout__icono" />
      <div class="col">
        <div class="text-subtitle1 text-bold">{{ resultado.titulo }}</div>
        <div class="callout__texto">{{ resultado.subtitulo }}</div>
      </div>
    </div>

    <!-- Datos del cliente (los pasa la página), justo bajo la calificación -->
    <div v-if="$slots['despues-calificacion']" class="q-mb-lg">
      <slot name="despues-calificacion" />
    </div>

    <!-- Validaciones -->
    <div class="text-bold q-mb-sm">Validaciones</div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="(v, i) in revision.validaciones"
        :key="v.clave"
        class="col-12 col-md-6"
      >
        <div class="validacion">
          <div class="row items-center no-wrap">
            <div
              class="validacion__icono"
              :class="`validacion__icono--${ESTADOS[v.estado].tono}`"
            >
              <q-icon :name="ESTADOS[v.estado].icono" size="18px" />
            </div>
            <div class="col validacion__titulo">
              <span class="validacion__paso">Paso {{ i + 1 }}</span>
              {{ v.titulo }}
            </div>
            <span
              class="chip-moderno"
              :class="`chip-moderno--${ESTADOS[v.estado].tono}`"
            >
              {{ ESTADOS[v.estado].texto }}
            </span>
          </div>
          <div class="validacion__detalle">
            {{ v.detalle || 'No se llegó a evaluar.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Análisis generado por el sistema -->
    <label class="block q-mb-sm">Análisis</label>
    <q-input
      :model-value="revision.analisis ?? ''"
      type="textarea"
      autogrow
      input-class="analisis"
      outlined
      disable
      dense
    />

    <div v-if="revision.autorizaciones.length" class="q-mt-md">
      <div
        v-for="(a, i) in revision.autorizaciones"
        :key="i"
        class="text-caption text-orange-9 q-mb-xs"
      >
        <q-icon name="bi-key-fill" class="q-mr-xs" />
        {{ NOMBRE_PASO[a.paso] }}: continuó con código de autorización{{
          a.usuario ? ` (${a.usuario}${a.fecha ? ', ' + a.fecha : ''})` : ''
        }}
      </div>
    </div>

    <!-- Acciones para continuar -->
    <div v-if="revision.puede_continuar" class="row justify-end q-mt-md">
      <q-btn
        v-if="revision.estado === 'detenida'"
        color="warning"
        text-color="black"
        icon="bi-shield-lock"
        label="Ingresar código para continuar"
        no-caps
        unelevated
        :loading="cargando"
        @click="emit('pedir-codigo')"
      />
      <q-btn
        v-if="revision.estado === 'pendiente_equifax'"
        color="primary"
        icon="bi-arrow-repeat"
        label="Reintentar consulta a Equifax"
        no-caps
        unelevated
        :loading="cargando"
        @click="emit('reintentar')"
      />
    </div>
  </seccion-revision>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  EstadoValidacion,
  NOMBRE_PASO,
  RevisionCredito,
} from '../../domain/RevisionCredito'
import SeccionRevision from './SeccionRevision.vue'

const props = defineProps<{ revision: RevisionCredito; cargando?: boolean }>()
const emit = defineEmits<{
  (e: 'pedir-codigo'): void
  (e: 'reintentar'): void
}>()

const ESTADOS: Record<
  EstadoValidacion,
  { icono: string; color: string; tono: string; texto: string }
> = {
  cumple: {
    icono: 'bi-check-circle-fill',
    color: 'positive',
    tono: 'verde',
    texto: 'Cumple',
  },
  no_cumple: {
    icono: 'bi-x-circle-fill',
    color: 'negative',
    tono: 'rojo',
    texto: 'No cumple',
  },
  autorizada: {
    icono: 'bi-key-fill',
    color: 'orange-8',
    tono: 'naranja',
    texto: 'Autorizada con código',
  },
  no_evaluada: {
    icono: 'bi-dash-circle',
    color: 'grey-6',
    tono: 'gris',
    texto: 'No evaluada',
  },
}

const resultado = computed(() => {
  const r = props.revision
  if (r.estado === 'detenida') {
    return {
      tono: 'advertencia',
      icono: 'bi-key-fill',
      titulo: 'Perfil no califica',
      subtitulo: `Revisión detenida en: ${
        NOMBRE_PASO[r.paso_detenido ?? 'ed']
      }. Se requiere código de autorización para continuar.`,
    }
  }
  if (r.estado === 'pendiente_equifax') {
    return {
      tono: 'neutro',
      icono: 'bi-cloud-slash-fill',
      titulo: 'Revisión pendiente',
      subtitulo:
        'No se pudo consultar Equifax. Reintente para completar la validación del score.',
    }
  }
  return r.califica
    ? {
        tono: 'exito',
        icono: 'bi-patch-check-fill',
        titulo: 'Perfil califica',
        subtitulo: 'Cumple todas las validaciones requeridas.',
      }
    : {
        tono: 'error',
        icono: 'bi-x-octagon-fill',
        titulo: 'Perfil no califica',
        subtitulo: 'No cumple todas las validaciones requeridas.',
      }
})
</script>

<style scoped lang="scss">
/* Más aire entre líneas en el análisis (textarea deshabilitado) */
:deep(.analisis) {
  line-height: 1.7;
  padding-top: 8px;
  padding-bottom: 8px;
}

@import './chip-moderno.scss';

// Tarjetas de validación
.validacion {
  height: 100%;
  padding: 14px 16px;
  border: 1px solid #e6e8eb;
  border-radius: 10px;

  &__icono {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    margin-right: 12px;
    border-radius: 50%;

    $tonos: (
      verde: #2e7d32,
      rojo: #d32f2f,
      naranja: #e65100,
      gris: #607d8b,
    );

    @each $nombre, $color in $tonos {
      &--#{$nombre} {
        color: $color;
        background: rgba($color, 0.1);
      }
    }
  }

  &__titulo {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
    padding-right: 12px;
  }

  &__paso {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #90a4ae;
  }

  &__detalle {
    margin-top: 10px;
    padding-left: 46px; // alineado con el título (ícono + margen)
    font-size: 0.875rem;
    line-height: 1.55;
    color: #546e7a;
  }
}

// Callout: fondo tenue, borde fino e ícono del mismo tono
.callout {
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid;

  &__icono {
    margin-top: 2px;
  }

  &__texto {
    font-size: 0.85rem;
    color: #455a64;
    margin-top: 2px;
  }

  $tonos: (
    exito: #2e7d32,
    error: #c62828,
    advertencia: #e65100,
    neutro: #546e7a,
  );

  @each $nombre, $color in $tonos {
    &--#{$nombre} {
      color: $color;
      background: rgba($color, 0.045);
      border-color: rgba($color, 0.22);
    }
  }
}
</style>
