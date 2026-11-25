<template>
  <div>
    <seccion-revision label="Cliente">
      <campos-lectura solo-texto :campos="camposCliente" />
    </seccion-revision>

    <seccion-revision label="Datos de contacto">
      <campos-lectura solo-texto :campos="camposContacto" />
    </seccion-revision>

    <seccion-revision label="Referencias personales">
      <div v-if="!solicitud.referencias.length" class="text-grey-7">Sin referencias.</div>
      <campos-lectura
        v-for="(r, i) in solicitud.referencias"
        :key="i"
        solo-texto
        class="q-mb-sm"
        :campos="[
          { etiqueta: `Referencia ${i + 1}`, valor: r.nombres, resaltar: true, clase: 'col-12 col-md-3' },
          { etiqueta: 'Parentesco', valor: r.parentesco, clase: 'col-6 col-md-2' },
          { etiqueta: 'Celular', valor: r.celular, clase: 'col-6 col-md-2' },
          { etiqueta: 'Dirección', valor: r.direccion, clase: 'col-12 col-md-5' },
        ]"
      />
    </seccion-revision>

    <seccion-revision
      label="Banco, relación económica y monto"
      :caption="`Tasa ${formatearNumero(solicitud.tasa_anual)}% anual · capacidad de pago ${solicitud.porcentaje_capacidad ?? '—'}% del ingreso neto`"
    >
      <campos-lectura solo-texto :campos="camposEconomicos" />
      <div v-if="solicitud.ingreso_modificado" class="text-caption text-orange-9 q-mt-sm">
        <q-icon name="bi-exclamation-triangle" /> Ingreso modificado: IESS
        {{ formatearMoneda(solicitud.ingreso_iess_original) }} → declarado
        {{ formatearMoneda(solicitud.ingreso_iess) }}.
      </div>
      <analisis-calculo
        v-if="solicitud.plazo_meses && solicitud.capacidad_pago && solicitud.tasa_anual !== null"
        class="q-mt-md"
        :capacidad="solicitud.capacidad_pago"
        :tasa-anual="solicitud.tasa_anual"
        :plazo-meses="solicitud.plazo_meses"
        :monto-solicitado="solicitud.monto_solicitado"
      />
    </seccion-revision>

    <seccion-revision v-if="solicitud.estado === 'APROBADO'" label="Aprobación del banco">
      <campos-lectura
        solo-texto
        :campos="[
          { etiqueta: 'Monto aprobado', valor: formatearMoneda(solicitud.monto_aprobado), resaltar: true },
          { etiqueta: 'Plazo aprobado', valor: textoPlazo(solicitud.plazo_aprobado) },
          { etiqueta: 'Cuota aprobada', valor: formatearMoneda(solicitud.cuota_aprobada) },
        ]"
      />
    </seccion-revision>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeccionRevision from 'pages/revisionCreditos/view/components/SeccionRevision.vue'
import CamposLectura from 'pages/revisionCreditos/view/components/CamposLectura.vue'
import {
  formatearFechaBarra,
  formatearMoneda,
  formatearNumero,
} from 'pages/revisionCreditos/domain/formato'
import { SolicitudCredito } from '../../domain/SolicitudCredito'
import AnalisisCalculo from './AnalisisCalculo.vue'

const props = defineProps<{ solicitud: SolicitudCredito }>()

// 60 meses → "5 años (60 meses)"
function textoPlazo(meses: number | null) {
  if (!meses) return null
  const anios = meses / 12
  if (!Number.isInteger(anios)) return `${meses} meses`
  return `${anios} ${anios === 1 ? 'año' : 'años'} (${meses} meses)`
}

const TIPOS = { IESS: 'IESS', RUC: 'RUC', AMBOS: 'Ambos (IESS y RUC)' }

