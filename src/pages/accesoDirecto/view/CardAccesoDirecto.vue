<template>
  <div
    class="bg-solid rounded-card q-pa-md text-center cursor-pointer q-card-hover q-card-press"
  >
    <img
      :src="accesoDirecto.imagen ?? ''"
      width="100px"
      height="100px"
      class="q-mb-sm rounded-card"
    />
    <div class="text-bold ellipsis q-mb-sm">
      {{ accesoDirecto.titulo }}
    </div>
    <q-btn
      v-if="authenticationStore.can('editar.accesos_directos')"
      color="primary"
      class="q-px-sm"
      @click.stop="$emit('editar', accesoDirecto.id)"
      dense
      flat
      no-caps
    >
      <q-icon name="bi-pencil-square" size="xs" class="q-mr-xs"></q-icon>Editar
    </q-btn>
    <q-btn
      v-if="authenticationStore.can('eliminar.accesos_directos')"
      color="negative"
      class="q-px-sm"
      @click.stop="$emit('eliminar')"
      dense
      flat
      no-caps
    >
      <q-icon name="bi-trash" size="xs" class="q-mr-xs"></q-icon>Eliminar
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { AccesoDirecto } from '../domain/AccesoDirecto'
import { useAuthenticationStore } from 'stores/authentication'

defineEmits(['eliminar', 'editar'])

defineProps({
  accesoDirecto: {
    type: Object as () => AccesoDirecto,
    required: true,
  },
})

const authenticationStore = useAuthenticationStore()


/* const eliminarCard = () =>
  confirmar('¿Está seguro de eliminar este acceso directo?', () =>
    emit('eliminar')
  ) */
</script>
