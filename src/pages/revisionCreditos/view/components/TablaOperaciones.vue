<template>
  <!-- Mismo formato que la tabla de deudas del reporte de Equifax -->
  <div class="tabla-operaciones">
    <table>
      <thead>
        <tr>
          <th>Fecha de Corte</th>
          <th>Institución</th>
          <th>Tipo Riesgo</th>
          <th>Tipo Crédito</th>
          <th>Cupo/Monto Original</th>
          <th>Fecha de Apertura</th>
          <th>Fecha de Vencimiento</th>
          <th>Total Vencer</th>
          <th>NDI</th>
          <th>Total Vencido</th>
          <th>Dem. Jud.</th>
          <th>Cart. Cast.</th>
          <th>Saldo Deuda</th>
          <th>Cuota Mensual</th>
          <th>Días Morosidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, i) in filas" :key="i" :class="{ 'en-mora': f.enMora }">
          <td class="corte">
            <span v-if="f.desactualizada">* </span>{{ f.fechaCorte }}
          </td>
          <td>{{ f.institucion }}</td>
          <td>{{ f.tipoRiesgo }}</td>
          <td>{{ f.tipoCredito }}</td>
          <td>{{ f.montoOriginal }}</td>
          <td>{{ f.fechaApertura }}</td>
          <td>{{ f.fechaVencimiento }}</td>
          <td>{{ f.totalVencer }}</td>
          <td>{{ f.ndi }}</td>
          <td :class="{ alerta: f.enMora }">{{ f.totalVencido }}</td>
          <td>{{ f.demandaJudicial }}</td>
          <td>{{ f.carteraCastigada }}</td>
          <td>{{ f.saldo }}</td>
          <td>{{ f.cuota }}</td>
          <td :class="{ alerta: f.enMora }">{{ f.diasMorosidad }}</td>
        </tr>
        <tr v-if="!filas.length">
          <td colspan="15" class="vacio">No registra operaciones activas</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="hayDesactualizadas" class="nota">
    * Última fecha en la que reportó la Institución
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OperacionActiva } from '../../domain/RevisionCredito'
import { formatearFechaBarra, formatearNumero } from '../../domain/formato'

const props = defineProps<{ operaciones: OperacionActiva[] }>()

// Corte más reciente de la tabla: las filas con un corte anterior se marcan con *
const ultimoCorte = computed(() =>
  props.operaciones.reduce(
    (max, o) => (o.fecha_corte && o.fecha_corte > max ? o.fecha_corte : max),
    ''
  )
)

const filas = computed(() =>
  props.operaciones.map((o) => ({
    fechaCorte: formatearFechaBarra(o.fecha_corte),
    desactualizada: !!o.fecha_corte && o.fecha_corte < ultimoCorte.value,
    institucion: o.institucion ?? '—',
    tipoRiesgo: o.tipo_deudor ?? '—',
    tipoCredito: (o.tipo_credito ?? '—').toUpperCase(),
    montoOriginal: formatearNumero(o.monto_original),
    fechaApertura: formatearFechaBarra(o.fecha_apertura),
    fechaVencimiento: formatearFechaBarra(o.fecha_vencimiento),
    totalVencer: formatearNumero(o.por_vencer),
    ndi: formatearNumero(o.ndi),
    totalVencido: formatearNumero(o.vencido),
    demandaJudicial: formatearNumero(o.demanda_judicial),
    carteraCastigada: formatearNumero(o.cartera_castigada),
    saldo: formatearNumero(o.saldo),
    cuota: formatearNumero(o.cuota_mensual),
    diasMorosidad: formatearNumero(o.dias_morosidad ?? 0),
    enMora: o.vencido > 0,
  }))
)

const hayDesactualizadas = computed(() =>
  filas.value.some((f) => f.desactualizada)
)
</script>

<style scoped lang="scss">
$rojo: #9b0000;
// Encabezado igual al de las demás tablas de la web (custom-styles-light.scss)
$cabecera-fondo: #e2e4ec;
$cabecera-texto: #1a192e;

// Selectores anidados bajo .tabla-operaciones: los estilos globales de
// tablas (general.scss y custom-styles-*.scss) tienen más especificidad.
.tabla-operaciones {
  overflow-x: auto;

  table {
    width: 100%;
    min-width: 1100px;
    border-collapse: collapse;
    font-size: 0.78rem;
    text-align: center;
  }

  thead tr th {
    background: $cabecera-fondo;
    color: $cabecera-texto;
    border: none;
    font-weight: 700;
    line-height: 1.2;
    padding: 8px 6px;
    vertical-align: middle;
  }

  tbody tr td {
    background: transparent;
    color: inherit;
    border: none;
    border-bottom: 1.5px solid #222;
    padding: 12px 6px;
    vertical-align: middle;

    &.corte {
      font-size: 0.85rem;
      white-space: nowrap;
    }

    &.alerta {
      color: $rojo;
      font-weight: 700;
    }

    &.vacio {
      color: #78909c;
      border-bottom: none;
    }
  }
}

.body--dark .tabla-operaciones tbody tr td {
  border-bottom-color: #555;
}

.nota {
  margin-top: 6px;
  font-size: 0.8rem;
}
</style>
