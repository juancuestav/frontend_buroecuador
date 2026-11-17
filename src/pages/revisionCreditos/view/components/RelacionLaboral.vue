<template>
  <seccion-revision label="Relación laboral" caption="IESS y SRI">
    <div v-if="!relacion.consultada" class="text-grey-8 q-pa-sm">
      <q-icon name="bi-hourglass-split" class="q-mr-xs" />
      No se consultó: la revisión se detuvo antes de validar la relación
      laboral.
    </div>

    <template v-else>
      <!-- Tags -->
      <div class="row items-center chips-relacion q-mb-lg">
        <span
          v-for="tag in tags"
          :key="tag.texto"
          class="chip-moderno"
          :class="`chip-moderno--${tag.tono}`"
        >
          <q-icon :name="tag.icono" size="14px" />
          {{ tag.texto }}
        </span>
      </div>

      <!-- IESS -->
      <div class="q-mb-sm">
        <div class="text-bold text-primary">IESS</div>
        <!-- La base del IESS es una foto mensual de los afiliados activos -->
        <div v-if="corteIess" class="text-caption text-grey-7">
          <q-icon name="bi-calendar-event" class="q-mr-xs" />
          Información del IESS con corte a {{ corteIess }}
        </div>
      </div>

      <div v-if="!afiliacion" class="text-grey-8">
        No registra afiliación al IESS.
      </div>

      <template v-else>
        <campos-lectura :campos="camposIess" />

        <div v-if="otrasAfiliaciones.length" class="q-mt-md">
          <div class="text-bold q-mb-sm">
            Otros empleadores ({{ otrasAfiliaciones.length }})
          </div>
          <essential-table
            :configuracionColumnas="columnasAfiliaciones"
            :datos="otrasAfiliaciones"
            :mostrar-header="false"
            :mostrar-footer="false"
            :alto-fijo="false"
            :grid="false"
          />
        </div>
      </template>

      <!-- RUC -->
      <template v-if="ruc || rucEquifax">
        <q-separator class="q-my-md" />
        <div class="text-bold text-primary q-mb-sm">
          RUC {{ ruc?.numero ?? rucEquifax?.numero }}
          <span v-if="!ruc" class="text-weight-regular text-grey-7">
            · según Equifax
          </span>
        </div>

        <!-- Equifax (dato actualizado) no coincide con la base local del SRI -->
        <div v-if="avisoFuente" class="aviso-fuente row no-wrap q-mb-md">
          <q-icon name="bi-info-circle" size="18px" class="q-mr-sm" />
          <div>{{ avisoFuente }}</div>
        </div>

        <campos-lectura :campos="camposRuc" />
      </template>
    </template>
  </seccion-revision>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { CampoLectura, RevisionCredito } from '../../domain/RevisionCredito'
import {
  formatearFecha,
  formatearMesAnio,
  formatearMoneda,
  textoAnios,
} from '../../domain/formato'
import SeccionRevision from './SeccionRevision.vue'
import CamposLectura from './CamposLectura.vue'

const props = defineProps<{ relacion: RevisionCredito['relacion_laboral'] }>()

// El backend ordena las afiliaciones: primero la más antigua de las que
// califican (seguro general a tiempo completo)
const afiliacion = computed(() => props.relacion.iess[0] ?? null)
// "septiembre de 2026"
const corteIess = computed(() => {
  const fecha =
    props.relacion.iess_fecha_corte ?? afiliacion.value?.fecha_corte ?? null
  return fecha ? formatearMesAnio(fecha) : null
})
const ruc = computed(() => props.relacion.ruc)
const rucEquifax = computed(() => props.relacion.ruc_equifax ?? null)
// Estado que se muestra: el de Equifax tiene prioridad (más actualizado que la base local)
const estadoRuc = computed(
  () => rucEquifax.value?.estado ?? ruc.value?.estado ?? null
)

// La validación del RUC usa la base local del SRI (Equifax se consulta al
// final por su costo). Si Equifax, ya consultado, reporta otra cosa, se avisa.
const avisoFuente = computed(() => {
  const r = ruc.value
  const e = rucEquifax.value
  if (!e?.estado) return null
  if (!r)
    return `La base del SRI no registra este RUC. Equifax lo reporta como ${
      e.estado
    }${
      e.fecha_inicio_actividades
        ? ' desde el ' + formatearFecha(e.fecha_inicio_actividades)
        : ''
    }. La validación del paso 3 usó la base del SRI.`
  if (r.estado !== e.estado)
    return `Equifax reporta el RUC como ${e.estado}; la base del SRI lo registra como ${r.estado}. La validación del paso 3 usó la base del SRI.`
  return null
})

type Tono = 'violeta' | 'azul' | 'teal' | 'naranja' | 'rojo' | 'gris'

interface Tag {
  texto: string
  tono: Tono
  icono: string
}

