<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasPedidos"
    titulo-pagina="Pedidos de servicios"
    :mostrarButtonSubmits="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrar-formulario="mostrarFormulario"
  >
    <template #formulario>
      <div class="text-bold q-mb-md">Datos del pedido</div>
      <div class="row q-col-gutter-xs q-mb-md">
        <!-- Fecha emision -->
        <div class="col-12 col-md-4 q-mb-md">
          <label class="block q-mb-sm">Fecha emisión</label>
          <q-input
            v-model="pedido.fecha_emision"
            outlined
            dense
            disable
          ></q-input>
        </div>
      </div>

      <div class="text-bold q-mb-md">Datos del cliente</div>

      <div class="row q-col-gutter-xs q-mb-md">
        <!-- Cliente -->
        <div class="col-12 col-md-4 q-mb-md">
          <label class="block q-mb-sm">Cliente</label>
          <q-input
            :model-value="`${pedido.cliente?.nombre} ${pedido.cliente?.apellidos}`"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Identificacion -->
        <div class="col-12 col-md-4 q-mb-md">
          <label class="block q-mb-sm">Identificación</label>
          <q-input
            :model-value="pedido.cliente?.identificacion"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Correo -->
        <div class="col-12 col-md-4 q-mb-md">
          <label class="block q-mb-sm">Correo</label>
          <q-input
            :model-value="pedido.cliente?.correo"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-4 q-mb-md">
          <label class="block q-mb-sm">Celular</label>
          <q-input
            :model-value="pedido.cliente?.celular"
            outlined
            dense
            disable
          ></q-input>
        </div>
      </div>

      <div class="text-bold q-mb-md">Servicio adquirido</div>

      <div class="row q-mb-lg">
        <div class="col-12">
          {{ pedido.servicio }}
        </div>
      </div>

      <!-- <div class="text-bold q-mb-md">Respuestas</div> -->

      <!-- <div class="row q-col-gutter-xs q-mb-md">
        <div class="col-12 col-md-6 q-mb-md">
          <label class="block q-mb-sm"
            >¿Cuenta con su reporte de crédito?</label
          >
          <q-input
            :model-value="pedido.tiene_reporte"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="block q-mb-sm"
            >¿Conoce qué puntaje (score) tiene actualmente?</label
          >
          <q-input
            :model-value="pedido.conoce_puntaje"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="block q-mb-sm">¿Tiene deudas vencidas?</label>
          <q-input
            :model-value="pedido.tiene_deudas"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="block q-mb-sm"
            >¿Es cliente actual de Buró de Crédito Ecuador?</label
          >
          <q-input
            :model-value="pedido.es_cliente"
            outlined
            dense
            disable
          ></q-input>
        </div>
      </div> -->

      <div class="text-bold q-mb-xl">
        {{
          pedido.estado_pago?.charAt(0).toUpperCase() +
          pedido.estado_pago?.slice(1).toLowerCase()
        }}
        <q-icon
          v-if="pedido.estado_pago === 'PAGADO'"
          name="bi-check-circle-fill"
          color="positive"
        ></q-icon>
        <i v-else class="bi-check-circle"></i>
      </div>

      <div class="row justify-end q-mb-xl">
        <div class="column q-gutter-xs q-mb-4">
          <!-- IVA -->
          <div class="mb-2">
            <label class="form-label me-2">IVA (incluido):</label>
            $ {{ pedido.iva }}
          </div>

          <!-- Subtotal -->
          <div class="mb-2">
            <label class="form-label me-2">Subtotal:</label>
            $ {{ pedido.subtotal }}
          </div>

          <!-- Total -->
          <div class="mb-4">
            <label class="form-label me-2">Total:</label> $
            {{ pedido.total }}
          </div>

          <!-- Pagado por el cliente -->
          <div class="mb-2">
            <label class="form-label me-2">Pagado por el cliente:</label>
            $
            {{ pedido.pago_cliente }}
          </div>
        </div>
      </div>

      <div class="row q-gutter-xs justify-end q-mb-md">
        <q-btn
          v-if="pedido.estado_pago === 'PAGADO'"
          color="primary"
          type="a"
          target="_self"
          :href="`https://burodecredito.ec/api/pedidos/download-pdf/${pedido.id}`"
          no-caps
        >
          <q-icon name="bi-printer" class="q-mr-sm" size="xs"></q-icon>Imprimir
          comprobante
        </q-btn>

        <q-btn
          v-if="pedido.estado_pago !== 'PAGADO'"
          color="positive"
          @click="registrarPago()"
          no-caps
          push
        >
          <q-icon name="bi-cash-coin" class="q-mr-sm" size="xs"></q-icon
          >Registrar pago
        </q-btn>

        <q-btn
          v-if="pedido.estado_pago !== 'PAGADO'"
          color="negative"
          @click="eliminar(pedido)"
          no-caps
          push
        >
          <q-icon name="bi-trash" class="q-mr-sm" size="xs"></q-icon>Eliminar
          pedido
        </q-btn>
      </div>
    </template>
  </tab-layout>
</template>

<script src="./PedidoPage.ts"></script>

<style lang="scss">
thead {
  background-color: #eee;
}

table {
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid #979797;
    padding: 4px;
  }
}
</style>
