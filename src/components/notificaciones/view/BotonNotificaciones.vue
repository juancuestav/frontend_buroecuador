<template>
  <!-- Boton notificaciones -->
  <q-btn
    dense
    unelevated
    no-caps
    class="q-pl-sm"
    @click.self="mostrarNotificaciones = true"
  >
    <q-icon
      name="bi-bell"
      :class="{ 'q-mr-sm': !$q.screen.xs }"
      class="bg-icon color-icon-navbar q-pa-xs rounded-field"
      size="xs"
    ></q-icon>

    <!-- <span v-if="!$q.screen.xs">Notificaciones</span> -->
    <q-tooltip class="bg-dark">Notificaciones</q-tooltip>

    <q-badge v-if="notificaciones.length > 0" color="positive" floating
      ><span>{{ notificaciones.length }}</span>
    </q-badge>

    <q-menu
      v-model="mostrarNotificaciones"
      :self="selfCenterMiddle"
      transition-show="slide-left"
      transition-hide="slide-right"
      :style="{ width: width }"
      class="window-height bg-desenfoque-2 custom-shadow my-font"
      max-height="100vh"
      anchor="center middle"
    >
      <div class="full-width text-right q-pr-md q-mb-md">
        <q-btn
          icon="bi-chevron-right"
          round
          dense
          unelevated
          color="primary"
          class="q-mt-sm"
          @click="mostrarNotificaciones = false"
        ></q-btn>
      </div>

      <q-list style="min-width: 140px; max-width: 450px" class="q-px-xs">
        <q-item class="q-mb-md text-grey-7" v-if="notificaciones.length === 0">
          <q-avatar>
            <q-icon name="bi-bell-slash"></q-icon>
          </q-avatar>
          <q-item-section>
            <q-item-label>No tienes notificaciones nuevas</q-item-label>
          </q-item-section></q-item
        >

        <q-expansion-item
          v-for="titulo in Object.keys(notificacionesAgrupadas)"
          :key="titulo"
          class="overflow-hidden q-mb-sm expansion"
          :label="`${titulo} (${notificacionesAgrupadas[titulo].length})`"
          header-class="text-bold bg-header-collapse text-primary full-width"
          icon="bi-dot"
        >
          <q-item
            v-for="notificacion in notificacionesAgrupadas[titulo]"
            :key="notificacion.id"
            :to="notificacion.link"
          >
            <q-item-section avatar>
              <q-icon
                color="grey-8"
                :name="obtenerIcono.obtener(notificacion.tipo_notificacion)"
              />
            </q-item-section>

            <q-item-section class="full-width">
              {{ notificacion.mensaje }}
              <span class="block text-grey-8 text-weight-regular">
                {{ dayjs(notificacion.created_at).fromNow() }}
              </span>

              <q-item-label class="row justify-end q-pt-sm">
                <q-btn
                  icon="bi-check"
                  label="Marcar como leído"
                  dense
                  color="positive"
                  size="sm"
                  outline
                  no-caps
                  rounded
                  unelevated
                  @click="marcarLeida(notificacion.id)"
                >
                </q-btn
              ></q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-separator />

        <q-item clickable to="notificaciones">
          <q-avatar>
            <q-icon name="bi-bell" />
          </q-avatar>
          <q-item-section>Ver todas las notificaciones</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
// import es from 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { ObtenerIconoNotificacionRealtime } from '../application/ObtenerIconoNotificacionRealtime'
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import { NotificacionesSistema } from '../application/NotificacionesSistema'
import { Notificacion } from '../domain/Notificacion'

/**********
 * Stores
 **********/
const notificacionesPusherStore = useNotificationRealtimeStore()

/*************
 * Variables
 *************/
const $q = useQuasar()
const obtenerIcono = new ObtenerIconoNotificacionRealtime()
const mostrarNotificaciones = ref(false)
const width = computed(() => ($q.screen.xs ? '100%' : '450px'))
type tipo = 'center middle' | 'top start'
const selfCenterMiddle: ComputedRef<tipo> = computed(
  () => 'center middle'
  // $q.screen.xs ? 'center middle' : 'top start'
)
const notificaciones: Ref<Notificacion[]> = computed(
  () => notificacionesPusherStore.listadoNotificaciones
)

/*************
 * Funciones
 *************/
async function marcarLeida(id: number) {
  notificacionesPusherStore.idNotificacion = id
  await notificacionesPusherStore.marcarLeida()
}

const notificacionesAgrupadas: any = computed(() =>
  agruparYOrdenarNotificacionesPorTipo(
    notificacionesPusherStore.listadoNotificaciones
  )
)

function agruparYOrdenarNotificacionesPorTipo(notificaciones) {
  const grupos = {}

  notificaciones.forEach((notificacion) => {
    const tipo = notificacion.tipo_notificacion
    if (!grupos[tipo]) {
      grupos[tipo] = []
    }
    grupos[tipo].push(notificacion)
  })

  // Ordenar las notificaciones dentro de cada grupo según el campo 'tipo'
  const tiposOrdenados = Object.keys(grupos).sort()

  const notificacionesAgrupadasYOrdenadas = {}
  tiposOrdenados.forEach((tipo) => {
    notificacionesAgrupadasYOrdenadas[tipo] = grupos[tipo]
  })

  return notificacionesAgrupadasYOrdenadas
}

/********
 * Init
 ********/
dayjs.extend(relativeTime)
dayjs.locale('es')

// Permitir notificaciones push
if ('Notification' in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      // console.log('Permiso de notificación concedido.');
    } else {
      // console.log('Permiso de notificación denegado.')
    }
  })
}

/**********************************************
 * PUSHER
 * En esta sección agregan todas las llamadas al metodo start de sus archivos PusherEvent
 **********************************************/
const notificacionesSistema = new NotificacionesSistema()
notificacionesSistema.init()

onMounted(() => notificacionesPusherStore.listar()) //cargar las notificaciones de la base de datos
</script>
