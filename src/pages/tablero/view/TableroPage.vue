<template>
  <q-page padding class="bg-transparent">
    <div class="text-center q-py-md q-mb-md">
      <div class="text-bold q-mb-md">{{ fecha }}</div>
      <div class="text-h5 text-bold q-mb-md">
        Bienvenido, {{ store.nombreUsuario }}.
      </div>
    </div>

    <div v-if="mostrarTrabajosEcuador" class="row q-col-gutter-xs">
      <!-- Usuarios verificados -->
      <div class="col-12 col-md-3 text-center">
        <div>Total de usuarios</div>
        <q-knob
          :model-value="
            tablero.usuariosVerificados + tablero.usuariosNoVerificados
          "
          readonly
          :step="1"
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{
            tablero.usuariosVerificados + tablero.usuariosNoVerificados
          }}</template>
        </q-knob>
      </div>
      <!-- Usuarios conectados -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados</div>
        <q-knob
          :model-value="tablero.usuariosConectados"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectados }}</template>
        </q-knob>
      </div>

      <!-- Usuarios conectados el dia de hoy -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados el dia de hoy</div>
        <q-knob
          :model-value="tablero.usuariosConectadosDia"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectadosDia }}</template>
        </q-knob>
      </div>

      <!-- Usuarios conectados en el mes -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados en el mes</div>
        <q-knob
          :model-value="tablero.usuariosConectadosMes"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectadosMes }}</template>
        </q-knob>
      </div>
    </div>

    <div v-if="mostrarBuroCreditoEcuadorEcuador" class="row q-col-gutter-sm">
      <!-- Usuarios verificados -->
      <div class="col-12 col-md-3 text-center">
        <div>Total de usuarios</div>
        <q-knob
          :model-value="
            tablero.usuariosVerificados + tablero.usuariosNoVerificados
          "
          readonly
          :step="1"
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{
            tablero.usuariosVerificados + tablero.usuariosNoVerificados
          }}</template>
        </q-knob>
      </div>

      <div class="col-12 col-md-3 text-center">
        <div>Usuarios verificados</div>
        <q-knob
          :model-value="tablero.usuariosVerificados"
          readonly
          :step="1"
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosVerificados }}</template>
        </q-knob>
      </div>

      <!-- Usuarios no verificados -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios no verificados</div>
        <q-knob
          :model-value="tablero.usuariosNoVerificados"
          readonly
          :step="1"
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosNoVerificados }}</template>
        </q-knob>
      </div>

      <!-- Usuarios conectados -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados</div>
        <q-knob
          :model-value="tablero.usuariosConectados"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectados }}</template>
        </q-knob>
      </div>

      <!-- Usuarios conectados el dia de hoy -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados el dia de hoy</div>
        <q-knob
          :model-value="tablero.usuariosConectadosDia"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectadosDia }}</template>
        </q-knob>
      </div>

      <!-- Usuarios conectados en el mes -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios conectados en el mes</div>
        <q-knob
          :model-value="tablero.usuariosConectadosMes"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuariosConectadosMes }}</template>
        </q-knob>
      </div>

      <!-- Facturación de planes pagados -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios con facturación de planes (pagado)</div>
        <q-knob
          :model-value="tablero.usuarioConPlanesPagados"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuarioConPlanesPagados }}</template>
        </q-knob>
      </div>

      <!-- Facturación de planes no pagados -->
      <div class="col-12 col-md-3 text-center">
        <div>Usuarios con facturación de planes (no pagado)</div>
        <q-knob
          :model-value="tablero.usuarioConPlanesNoPagados"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.usuarioConPlanesNoPagados }}</template>
        </q-knob>
      </div>

      <!-- Servicios activos -->
      <div class="col-12 col-md-3 text-center">
        <div>Servicios activos</div>
        <q-knob
          :model-value="tablero.serviciosActivos"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.serviciosActivos }}</template>
        </q-knob>
      </div>

      <!-- Planes activos -->
      <div class="col-12 col-md-3 text-center">
        <div>Planes activos</div>
        <q-knob
          :model-value="tablero.planesActivos"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.planesActivos }}</template>
        </q-knob>
      </div>

      <!-- Pedidos de servicios por atender -->
      <div class="col-12 col-md-3 text-center">
        <div>Pedidos de servicios por atender</div>
        <q-knob
          :model-value="tablero.pedidos"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.pedidos }}</template>
        </q-knob>
      </div>

      <!-- Reportes generados -->
      <div class="col-12 col-md-3 text-center">
        <div>Reportes generados</div>
        <q-knob
          :model-value="tablero.pedidos"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.reportes }}</template>
        </q-knob>
      </div>

      <div class="col-12 col-md-3 text-center">
        <div>Clicks para pagos con Payphone</div>
        <q-knob
          :model-value="tablero.clicks_payphone"
          readonly
          show-value
          size="90px"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <template #default>{{ tablero.clicks_payphone }}</template>
        </q-knob>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive } from 'vue'
import { TableroController } from '../infraestructure/TableroController'
import { Tablero } from '../domain/Tablero'
import { date } from 'quasar'

export default defineComponent({
  name: 'tablero_principal',
  setup() {
    const store = useAuthenticationStore()
    const controller = new TableroController()
    const tablero = reactive(new Tablero())
    const usuarios = 20

    const timeStamp = Date.now()
    const fecha = date.formatDate(timeStamp, 'dddd, DD MMMM YYYY')

    async function index() {
      const { response } = await controller.listar()
      tablero.hydrate(response.data.modelo)
    }

    const mostrarBuroCreditoEcuadorEcuador = process.env.APP_ID === '1'
    const mostrarTrabajosEcuador = process.env.APP_ID === '2'

    index()

    return {
      tablero,
      store,
      usuarios,
      fecha,
      mostrarTrabajosEcuador,
      mostrarBuroCreditoEcuadorEcuador,
    }
  },
})
</script>