const camposCliente = computed(() => [
  { etiqueta: 'Cédula', valor: props.solicitud.identificacion },
  { etiqueta: 'Nombres', valor: props.solicitud.nombres, resaltar: true },
  { etiqueta: 'Puntaje (score Equifax)', valor: props.solicitud.score },
  {
    etiqueta: 'Consulta Equifax',
    valor: props.solicitud.equifax_consultado_at
      ? `${formatearFechaBarra(props.solicitud.equifax_consultado_at)} (hace ${props.solicitud.equifax_dias} días)`
      : null,
  },
  { etiqueta: 'Pertenece a', valor: props.solicitud.asesor },
  ...(props.solicitud.registrado_por && props.solicitud.registrado_por_id !== props.solicitud.asesor_id
    ? [{ etiqueta: 'Registrada por', valor: props.solicitud.registrado_por }]
    : []),
  {
    etiqueta: 'Autorización',
    valor: props.solicitud.con_autorizacion
      ? `Con autorización${props.solicitud.autorizado_por ? ' de ' + props.solicitud.autorizado_por : ''}`
      : 'El perfil califica',
  },
])

const fuente = (campo: string) => {
  const origen = (props.solicitud.contacto as Record<string, string | null> | null)?.[`fuente_${campo}`]
  return origen ? ` (${origen})` : ''
}
const camposContacto = computed(() => {
  const c = props.solicitud.contacto
  return [
    { etiqueta: 'Celular' + fuente('celular'), valor: c?.celular, clase: 'col-12 col-sm-6 col-md-3' },
    { etiqueta: 'Correo' + fuente('correo'), valor: c?.correo, clase: 'col-12 col-sm-6 col-md-3' },
    { etiqueta: 'Dirección domicilio' + fuente('direccion_domicilio'), valor: c?.direccion_domicilio, clase: 'col-12 col-md-3' },
    { etiqueta: 'Dirección trabajo' + fuente('direccion_trabajo'), valor: c?.direccion_trabajo, clase: 'col-12 col-md-3' },
  ]
})

const camposEconomicos = computed(() => {
  const s = props.solicitud
  const conIess = s.tipo_ingreso === 'IESS' || s.tipo_ingreso === 'AMBOS'
  const conRuc = s.tipo_ingreso === 'RUC' || s.tipo_ingreso === 'AMBOS'
  return [
    { etiqueta: 'Banco', valor: s.banco_nombre, resaltar: true },
    { etiqueta: 'Relación económica', valor: s.tipo_ingreso ? TIPOS[s.tipo_ingreso] : null },
    ...(conIess ? [{ etiqueta: 'Ingreso IESS', valor: formatearMoneda(s.ingreso_iess) }] : []),
    ...(conRuc ? [{ etiqueta: 'Ingreso RUC', valor: formatearMoneda(s.ingreso_ruc) }] : []),
    ...(conRuc && s.actividad_descripcion
      ? [{ etiqueta: 'Actividad del cliente', valor: s.actividad_descripcion, clase: 'col-12' }]
      : []),
    { etiqueta: 'Ingresos totales', valor: formatearMoneda(s.ingresos_totales) },
    { etiqueta: 'Cuota buró', valor: formatearMoneda(s.cuota_buro) },
    { etiqueta: 'Ingreso neto', valor: formatearMoneda(s.ingreso_neto) },
    { etiqueta: 'Capacidad de pago', valor: formatearMoneda(s.capacidad_pago), resaltar: true },
    { etiqueta: 'Plazo', valor: textoPlazo(s.plazo_meses) },
    { etiqueta: 'Día de pago', valor: s.dia_pago ? `${s.dia_pago} de cada mes` : null },
    { etiqueta: 'Monto sugerido (máximo)', valor: formatearMoneda(s.monto_sugerido) },
    { etiqueta: 'Monto solicitado', valor: formatearMoneda(s.monto_solicitado), resaltar: true },
    { etiqueta: 'Cuota del préstamo', valor: formatearMoneda(s.cuota_prestamo) },
    { etiqueta: 'Nueva cuota buró', valor: formatearMoneda(s.nueva_cuota_buro) },
  ]
})
</script>
