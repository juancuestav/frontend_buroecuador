<template>
  <div class="tarjeta-doc" :class="`tarjeta-doc--${documento.estado}`">
    <!-- Área principal: si se puede subir, abre el selector de archivos -->
    <div
      class="tarjeta-doc__cuerpo row no-wrap items-center"
      :class="{ 'cursor-pointer': puedeSubir }"
      :role="puedeSubir ? 'button' : undefined"
      :tabindex="puedeSubir ? 0 : undefined"
      @click="elegirArchivo"
      @keydown.enter="elegirArchivo"
    >
      <div class="tarjeta-doc__icono">
        <q-spinner v-if="procesando" size="26px" />
        <q-icon v-else :name="ICONOS[documento.estado]" size="30px" />
      </div>
      <div class="col tarjeta-doc__texto">
        <div class="tarjeta-doc__nombre" :title="documento.nombre">
          {{ documento.nombre }}
          <span v-if="documento.adicional" class="tarjeta-doc__etiqueta">Adicional</span>
        </div>
        <div v-if="documento.detalle" class="tarjeta-doc__detalle" :title="documento.detalle">{{ documento.detalle }}</div>
        <div class="tarjeta-doc__estado" :title="textoEstado">{{ textoEstado }}</div>
        <div v-if="documento.motivo_rechazo && documento.estado === 'rechazado'" class="tarjeta-doc__motivo" :title="documento.motivo_rechazo">
          Motivo: {{ documento.motivo_rechazo }}
        </div>
      </div>
    </div>

    <div class="tarjeta-doc__acciones row items-center q-gutter-xs">
      <q-btn
        v-if="documento.tiene_archivo"
        flat dense no-caps size="sm" icon="bi-eye" label="Ver"
        @click="ver"
      />
      <q-btn
        v-if="documento.tiene_archivo && puedeQuitar"
        flat dense no-caps size="sm" icon="bi-trash" label="Quitar" color="negative"
        @click="quitar"
      />
      <q-checkbox
        v-if="documento.permite_no_tiene && editable"
        :model-value="documento.estado === 'no_tiene'"
        label="No tiene"
        dense
        size="sm"
        :disable="procesando"
        @update:model-value="marcarNoTiene"
      />
      <q-space />
      <template v-if="gestionar">
        <q-btn
          v-if="documento.estado === 'subido'"
          flat dense no-caps size="sm" icon="bi-x-circle" label="Rechazar" color="negative"
          @click="rechazar"
        />
        <q-btn
          v-if="documento.adicional"
          flat dense no-caps size="sm"
          :icon="documento.abierto ? 'bi-lock' : 'bi-unlock'"
          :label="documento.abierto ? 'Cerrar pedido' : 'Reabrir pedido'"
          @click="cambiarPedido"
        />
      </template>
    </div>

    <input
      ref="selector"
      type="file"
      accept="application/pdf,.pdf"
      class="hidden"
      @change="archivoElegido"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import { obtenerMensajeError } from 'pages/revisionCreditos/domain/formato'
import { DocumentoSolicitud, EstadoDocumento, SolicitudCredito } from '../../domain/SolicitudCredito'
import { solicitudesApi } from '../../infraestructure/solicitudesApi'

const TAMANIO_MAXIMO = 10 * 1024 * 1024

const ICONOS: Record<EstadoDocumento, string> = {
  pendiente: 'bi-file-earmark-arrow-up',
  subido: 'bi-file-earmark-check',
  no_tiene: 'bi-file-earmark-x',
  rechazado: 'bi-file-earmark-excel',
}

const props = defineProps<{
  documento: DocumentoSolicitud
  solicitudId: number
  /** El asesor puede editar la solicitud (no enviada) */
  editable: boolean
  /** El administrador gestiona la solicitud (enviada) */
  gestionar?: boolean
}>()
const emit = defineEmits<{ (e: 'actualizada', modelo: SolicitudCredito): void }>()

const $q = useQuasar()
const { notificarCorrecto, notificarError, notificarAdvertencia } = useNotificaciones()

const procesando = ref(false)
const selector = ref<HTMLInputElement | null>(null)

const puedeSubir = computed(() => props.documento.puede_subir && !procesando.value)
const puedeQuitar = computed(() => props.editable && !props.documento.adicional)

const textoEstado = computed(() => {
  const d = props.documento
  switch (d.estado) {
    case 'subido':
      return `Subido${d.nombre_archivo ? ': ' + d.nombre_archivo : ''}`
    case 'no_tiene':
      return 'El cliente no tiene este documento'
    case 'rechazado':
      return d.puede_subir ? 'Rechazado: toque para subirlo de nuevo' : 'Rechazado por el administrador'
    default:
      if (d.adicional && !d.abierto) return 'Pedido cerrado'
      return d.puede_subir ? 'Toque para subir el PDF' : 'Pendiente'
  }
})

