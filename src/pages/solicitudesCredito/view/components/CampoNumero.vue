<template>
  <!-- Campo numérico sin flechas: acepta coma o punto decimal y, al salir,
       se formatea con los decimales indicados (montos: 1600 → 1600.00) -->
  <q-input
    :model-value="texto"
    type="text"
    :inputmode="decimales > 0 ? 'decimal' : 'numeric'"
    autocomplete="off"
    v-bind="$attrs"
    @update:model-value="escribir"
    @blur="formatear"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{ modelValue: number | null; decimales?: number }>(), {
  decimales: 2,
})
const emit = defineEmits<{ (e: 'update:modelValue', valor: number | null): void }>()

const aTexto = (valor: number | null) =>
  valor === null || valor === undefined || Number.isNaN(valor) ? '' : Number(valor).toFixed(props.decimales)

const texto = ref(aTexto(props.modelValue))

// Cambios desde fuera (p. ej. al cargar la solicitud) sin pisar lo que se escribe
watch(
  () => props.modelValue,
  (valor) => {
    if (valor !== aNumero(texto.value)) texto.value = aTexto(valor)
  }
)

function aNumero(valor: string): number | null {
  const limpio = valor.replace(',', '.').trim()
  if (limpio === '' || limpio === '.') return null
  const numero = Number(limpio)
  return Number.isFinite(numero) ? numero : null
}

function escribir(valor: string | number | null) {
  // Solo dígitos y un separador decimal (si se permiten decimales)
  let limpio = String(valor ?? '').replace(props.decimales > 0 ? /[^\d.,]/g : /\D/g, '')
  const separador = limpio.search(/[.,]/)
  if (separador >= 0) {
    const decimales = limpio.slice(separador + 1).replace(/[.,]/g, '').slice(0, props.decimales)
    limpio = limpio.slice(0, separador) + '.' + decimales
  }
  texto.value = limpio
  emit('update:modelValue', aNumero(limpio))
}

function formatear() {
  const numero = aNumero(texto.value)
  texto.value = aTexto(numero)
  emit('update:modelValue', numero === null ? null : Number(numero.toFixed(props.decimales)))
}
</script>
