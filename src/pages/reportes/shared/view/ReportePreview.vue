<template>
  <div class="q-py-xs cinta-cabecera">
    <span>Inicio</span>
    <span>Mantenimientos</span>
    <span>Consultas/Reporte</span>
    <span>Transacción</span>
  </div>

  <div class="bg-white">
    <!-- Header -->
    <div class="row justify-between q-pa-md">
      <img src="~assets/logo.webp" height="50" />
      <span class="bg-fecha">Fecha de consulta {{ fechaActual }}</span>
    </div>

    <!-- Datos de credito -->
    <h4
      class="titulo-seccion q-pa-md q-mb-md"
      :class="{ 'text-h6': $q.screen.xs }"
    >
      REPORTE DE CRÉDITO {{ reporte.tipo_reporte }}
    </h4>

    <div class="row q-px-md q-mb-md">
      <div class="col-12">
        <table :class="{ 'w-50': true, 'q-mx-auto': true }">
          <tbody>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold w-50"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Documento de identidad
              </td>
              <td
                class="text-center w-50"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                {{ reporte.identificacion_cliente }}
              </td>
            </tr>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Nombres
              </td>
              <td class="text-center" :class="{ 'mini-texto': $q.screen.xs }">
                {{ reporte.nombres_cliente }}
              </td>
            </tr>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Edad
              </td>
              <td class="text-center" :class="{ 'mini-texto': $q.screen.xs }">
                {{ reporte.edad_cliente }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Datos de contacto -->
    <h5
      class="titulo-seccion q-py-xs q-mb-sm"
      :class="{ 'text-h6': $q.screen.xs }"
    >
      DATOS DE CONTACTO
    </h5>
    <div class="row q-px-md q-mb-md">
      <div class="col-12">
        <table :class="{ 'w-50': true, 'q-mx-auto': true }">
          <tbody>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold w-50"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Celular
              </td>
              <td
                class="text-center w-50"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                {{ reporte.celular_cliente }}
              </td>
            </tr>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Correo
              </td>
              <td class="text-center" :class="{ 'mini-texto': $q.screen.xs }">
                {{ reporte.correo_cliente }}
              </td>
            </tr>
            <tr>
              <td
                class="bg-grey-3 text-center text-bold"
                :class="{ 'mini-texto': $q.screen.xs }"
              >
                Dirección
              </td>
              <td class="text-center" :class="{ 'mini-texto': $q.screen.xs }">
                {{ reporte.direccion_cliente }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Informacion laboral -->
    <h5
      class="titulo-seccion q-py-xs q-mb-sm"
      :class="{ 'text-h6': $q.screen.xs }"
    >
      INFORMACIÓN LABORAL
    </h5>
    <div v-if="reporte.tiene_informacion_laboral" class="row q-px-md q-mb-md">
      <div class="col-12">
        <table :class="{ 'mini-texto': $q.screen.xs }">
          <tbody>
            <tr>
              <td class="bg-grey-3 q-pl-md text-bold w-25">Ruc empleador</td>
              <td class="q-pl-md w-25">
                {{ reporte.ruc_empleador }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold w-25">Tipo empresa</td>
              <td class="q-pl-md w-25">
                {{ reporte.tipo_empresa }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Nombre empresa</td>
              <td class="q-pl-md">
                {{ reporte.nombre_empresa }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Código sucursal</td>
              <td class="q-pl-md">
                {{ reporte.codigo_sucursal }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Teléfono sucursal</td>
              <td class="q-pl-md">
                {{ reporte.telefono_sucursal }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Dirección sucursal</td>
              <td class="q-pl-md">
                {{ reporte.direccion_sucursal }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Fax sucursal</td>
              <td class="q-pl-md">
                {{ reporte.fax_sucursal }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Dirección afiliado</td>
              <td class="q-pl-md">
                {{ reporte.direccion_afiliado }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Teléfono afiliado</td>
              <td class="q-pl-md">
                {{ reporte.telefono_afiliado }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Ocupación afiliado</td>
              <td class="q-pl-md">
                {{ reporte.ocupacion_afiliado }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Celular afiliado</td>
              <td class="q-pl-md">
                {{ reporte.celular_afiliado }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Email afiliado</td>
              <td class="q-pl-md">
                {{ reporte.email_afiliado }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Salario afiliado</td>
              <td class="q-pl-md">
                {{ reporte.salario_afiliado }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Fecha ingreso</td>
              <td class="q-pl-md">
                {{ reporte.fecha_ingreso }}
              </td>
            </tr>

            <tr>
              <td class="bg-grey-3 q-pl-md text-bold">Fecha salida</td>
              <td class="q-pl-md">
                {{ reporte.fecha_salida }}
              </td>
              <td class="bg-grey-3 q-pl-md text-bold">Ubicación empresa</td>
              <td class="q-pl-md">
                {{ reporte.ubicacion_empresa }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Servicio de Rentas Internas -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      SERVICIO DE RENTAS INTERNAS (SRI)
    </h5>
    <div v-if="reporte.tiene_ruc" class="row q-px-md q-mb-md">
      <div class="col-12 q-mb-md">
        <table>
          <tbody>
            <tr>
              <td class="bg-grey-3 text-center text-bold w-50">RUC</td>
              <td class="text-center w-50">
                {{ reporte.ruc_cliente }}
              </td>
            </tr>
            <tr>
              <td class="bg-grey-3 text-center text-bold">Razón social</td>
              <td class="text-center">
                {{ reporte.razon_social }}
              </td>
            </tr>
            <tr>
              <td class="bg-grey-3 text-center text-bold">
                Estado contribuyente en el RUC
              </td>
              <td class="text-center">
                <span
                  :class="{
                    'text-positive': reporte.estado_contribuyente,
                    'text-negative': !reporte.estado_contribuyente,
                  }"
                  ><b>{{
                    reporte.estado_contribuyente ? 'ACTIVO' : 'NO ACTIVO'
                  }}</b></span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="page-break"></div>

      <div class="col-12 q-mb-md">
        <table>
          <thead>
            <tr>
              <th>Tipo de contribuyente</th>
              <th>Clase de contribuyente</th>
              <th>Obligado a llevar contabilidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ reporte.tipo_contribuyente }}</td>
              <td>{{ reporte.clase_contribuyente }}</td>
              <td class="ps-2">
                {{ reporte.obligado_llevar_contabilidad ? 'SI' : 'NO' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-12 q-mb-md">
        <table>
          <thead>
            <tr>
              <th>Fecha inicio de actividades</th>
              <th>Fecha actualización</th>
              <th>Fecha cese actividades</th>
              <th>Fecha reinicio actividades</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {{ reporte.fecha_inicio_actividades }}
              </td>
              <td>{{ reporte.fecha_actualización }}</td>
              <td>
                {{ reporte.fecha_cese_actividades }}
              </td>
              <td>
                {{ reporte.fecha_reinicio_actividades }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-12">
        <table-view
          :configuracion-columnas="configuracionColumnasActividades"
          :elementos="reporte.actividadesEconomicas"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Establecimientos -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">ESTABLECIMIENTO MATRIZ</h5>
    <div v-if="reporte.tiene_establecimientos">
      <p class="text-center">
        Lista de establecimientos -
        {{ totalEstablecimientos }} registro(s)
      </p>
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasEstablecimientos"
          :elementos="reporte.establecimientos"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Decreto 333 -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">DECRETO 333</h5>
    <div class="row q-px-md q-mb-md">
      <div class="col-12 text-center">
        <span
          v-if="reporte.beneficiado_333"
          class="d-flex align-items-center justify-content-center"
          ><q-icon
            name="bi-check-circle-fill"
            class="q-mr-sm"
            color="positive"
            size="sm"
          ></q-icon
          >USTED ES BENEFICIADO DEL DECRETO 333</span
        >
        <span v-else class="d-flex align-items-center justify-content-center"
          ><q-icon
            name="bi-x-circle-fill"
            class="q-mr-sm"
            color="negative"
            size="sm"
          ></q-icon
          >USTED NO HA SIDO BENEFICIADO DEL DECRETO 333</span
        >
      </div>
    </div>

    <div class="page-break"></div>

    <!-- Resumen -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">RESUMEN</h5>
    <div v-if="reporte.tiene_resumen">
      <div class="row q-px-md q-mb-md">
        <div class="col-12 overflow-auto q-mb-sm">
          <table class="w-50 q-mx-auto">
            <tbody>
              <tr>
                <!-- Saldo -->
                <td class="ps-2 bg-grey-3 text-bold w-25 text-no-wrap">
                  Saldo total operaciones impagos
                </td>
                <td class="text-center fs-3 text-bold w-25 text-no-wrap">
                  $ {{ reporte.saldo_impagos }}
                </td>
                <!-- Total -->
                <td class="ps-2 bg-grey-3 text-bold w-25 text-no-wrap">
                  Total operaciones impagos
                </td>
                <td class="text-center fs-3 text-bold w-25 text-no-wrap">
                  {{ reporte.total_impagos }}
                </td>
              </tr>

              <tr>
                <!-- Saldo -->
                <td class="ps-2 bg-grey-3 text-bold text-no-wrap">
                  Saldo total operaciones demanda judicial
                </td>
                <td class="text-center fs-3 text-bold">
                  $ {{ reporte.saldo_demanda_judicial }}
                </td>
                <!-- Total -->
                <td class="ps-2 bg-grey-3 text-bold text-no-wrap">
                  Total operaciones demanda judicial
                </td>
                <td class="text-center fs-3 text-bold">
                  {{ reporte.total_demanda_judicial }}
                </td>
              </tr>

              <tr>
                <!-- Saldo -->
                <td class="ps-2 bg-grey-3 text-bold text-no-wrap">
                  Saldo total operaciones cartera castigada
                </td>
                <td class="text-center fs-3 text-bold">
                  $ {{ reporte.saldo_cartera_castigada }}
                </td>
                <!-- Total -->
                <td class="ps-2 bg-grey-3 text-bold text-no-wrap">
                  Total operaciones cartera castigada
                </td>
                <td class="text-center fs-3 text-bold">
                  {{ reporte.total_cartera_castigada }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <deslizar-movil></deslizar-movil>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Resumen morosidades -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      TOTAL DE DEUDA REPORTADA A LA CENTRAL DE RIESGOS
    </h5>
    <div v-if="reporte.tiene_resumen_morosidades" class="q-px-md q-mb-md">
      <table-view
        :configuracion-columnas="configuracionColumnasMorosidades"
        :elementos="reporte.morosidades"
      ></table-view>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Score -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">SCORES</h5>
    <div v-if="reporte.tiene_puntuaciones">
      <div class="row q-px-md q-mb-md">
        <div class="col-12 text-center q-mb-md">
          <contador
            titulo="Score crediticio"
            :valor="parseInt(reporte.score_crediticio)"
          ></contador>
        </div>

        <div class="col-12 text-center">
          <contador
            titulo="Score sobreendeudamiento"
            :valor="parseInt(reporte.score_sobreendeudamiento)"
          ></contador>
        </div>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <div class="page-break"></div>

    <!-- Operaciones de credito bancaria -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      OPERACIONES DE CRÉDITO BANCARIAS
    </h5>
    <div v-if="reporte.tiene_operaciones_credito_bancarias">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasOperacionesCredito"
          :elementos="reporte.operacionesCreditoBancarias"
          :dense="true"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Operaciones de credito comerciales -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      OPERACIONES DE CRÉDITO COMERCIALES
    </h5>
    <div v-if="reporte.tiene_operaciones_credito_comerciales">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasOperacionesCredito"
          :elementos="reporte.operacionesCreditoComerciales"
          :dense="true"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <div class="page-break"></div>

    <h5 class="titulo-seccion q-py-xs q-mb-sm">SEGMENTACIÓN DE RIESGO</h5>
    <div class="px-4 mb-5">
      <table class="table">
        <thead>
          <tr>
            <th>Segmentación</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #0cdd77">
            <td>AAA - Cliente excelente</td>
            <td>930 - 999 puntos</td>
          </tr>
          <tr style="background-color: #beff6f">
            <td>AA - Cliente bueno</td>
            <td>850 - 929</td>
          </tr>
          <tr style="background-color: #f7fee7">
            <td>A - Cliente regular</td>
            <td>700 - 849</td>
          </tr>
          <tr style="background-color: #fef200">
            <td>B - Cliente bajo</td>
            <td>400 - 699</td>
          </tr>
          <tr style="background-color: #ff0600">
            <td>C - Cliente malo</td>
            <td>Bajo 400</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Historial crediticio -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      HISTORIAL CREDITICIO PERÍODO 3 ÚLTIMOS AÑOS
    </h5>
    <div v-if="reporte.tiene_historial">
      <div class="q-px-md q-mb-md">
        <table-view-historial-crediticio
          :configuracion-columnas="configuracionColumnasHistorialCrediticio"
          :elementos="reporte.historialCrediticio"
        ></table-view-historial-crediticio>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Cuota mensual buro de credito -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      CUOTA MENSUAL BURÓ DE CRÉDITO
    </h5>
    <div v-if="reporte.tiene_cuota_mensual">
      <div class="text-center text-bold fs-1 q-px-md q-mb-md">
        <div class="col-12 text-center">
          <contador-precio
            titulo="Cuota"
            :valor="parseFloat(reporte.cuota_mensual)"
          ></contador-precio>
        </div>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <div class="page-break"></div>

    <!-- Consultas -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      INSTITUCIONES QUE HAN REVISADO SU BURÓ DE CRÉDITO
    </h5>
    <div class="q-px-md q-mb-md">
      <table-view
        v-if="reporte.tiene_consultas"
        :configuracion-columnas="configuracionColumnasConsultasCliente"
        :elementos="reporte.consultasCliente"
        estilos="w-50 q-mx-auto"
      ></table-view>
      <p v-else class="text-center q-pb-md">
        <q-icon
          name="bi-info-circle-fill"
          class="q-mr-sm"
          color="info"
          size="sm"
        ></q-icon
        >CLIENTE NO POSEE CONSULTAS EN EL ÚLTIMO AÑO FISCAL
      </p>
    </div>

    <div class="page-break"></div>

    <!-- Resumen vencimientos -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">RESUMEN DE VENCIMIENTOS</h5>
    <div v-if="reporte.tiene_resumen_vencimientos">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasVencimientos"
          :elementos="reporte.vencimientos"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Analisis de saldos por vencer -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      ANÁLISIS DE SALDOS POR VENCER SISTEMA FINANCIERO
    </h5>
    <div v-if="reporte.tiene_saldos_por_vencer">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasSaldosPorVencer"
          :elementos="reporte.saldosPorVencer"
        ></table-view>
        <p class="q-pt-md">
          <b>Mantiene historial crediticio desde: </b
          >{{ reporte.historial_crediticio_desde }}
        </p>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <div class="page-break"></div>

    <!-- Ultimas 10 operaciones canceladas -->
    <h5 class="titulo-seccion q-py-xs q-mb-sm">
      ÚLTIMAS 10 OPERACIONES CANCELADAS
    </h5>
    <div v-if="reporte.tiene_operaciones_canceladas">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasOperacionesCanceladas"
          :elementos="reporte.operacionesCanceladas"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>

    <!-- Informacion de seguros -->
    <h5 class="text-bold text-center">INFORMACIÓN DE SEGUROS</h5>
    <div v-if="reporte.tiene_informacion_seguros">
      <div class="q-px-md q-mb-md">
        <table-view
          :configuracion-columnas="configuracionColumnasSeguros"
          :elementos="reporte.seguros"
        ></table-view>
      </div>
    </div>
    <p v-else class="text-center q-pb-md">
      <q-icon
        name="bi-info-circle-fill"
        class="q-mr-sm"
        color="info"
        size="sm"
      ></q-icon
      >EL CLIENTE NO POSEE DATOS PARA EL SEGMENTO
    </p>
  </div>
</template>

<script lang="ts">
import { configuracionColumnasActividades } from '../domain/configuracionColumnasActividades'
import { configuracionColumnasEstablecimientos } from '../domain/configuracionColumnasEstablecimientos'
import { configuracionColumnasOperacionesCredito } from '../domain/configuracionColumnasOperacionesCredito'
import { configuracionColumnasHistorialCrediticio } from '../domain/configuracionColumnasHistorialCrediticio'
import { configuracionColumnasConsultasCliente } from '../domain/configuracionColumnasConsultasCliente'
import { configuracionColumnasMorosidades } from '../domain/configuracionColumnasMorosidades'
import { configuracionColumnasVencimientos } from '../domain/configuracionColumnasVencimientos'
import { configuracionColumnasSaldosPorVencer } from '../domain/configuracionColumnasSaldosPorVencer'
import { configuracionColumnasOperacionesCanceladas } from '../domain/configuracionColumnasOperacionesCanceladas'
import { configuracionColumnasSeguros } from '../domain/configuracionColumnasSeguros'

import { computed, defineComponent, ref } from 'vue'

// Componentes
import TableViewHistorialCrediticio from 'components/tables/view/TableViewHistorialCrediticio.vue'
import TableView from 'components/tables/view/TableView.vue'
import Contador from 'components/ContadorComponent.vue'
import ContadorPrecio from 'src/components/ContadorPrecio.vue'
import DeslizarMovil from 'components/tables/view/DeslizarMovil.vue'

export default defineComponent({
  props: ['reporte'],
  components: {
    TableView,
    TableViewHistorialCrediticio,
    Contador,
    ContadorPrecio,
    DeslizarMovil,
  },
  setup(props) {
    const fechaActual = new Date().toLocaleDateString()

    const totalEstablecimientos = computed(() => {
      if (props.reporte.establecimientos) {
        return props.reporte.establecimientos.length
      }
      return 0
    })

    const scoreCrediticio = ref(parseInt(props.reporte.score_crediticio))
    const scoreSobreendeudamiento = ref(
      parseInt(props.reporte.score_sobreendeudamiento)
    )

    // scoreCrediticio.value = computed(() => props.reporte.score_crediticio)
    /* scoreSobreendeudamiento.value = computed(
      () => props.reporte.score_sobreendeudamiento
    ) */

    return {
      fechaActual,
      totalEstablecimientos,
      configuracionColumnasActividades,
      configuracionColumnasEstablecimientos,
      configuracionColumnasOperacionesCredito,
      configuracionColumnasHistorialCrediticio,
      configuracionColumnasConsultasCliente,
      configuracionColumnasMorosidades,
      configuracionColumnasVencimientos,
      configuracionColumnasSaldosPorVencer,
      configuracionColumnasOperacionesCanceladas,
      configuracionColumnasSeguros,
      scoreCrediticio,
      scoreSobreendeudamiento,
    }
  },
})
</script>

<style lang="scss" scoped>
.bg-fecha {
  background-color: #eee;
  padding: 16px;
  border-radius: 8px;
}

.cinta-cabecera {
  background-color: #2e5496;
  color: #fff;
  display: flex;
  justify-content: space-around;
}

.titulo-seccion {
  background-color: #eee;
  text-align: center;
  font-weight: bold;
}

thead {
  background-color: #eee;
}

table {
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid;
  }
}
</style>
