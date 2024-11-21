<template>
  <q-file
    v-if="mostrarCampo"
    v-model="img"
    dense
    outlined
    class="q-mt-sm"
    clearable
    @update:model-value="setBase64"
    @clear="limpiar()"
    :disable="disable"
    accept=".png, .jpg, .jpeg"
    :label="placeholder"
    :error="error"
    :hint="hint"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:error>
      <slot name="error" v-if="slotUsado"></slot>
      <slot name="error" v-else>
        <div>
          <div class="error-msg">Imagen requerida</div>
        </div></slot
      >
    </template>
  </q-file>

  <div class="bg-desenfoque">
    <q-img
      v-show="imagenCodificada"
      :src="imagenCodificada ?? ''"
      width="100%"
      :height="alto"
      fit="contain"
      class="border-white"
    >
    </q-img>

    <small v-if="imagenCodificada" class="block text-center">
      <!-- @click="opened = true" -->
      <q-btn
        @click="refVisorImagen.abrir(imagenCodificada)"
        label="Ver en pantalla completa"
        icon="bi-eye"
        class="text-grey-8 full-width bg-white border-white"
        no-caps
        no-wrap
        square
        unelevated
      />
    </small>
  </div>

  <visor-imagen
    ref="refVisorImagen"
    :texto1="texto1"
    :texto2="texto2"
    :texto3="texto3"
    :texto4="texto4"
    :texto5="texto5"
  ></visor-imagen>
</template>

<script lang="ts" setup>
import VisorImagen from 'components/VisorImagen.vue'
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  imagen: String as () => string | null | undefined,
  disable: Boolean,
  file_extensiones: String,
  error: Boolean,
  alto: String,
  hint: String,
  placeholder: { type: String, default: 'Opcional' },
  texto1: String,
  texto2: String,
  texto3: String,
  texto4: String,
  texto5: String,
  mostrarCampo: {
    type: Boolean,
    default: true,
  },
  comprimir: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const instance = getCurrentInstance()
const slots = instance?.slots

onMounted(() => {
  slotUsado.value = !!slots?.error
})

const refVisorImagen = ref()
const slotUsado = ref(false)
const fileSize = ref()
const img = ref()
const imagenCodificada = computed(() => props.imagen)
const alto = computed(() => props.alto ?? '160px')

const setBase64 = async (file: File) => {
  if (file !== null && file !== undefined) {
    fileSize.value = file.size
    const reader = new FileReader()
    const compressedFile = props.comprimir ? await compressImage(file) : file

    reader.readAsDataURL(compressedFile)
    reader.onload = () => emit('update:modelValue', reader.result)
    fileSize.value = compressedFile.size
  } else {
    fileSize.value = null
  }
}

async function compressImage(file) {
  return new Promise<File>((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result?.toString() || ''

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxWidth = 1600 // Tamaño máximo después de la compresión (puedes ajustar esto según tus necesidades)
        let newWidth = img.width
        let newHeight = img.height

        if (img.width > maxWidth) {
          const ratio = maxWidth / img.width
          newWidth = maxWidth
          newHeight = img.height * ratio
        }

        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile: File = new File([blob], file.name, {
                type: 'image/jpeg', // Ajusta el tipo de archivo según tus necesidades
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          0.7 // Ajusta la calidad de compresión (0.7 en este caso)
        ) // Si se coloca en 1 (una imagen grande pesará alrededor de 2gb)
      }
    }

    reader.readAsDataURL(file)
  })
}

watch(imagenCodificada, () => {
  if (!imagenCodificada.value) img.value = null
})

function limpiar() {
  emit('update:modelValue', null)
}
</script>

<style lang="scss">
.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 9999;
}
</style>
