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
          <q-icon
            v-if="seleccionado === banco.value"
            name="bi-check-circle-fill"
            size="20px"
            class="opcion-banco__check"
          />
        </button>
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
import { computed, ref } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { Banco, BANCOS, SolicitudCredito } from '../../domain/SolicitudCredito'
import logoGuayaquil from 'src/assets/bancos/guayaquil.svg'
import logoPichincha from 'src/assets/bancos/pichincha.svg'

const LOGOS: Record<Banco, string> = { GUAYAQUIL: logoGuayaquil, PICHINCHA: logoPichincha }

const props = defineProps<{ solicitud: SolicitudCredito; editable: boolean }>()
const { notificarAdvertencia } = useNotificaciones()

const seleccionado = ref<Banco | null>(props.solicitud.banco)

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
  transition: border-color 0.15s, background-color 0.15s;

  &:hover:not(:disabled) {
    border-color: rgba(30, 99, 214, 0.5);
  }

  &--activa {
    border-color: #1e63d6;
    background: rgba(30, 99, 214, 0.06);
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
