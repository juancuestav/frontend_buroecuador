<template>
  <q-page padding>
    <q-form @submit.prevent>
      <!-- Configuración del reporte -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Configuración del reporte"
        header-class="bg-grey-1"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de reporte</label>
            <q-select
              v-model="reporte.tipo_reporte"
              :options="tiposReportes"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="reporte.beneficiado_333"
              label="Beneficiado del decreto 333"
            />
          </div>
        </div>
      </q-expansion-item>

      <!-- Datos del cliente -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Datos del cliente"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Documento de identidad</label>
            <q-input
              v-model="criterioBusquedaUsuario"
              hint="Escriba la identificación o deje en blanco, luego presione la tecla Enter"
              @keydown.enter="listarUsuarios()"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input v-model="reporte.nombres_cliente" outlined dense disable>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Edad</label>
            <q-input v-model="reporte.edad_cliente" outlined dense disable>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Datos del contacto -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Datos del contacto"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input v-model="reporte.celular_cliente" outlined dense disable>
              <template #prepend>
                <q-icon name="bi-telephone" size="xs"></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input v-model="reporte.correo_cliente" outlined dense disable>
              <template #prepend>
                <q-icon name="bi-envelope" size="xs"></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input v-model="reporte.direccion_cliente" outlined dense disable>
              <template #prepend>
                <q-icon name="bi-map" size="xs"></q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Informacion laboral -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Información laboral"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_informacion_laboral"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_informacion_laboral"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">RUC empleador</label>
            <q-input v-model="reporte.ruc_empleador" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de empresa</label>
            <q-input v-model="reporte.tipo_empresa" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre de empresa</label>
            <q-input v-model="reporte.nombre_empresa" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de sucursal</label>
            <q-input v-model="reporte.codigo_sucursal" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Teléfono de sucursal</label>
            <q-input v-model="reporte.telefono_sucursal" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección de sucursal</label>
            <q-input v-model="reporte.direccion_sucursal" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fax de sucursal</label>
            <q-input v-model="reporte.fax_sucursal" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección de afiliado</label>
            <q-input v-model="reporte.direccion_afiliado" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Teléfono de afiliado</label>
            <q-input v-model="reporte.telefono_afiliado" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ocupación de afiliado</label>
            <q-input v-model="reporte.ocupacion_afiliado" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular del afiliado</label>
            <q-input v-model="reporte.celular_afiliado" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo del afiliado</label>
            <q-input v-model="reporte.email_afiliado" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salario del afiliado</label>
            <q-input v-model="reporte.salario_afiliado" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de ingreso</label>
            <q-input v-model="reporte.fecha_ingreso" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="reporte.fecha_ingreso" mask="DD-MM-YYYY">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de salida</label>
            <q-input v-model="reporte.fecha_salida" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="reporte.fecha_salida" mask="DD-MM-YYYY">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ubicación de la empresa</label>
            <q-input v-model="reporte.ubicacion_empresa" outlined dense>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Servicio de Rentas Internas (SRI) -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Servicio de Rentas Internas (SRI)"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_ruc"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div v-if="reporte.tiene_ruc" class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">RUC del cliente</label>
            <q-input v-model="reporte.ruc_cliente" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Razón social</label>
            <q-input v-model="reporte.razon_social" outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="reporte.estado_contribuyente"
              label="Estado contribuyente en el RUC"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="reporte.obligado_llevar_contabilidad"
              label="Obligado a llevar contabilidad"
            />
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de contribuyente</label>
            <q-select
              v-model="reporte.tipo_contribuyente"
              :options="tiposContribuyente"
              transition-show="flip-up"
              transition-hide="flip-down"
              options-dense
              dense
              outlined
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Clase contribuyente</label>
            <q-input v-model="reporte.clase_contribuyente" outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio de actividades</label>
            <q-input v-model="reporte.fecha_inicio_actividades" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="reporte.fecha_inicio_actividades"
                      mask="DD-MM-YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de actualización</label>
            <q-input v-model="reporte.fecha_actualización" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="reporte.fecha_actualización"
                      mask="DD-MM-YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de cese de actividades</label>
            <q-input v-model="reporte.fecha_cese_actividades" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="reporte.fecha_cese_actividades"
                      mask="DD-MM-YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha de reinicio de actividades</label
            >
            <q-input
              v-model="reporte.fecha_reinicio_actividades"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="reporte.fecha_reinicio_actividades"
                      mask="DD-MM-YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <label class="q-mb-sm block">Actividad económica principal</label>
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasActividades,
              ]"
              :datos="actividadesEconomicas"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarActividad"
              @eliminar="eliminarActividadEconomica"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Establecimiento matriz -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Establecimiento matriz"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_establecimientos"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_establecimientos"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <label class="q-mb-sm block">Establecimientos</label>
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasEstablecimientos,
              ]"
              :datos="establecimientos"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarEstablecimiento"
              @eliminar="eliminarEstablecimiento"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Resumen -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Resumen"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_resumen"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div v-if="reporte.tiene_resumen" class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo total operaciones impagos</label>
            <q-input v-model="reporte.saldo_impagos" outlined dense>
              <template #prepend>
                <q-icon name="bi-currency-dollar" size="xs"></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total operaciones impagos</label>
            <q-input
              v-model="reporte.total_impagos"
              type="number"
              min="0"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Saldo total operaciones demanda judicial</label
            >
            <q-input v-model="reporte.saldo_demanda_judicial" outlined dense>
              <template #prepend>
                <q-icon name="bi-currency-dollar" size="xs"></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Total operaciones demanda judicial</label
            >
            <q-input
              v-model="reporte.total_demanda_judicial"
              type="number"
              min="0"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Saldo total operaciones cartera castigada</label
            >
            <q-input v-model="reporte.saldo_cartera_castigada" outlined dense>
              <template #prepend>
                <q-icon name="bi-currency-dollar" size="xs"></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Total operaciones cartera castigada</label
            >
            <q-input
              v-model="reporte.total_cartera_castigada"
              type="number"
              min="0"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Resumen de morosidades -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Resumen de morosidades"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_resumen_morosidades"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_resumen_morosidades"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="
                $q.screen.xs
                  ? [acciones, ...configuracionColumnasMorosidades]
                  : configuracionColumnasMorosidades
              "
              :datos="morosidades"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :mostrarHeader="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Puntuaciones -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Puntuaciones"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_puntuaciones"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_puntuaciones"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Score crediticio</label>
            <q-input
              v-model="reporte.score_crediticio"
              type="number"
              min="0"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Score sobreendeudamiento</label>
            <q-input
              v-model="reporte.score_sobreendeudamiento"
              type="number"
              min="0"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Operaciones de credito bancarias -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Operaciones de credito bancarias"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_operaciones_credito_bancarias"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_operaciones_credito_bancarias"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasOperacionesCredito,
              ]"
              :datos="operacionesCreditoBancarias"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarOperacionCreditoBancaria"
              @eliminar="eliminarOperacionCreditoBancaria"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Operaciones de credito comerciales -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Operaciones de credito comerciales"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_operaciones_credito_comerciales"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_operaciones_credito_comerciales"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasOperacionesCredito,
              ]"
              :datos="operacionesCreditoComerciales"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarOperacionCreditoComercial"
              @eliminar="eliminarOperacionCreditoComercial"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Historial crediticio -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Historial crediticio"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_historial"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div v-if="reporte.tiene_historial" class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <essential-table
              :configuracionColumnas="
                $q.screen.xs
                  ? [acciones, ...configuracionColumnasHistorialCrediticio]
                  : configuracionColumnasHistorialCrediticio
              "
              :datos="historialCrediticio"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :mostrarHeader="false"
              :mostrarFooter="false"
              separador="cell"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Cuota mensual buro de credito -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Cuota mensual buró de crédito"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-6">
            <q-checkbox
              v-model="reporte.tiene_cuota_mensual"
              label="El cliente posee datos para el segmento"
            />
          </div>

          <div v-if="reporte.tiene_cuota_mensual" class="col-12 col-md-6">
            <label class="q-mb-sm block">Cuota mensual</label>
            <q-input v-model="reporte.cuota_mensual" outlined dense>
              <template #prepend>
                <q-icon name="bi-currency-dollar" size="xs"></q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Instituciones que han revisado su buro de credito -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Instituciones que han revisado su buró de crédito"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_consultas"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div v-if="reporte.tiene_consultas" class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <essential-table
              :configuracionColumnas="
                $q.screen.xs
                  ? [acciones, ...configuracionColumnasConsultasCliente]
                  : configuracionColumnasConsultasCliente
              "
              :datos="consultasCliente"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :mostrarHeader="false"
              :mostrarFooter="false"
              separador="cell"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Resumen de vencimientos -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Resumen de vencimientos"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_resumen_vencimientos"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_resumen_vencimientos"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasVencimientos,
              ]"
              :datos="vencimientos"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrarBotones="false"
              :mostrarFooter="false"
              :alto-fijo="false"
              separador="cell"
              :agregarElemento="agregarResumenVencimiento"
              @eliminar="eliminarResumenVencimiento"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Análisis de saldos por vencer Sistema Financiero -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Análisis de saldos por vencer sistema financiero"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_saldos_por_vencer"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_saldos_por_vencer"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasSaldosPorVencer,
              ]"
              :datos="saldosPorVencer"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarSaldoPorVencer"
              @eliminar="eliminarSaldoPorVencer"
            ></essential-table>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Mantiene historial crediticio desde</label
            >
            <q-input
              v-model="reporte.historial_crediticio_desde"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="reporte.historial_crediticio_desde"
                      mask="DD-MM-YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Últimas 10 operaciones canceladas -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Últimas 10 operaciones canceladas"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_operaciones_canceladas"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_operaciones_canceladas"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="[
                acciones,
                ...configuracionColumnasOperacionesCanceladas,
              ]"
              :datos="operacionesCanceladas"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :mostrar-botones="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
              :agregarElemento="agregarOperacionCancelada"
              @eliminar="eliminarOperacionCancelada"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Informacion de seguros -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Información de seguros"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-checkbox
              v-model="reporte.tiene_informacion_seguros"
              label="El cliente posee datos para el segmento"
            />
          </div>
        </div>

        <div
          v-if="reporte.tiene_informacion_seguros"
          class="row q-col-gutter-sm q-pa-md"
        >
          <div class="col-12">
            <essential-table
              :configuracionColumnas="
                $q.screen.xs
                  ? [acciones, ...configuracionColumnasSeguros]
                  : configuracionColumnasSeguros
              "
              :datos="seguros"
              :permitirEditarCeldas="true"
              :permitirConsultar="false"
              :permitirEditar="$q.screen.xs"
              :permitirEditarModal="$q.screen.xs"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :mostrarHeader="false"
              :mostrarFooter="false"
              separador="cell"
              :alto-fijo="false"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-page-sticky
        position="bottom-right"
        :offset="[18, $q.screen.xs ? 50 : 28]"
      >
        <q-fab
          icon="add"
          direction="up"
          vertical-actions-align="right"
          color="primary"
          label="Acciones"
          padding="sm lg"
        >
          <!-- Continuar consultando -->
          <q-fab-action
            v-if="permitirEditar"
            color="secondary"
            @click="volverConsultar()"
            padding="sm md"
          >
            <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon
            >Continuar consultando
          </q-fab-action>

          <!-- Guardar cambios -->
          <q-fab-action
            v-if="permitirEditar"
            color="secondary"
            @click="editar()"
            padding="sm md"
          >
            <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>Guardar
            cambios
          </q-fab-action>

          <!-- Previsualizar -->
          <q-fab-action
            v-if="permitirEditar"
            color="secondary"
            @click="previsualizar()"
            padding="sm md"
          >
            <q-icon name="bi-eye" size="xs" class="q-mr-sm"></q-icon
            >Previsualizar
          </q-fab-action>

          <q-fab-action
            v-if="!permitirEditar"
            icon="bi-eye"
            direction="up"
            color="secondary"
            label="Previsualizar"
            padding="sm md"
            @click="generarReporte()"
          ></q-fab-action>

          <q-fab-action
            v-if="!permitirEditar"
            icon="bi-eraser"
            direction="up"
            color="secondary"
            label="Limpiar formulario"
            padding="sm md"
            @click="limpiar()"
          ></q-fab-action>
        </q-fab>
      </q-page-sticky>
    </q-form>

    <essential-selectable-table
      ref="refListadoSeleccionableUsuario"
      :configuracion-columnas="configuracionColumnasUsuarios"
      :datos="listadoUsuarios"
      @selected="seleccionarUsuario"
    ></essential-selectable-table>
  </q-page>
</template>

<script src="./FormularioReporte.ts"></script>
