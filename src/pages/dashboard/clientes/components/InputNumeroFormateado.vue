<template>
  <q-input
    ref="inputRef"
    :model-value="textoMostrado"
    type="text"
    inputmode="decimal"
    dense
    outlined
    :label="label"
    :hint="hint"
    @update:model-value="onEscribir"
    @blur="onSalir"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { QInput } from 'quasar'

// Input numérico con coma de miles y punto decimal en vivo, mientras el
// usuario escribe (convención usada en Ecuador para USD en este dashboard —
// ver `agruparMiles` en el domain, que usa el mismo formato 'en-US' para
// mostrar los valores ya guardados). `decimales=0` para conteos (clientes,
// cédulas: no tiene sentido "150.5 clientes") y `decimales=2` para montos.
const props = withDefaults(
  defineProps<{
    modelValue: number
    decimales?: number
    label?: string
    hint?: string
  }>(),
  { decimales: 0 }
)

const emit = defineEmits<{ 'update:modelValue': [valor: number] }>()

const inputRef = ref<QInput | null>(null)

// Mientras se edita se muestra el texto tal cual se va formateando (para no
// pelear con un punto decimal a medio escribir, p. ej. "1,234."); en reposo
// se deriva directamente del número real que llega por prop.
const textoEdicion = ref<string | null>(null)
const textoMostrado = computed(
  () => textoEdicion.value ?? formatearNumero(props.modelValue, props.decimales)
)

function formatearNumero(valor: number, decimales: number): string {
  if (!Number.isFinite(valor)) return ''
  return valor.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  })
}

/** Deja solo dígitos y, si aplica, un único punto decimal con como máximo
 * `decimales` dígitos después. */
function limpiarTexto(textoCrudo: string, decimales: number): string {
  if (decimales === 0) return textoCrudo.replace(/[^\d]/g, '')

  const soloValido = textoCrudo.replace(/[^\d.]/g, '')
  const primerPunto = soloValido.indexOf('.')
  if (primerPunto === -1) return soloValido

  const enteroTxt = soloValido.slice(0, primerPunto)
  const decimalTxt = soloValido
    .slice(primerPunto + 1)
    .replace(/\./g, '')
    .slice(0, decimales)
  return `${enteroTxt}.${decimalTxt}`
}

function agregarSeparadoresMiles(limpio: string): string {
  const [enteroTxt, decimalTxt] = limpio.split('.')
  const enteroFormateado = enteroTxt
    ? Number(enteroTxt).toLocaleString('en-US')
    : enteroTxt
  return decimalTxt === undefined
    ? enteroFormateado
    : `${enteroFormateado}.${decimalTxt}`
}

function contarDigitosAntes(texto: string, posicion: number): number {
  let cuenta = 0
  for (let i = 0; i < posicion && i < texto.length; i++) {
    if (/\d/.test(texto[i])) cuenta++
  }
  return cuenta
}

/** Posición del cursor tras el n-ésimo dígito del texto ya formateado —
 * así insertar/borrar dígitos no hace saltar el cursor al final cuando el
 * separador de miles se recalcula en cada tecla. */
function posicionTrasNDigitos(texto: string, nDigitos: number): number {
  if (nDigitos <= 0) return 0
  let vistos = 0
  for (let i = 0; i < texto.length; i++) {
    if (/\d/.test(texto[i])) {
      vistos++
      if (vistos === nDigitos) return i + 1
    }
  }
  return texto.length
}

function onEscribir(valor: string | number | null) {
  const textoCrudo = String(valor ?? '')
  const nativo = inputRef.value?.getNativeElement()
  const cursorPrevio = nativo?.selectionStart ?? textoCrudo.length
  const digitosAntes = contarDigitosAntes(textoCrudo, cursorPrevio)

  const limpio = limpiarTexto(textoCrudo, props.decimales)
  const formateado = agregarSeparadoresMiles(limpio)
  textoEdicion.value = formateado

  const numero = limpio === '' || limpio === '.' ? 0 : Number(limpio)
  emit('update:modelValue', Number.isFinite(numero) ? numero : 0)

  void nextTick(() => {
    if (!nativo) return
    const nuevaPosicion = posicionTrasNDigitos(formateado, digitosAntes)
    nativo.setSelectionRange(nuevaPosicion, nuevaPosicion)
  })
}

function onSalir() {
  // Vuelve a derivarse de modelValue (ya limpio: sin punto colgante, sin
  // más decimales que los permitidos).
  textoEdicion.value = null
}
</script>