const tags = computed<Tag[]>(() => {
  const lista: Tag[] = []
  const a = afiliacion.value
  const r = ruc.value

  if (a && r)
    lista.push({ texto: 'IESS y RUC', tono: 'violeta', icono: 'bi-diagram-2' })
  if (a) {
    lista.push(
      a.vigente
        ? { texto: 'Afiliado IESS', tono: 'azul', icono: 'bi-building' }
        : {
            texto: 'IESS sin afiliación vigente',
            tono: 'gris',
            icono: 'bi-building',
          }
    )
    if (a.vigente)
      lista.push({
        texto: `${textoAnios(a.anios)} afiliado`,
        tono: 'azul',
        icono: 'bi-calendar-check',
      })
    // No es seguro general a tiempo completo
    if (a.vigente && a.motivo_no_califica)
      lista.push({
        texto:
          a.tipo_afiliacion === 'general'
            ? 'Tiempo parcial'
            : a.tipo_afiliacion_texto,
        tono: 'rojo',
        icono: 'bi-x-circle',
      })
  }
  const e = rucEquifax.value
  const estado = estadoRuc.value
  if (r) {
    lista.push({
      texto: `RUC ${estado}`,
      tono:
        estado === 'ACTIVO'
          ? 'teal'
          : estado === 'SUSPENDIDO'
          ? 'naranja'
          : 'rojo',
      icono: 'bi-shop',
    })
    if (estado === 'ACTIVO')
      lista.push({
        texto: `${textoAnios(r.anios)} con RUC`,
        tono: 'teal',
        icono: 'bi-calendar-check',
      })
  }
  if (!r && e?.estado)
    lista.push({
      texto: `RUC ${e.estado} · Equifax`,
      tono: e.estado === 'ACTIVO' ? 'teal' : 'naranja',
      icono: 'bi-shop',
    })
  if (!a && !r && !e)
    lista.push({
      texto: 'Sin IESS ni RUC',
      tono: 'rojo',
      icono: 'bi-dash-circle',
    })

  return lista
})

const camposIess = computed<CampoLectura[]>(() => {
  const a = afiliacion.value
  if (!a) return []
  return [
    { etiqueta: 'Empresa', valor: a.empresa, clase: 'col-12 col-md-8' },
    { etiqueta: 'RUC del empleador', valor: a.ruc_empleador },
    {
      etiqueta: 'Tipo de afiliación',
      valor: a.tiempo_completo
        ? a.tipo_afiliacion_texto
        : `${a.tipo_afiliacion_texto} · tiempo parcial`,
      resaltar: true,
    },
    { etiqueta: 'Tipo de empleador', valor: a.tipo_empresa },
    { etiqueta: 'Cargo', valor: a.cargo },
    { etiqueta: 'Sueldo', valor: formatearMoneda(a.sueldo) },
    { etiqueta: 'Fecha de ingreso', valor: formatearFecha(a.fecha_ingreso) },
    {
      // La base del IESS solo trae afiliaciones vigentes al corte
      etiqueta: 'Fecha de salida',
      valor: a.fecha_salida
        ? formatearFecha(a.fecha_salida)
        : 'Sin fecha de salida (vigente al corte)',
    },
    {
      etiqueta: a.fecha_corte ? 'Tiempo afiliado al corte' : 'Tiempo afiliado',
      valor: textoAnios(a.anios),
      resaltar: true,
    },
  ]
})

const camposRuc = computed<CampoLectura[]>(() => {
  const r = ruc.value
  const e = rucEquifax.value
  // Solo Equifax: la base local del SRI no tiene este RUC
  if (!r) {
    if (!e) return []
    return [
      { etiqueta: 'Estado', valor: e.estado, resaltar: true },
      {
        etiqueta: 'Inicio de actividades',
        valor: formatearFecha(e.fecha_inicio_actividades),
      },
      { etiqueta: 'Clase de contribuyente', valor: e.clase },
      { etiqueta: 'Actividad', valor: e.actividad, clase: 'col-12' },
    ]
  }
  const lista: CampoLectura[] = [
    { etiqueta: 'Estado', valor: estadoRuc.value, resaltar: true },
    { etiqueta: 'Tiempo con RUC', valor: textoAnios(r.anios), resaltar: true },
    {
      etiqueta: 'Inicio de actividades',
      valor: formatearFecha(r.fecha_inicio_actividades),
    },
  ]
  if (r.fecha_reinicio_actividades)
    lista.push({
      etiqueta: 'Reinicio de actividades',
      valor: formatearFecha(r.fecha_reinicio_actividades),
    })
  lista.push({
    etiqueta: 'Actividad',
    // La descripción de Equifax es la más actualizada
    valor: e?.actividad ?? r.actividad,
    clase: 'col-12',
  })
  return lista
})

// Filas ya formateadas: essential-table muestra el valor tal cual
const otrasAfiliaciones = computed(() =>
  props.relacion.iess.slice(1).map((a, i) => ({
    id: i,
    empresa: a.empresa ?? '—',
    tipo: a.tiempo_completo
      ? a.tipo_afiliacion_texto
      : `${a.tipo_afiliacion_texto} · tiempo parcial`,
    fecha_ingreso: formatearFecha(a.fecha_ingreso),
    fecha_salida: a.fecha_salida ? formatearFecha(a.fecha_salida) : 'VIGENTE',
    tiempo: textoAnios(a.anios),
  }))
)

type FilaAfiliacion = (typeof otrasAfiliaciones.value)[number]

const columnasAfiliaciones: ColumnConfig<FilaAfiliacion>[] = [
  { name: 'empresa', field: 'empresa', label: 'Empresa', align: 'left' },
  { name: 'tipo', field: 'tipo', label: 'Tipo', align: 'left' },
  {
    name: 'fecha_ingreso',
    field: 'fecha_ingreso',
    label: 'Ingreso',
    align: 'left',
  },
  {
    name: 'fecha_salida',
    field: 'fecha_salida',
    label: 'Salida',
    align: 'left',
  },
  { name: 'tiempo', field: 'tiempo', label: 'Tiempo', align: 'left' },
]
</script>

<style scoped lang="scss">
.chips-relacion {
  gap: 8px;
}

@import './chip-moderno.scss';

// Aviso informativo cuando Equifax y la base local del SRI difieren
.aviso-fuente {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(#e65100, 0.22);
  background: rgba(#e65100, 0.045);
  color: #bf360c;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
