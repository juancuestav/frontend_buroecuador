<template>
  <div>
    <div class="row q-col-gutter-md">
      <div v-for="banco in BANCOS" :key="banco.value" class="col-12 col-sm-6">
        <button
          type="button"
          class="opcion-banco full-width"
          :class="{ 'opcion-banco--activa': seleccionado === banco.value }"
          :disabled="!editable"
          @click="seleccionado = banco.value"
        >
          <span class="opcion-banco__logo">
            <img :src="LOGOS[banco.value]" :alt="banco.label" />
          </span>
          <!-- Check relleno: los bi-* se dibujan con Lucide (solo contorno) -->
          <svg
            v-if="seleccionado === banco.value"
            class="opcion-banco__check"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="11" fill="currentColor" />
            <path
              d="m7.5 12.5 3 3 6-6.5"
              fill="none"
              stroke="#fff"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Requisitos del banco seleccionado (etiquetas del cliente, tal cual).
             Desplegable CSS (grid 0fr → 1fr, ease-in-out): arranca y termina
             suave, y el recorte fijo evita que el margen cambie a mitad de camino. -->
        <div
          class="desplegable"
          :class="{ 'desplegable--abierto': abiertos[banco.value] }"
          :aria-hidden="!abiertos[banco.value]"
        >
          <div class="desplegable__contenido">
            <div class="requisitos q-mt-md">
              <div class="requisitos__pagare row no-wrap items-start">
                <q-icon
                  name="bi-check-circle-fill"
                  size="18px"
                  class="q-mr-sm q-mt-xs"
                />
                <b>{{ REQUISITOS_BANCOS[banco.value].pagare }}</b>
              </div>
              <div
                v-for="grupo in REQUISITOS_BANCOS[banco.value].grupos"
                :key="grupo.titulo"
                class="q-mt-md"
              >
                <div class="text-bold q-mb-xs">{{ grupo.titulo }}</div>
                <ul class="requisitos__lista">
                  <li v-for="item in grupo.items" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-caption text-grey-7 q-mt-md">
      Según el banco cambian los documentos que se piden. La tasa, el plazo
      máximo y el porcentaje de capacidad de pago son los mismos para ambos
      bancos.
    </div>
    <div
      v-if="cambiaConDocumentos"
      class="text-caption text-orange-9 q-mt-sm row items-center no-wrap"
    >
      <q-icon name="bi-exclamation-triangle" class="q-mr-xs" />
      Al cambiar de banco se quitarán los documentos que el nuevo banco no pide.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { Banco, BANCOS, SolicitudCredito } from '../../domain/SolicitudCredito'
import { REQUISITOS_BANCOS } from '../../domain/requisitosBancos'
import logoGuayaquil from 'src/assets/bancos/guayaquil.png'
import logoPichincha from 'src/assets/bancos/pichincha.svg'

const LOGOS: Record<Banco, string> = {
  GUAYAQUIL: logoGuayaquil,
  PICHINCHA: logoPichincha,
}

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()
const { notificarAdvertencia } = useNotificaciones()

const seleccionado = ref<Banco | null>(props.solicitud.banco)

/*
 * Requisitos abiertos. Al cambiar de banco, el nuevo se abre y el anterior se
 * cierra recién cuando el nuevo terminó: si se animan a la vez en columnas
 * vecinas, la fila toma el alto del mayor y el contenido de abajo sube y baja.
 */
// Igual que la transición de .desplegable (ms)
const DURACION = 300
const abiertos = reactive<Record<Banco, boolean>>({
  GUAYAQUIL: props.solicitud.banco === 'GUAYAQUIL',
  PICHINCHA: props.solicitud.banco === 'PICHINCHA',
})
let cierre: ReturnType<typeof setTimeout> | undefined
watch(seleccionado, (nuevo, anterior) => {
  clearTimeout(cierre)
  if (nuevo) abiertos[nuevo] = true
  cierre = setTimeout(
    () => {
      for (const banco of Object.keys(abiertos) as Banco[]) {
        if (banco !== seleccionado.value) abiertos[banco] = false
      }
    },
    anterior ? DURACION : 0
  )
})
onBeforeUnmount(() => clearTimeout(cierre))

const cambiaConDocumentos = computed(
  () =>
    !!props.solicitud.banco &&
    seleccionado.value !== props.solicitud.banco &&
    props.solicitud.documentos.some((d) => d.tiene_archivo)
)

async function obtenerDatos() {
  if (!seleccionado.value) {
    notificarAdvertencia('Elija el banco.')
    return null
  }
  return { banco: seleccionado.value }
}

defineExpose({ obtenerDatos })
</script>

<style scoped lang="scss">
// Requisitos: se despliegan animando la fila del grid (0fr ↔ 1fr)
.desplegable {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;

  &--abierto {
    grid-template-rows: 1fr;
  }

  &__contenido {
    min-height: 0;
    overflow: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .desplegable,
  .opcion-banco {
    transition: none;
  }
}

.requisitos {
  padding: 14px 16px;
  border: 1px solid #e6e8eb;
  border-radius: 12px;
  font-size: 0.9rem;

  // El pagaré se enfatiza en ambos bancos
  &__pagare {
    padding: 10px 12px;
    border-radius: 10px;
    // Verde "success" (mismo tono que el callout de éxito de Revisión de créditos)
    color: #2e7d32;
    background: rgba(46, 125, 50, 0.08);
    border: 1px solid rgba(46, 125, 50, 0.3);
  }

  &__lista {
    margin: 0;
    padding-left: 20px;

    li {
      line-height: 1.6;
    }
  }
}

.opcion-banco {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border: 2px solid #e0e4e8;
  border-radius: 14px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s,
    transform 0.2s ease-out;

  &:hover:not(:disabled) {
    border-color: rgba(30, 99, 214, 0.5);
  }

  // Seleccionada: borde, sombra y un poco más pequeña; el fondo sigue blanco
  &--activa {
    border-color: #1e63d6;
    background: #fff;
    box-shadow: 0 10px 24px -12px rgba(30, 99, 214, 0.55);
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }

  // Fondo blanco también en el tema oscuro: los logos son para fondo claro
  &__logo {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 84px;
    padding: 10px 16px;
    border-radius: 10px;
    background: #fff;

    img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }
  }

  &__check {
    color: #1e63d6;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