function elegirArchivo() {
  if (!puedeSubir.value) return
  if (selector.value) {
    selector.value.value = ''
    selector.value.click()
  }
}

async function ejecutar(accion: () => Promise<{ modelo: SolicitudCredito; mensaje: string | null }>, error: string) {
  procesando.value = true
  try {
    const respuesta = await accion()
    emit('actualizada', respuesta.modelo)
    if (respuesta.mensaje) notificarCorrecto(respuesta.mensaje)
  } catch (e) {
    notificarError(obtenerMensajeError(e, error))
  } finally {
    procesando.value = false
  }
}

async function archivoElegido(evento: Event) {
  const archivo = (evento.target as HTMLInputElement).files?.[0]
  if (!archivo) return
  // Solo PDF (el servidor también valida el contenido)
  if (archivo.type !== 'application/pdf' && !archivo.name.toLowerCase().endsWith('.pdf')) {
    notificarAdvertencia('Solo se permiten archivos PDF.')
    return
  }
  if (archivo.size > TAMANIO_MAXIMO) {
    notificarAdvertencia('El archivo no puede pesar más de 10 MB.')
    return
  }
  await ejecutar(
    () =>
      solicitudesApi.subirDocumento(props.solicitudId, props.documento.id, archivo),
    'No se pudo subir el documento.'
  )
}

function quitar() {
  ejecutar(() => solicitudesApi.quitarDocumento(props.solicitudId, props.documento.id), 'No se pudo quitar el documento.')
}

function marcarNoTiene(valor: boolean) {
  ejecutar(() => solicitudesApi.noTiene(props.solicitudId, props.documento.id, valor), 'No se pudo actualizar el documento.')
}

function cambiarPedido() {
  ejecutar(
    () => solicitudesApi.pedidoDocumento(props.solicitudId, props.documento.id, !props.documento.abierto),
    'No se pudo actualizar el pedido.'
  )
}

function rechazar() {
  $q.dialog({
    title: `Rechazar "${props.documento.nombre}"`,
    message: 'Indique el motivo; el asesor podrá subirlo de nuevo.',
    prompt: { model: '', type: 'text', isValid: (v: string) => v.trim().length > 2 },
    cancel: { label: 'Cancelar', flat: true, noCaps: true },
    ok: { label: 'Rechazar', color: 'negative', unelevated: true, noCaps: true },
  }).onOk((motivo: string) =>
    ejecutar(
      () => solicitudesApi.rechazarDocumento(props.solicitudId, props.documento.id, motivo.trim()),
      'No se pudo rechazar el documento.'
    )
  )
}

/** PDF privado: se descarga con el token y se abre en otra pestaña */
async function ver() {
  try {
    $q.loading.show({ message: 'Obteniendo documento...' })
    const url = await solicitudesApi.verDocumento(props.solicitudId, props.documento.id)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
  } catch (e) {
    notificarError('No se pudo abrir el documento.')
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped lang="scss">
// Recorta el texto a n líneas con "…" (el texto completo queda en el título)
@mixin recortar($lineas) {
  display: -webkit-box;
  -webkit-line-clamp: $lineas;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

$tonos: (
  pendiente: #1e63d6,
  subido: #2e7d32,
  no_tiene: #78909c,
  rechazado: #d32f2f,
);

.tarjeta-doc {
  // Alto fijo: no cambia al subir, quitar o rechazar un documento
  height: 172px;
  border-radius: 14px;
  border: 1px solid;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @each $estado, $color in $tonos {
    &--#{$estado} {
      border-color: rgba($color, 0.3);
      .tarjeta-doc__cuerpo {
        background: rgba($color, 0.09);
      }
      .tarjeta-doc__icono,
      .tarjeta-doc__nombre {
        color: $color;
      }
    }
  }

  &__cuerpo {
    padding: 14px 16px;
    gap: 14px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    transition: filter 0.15s;
    &.cursor-pointer:hover {
      filter: brightness(0.97);
    }
  }

  &__icono {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__texto {
    min-width: 0;
  }

  &__nombre {
    font-weight: 700;
    font-size: 0.98rem;
    line-height: 1.3;
    @include recortar(2);
  }

  &__etiqueta {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 1px 8px;
    border-radius: 999px;
    border: 1px solid currentColor;
    margin-left: 6px;
  }

  &__detalle,
  &__estado {
    font-size: 0.8rem;
    color: #607d8b;
    @include recortar(1);
  }

  &__motivo {
    font-size: 0.8rem;
    color: #d32f2f;
    @include recortar(1);
  }

  &__acciones {
    padding: 4px 8px;
    height: 38px;
    flex-shrink: 0;
  }
}
</style>
