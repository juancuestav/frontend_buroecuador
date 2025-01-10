<template>
  <div class="row">
    <div class="col-3 q-mx-auto q-mb-xl">
      <div class="bg-solid rounded-card q-pa-md text-center q-mb-md">
        <img
          :src="entidad.imagen ?? ''"
          width="100px"
          height="100px"
          class="q-mb-sm rounded-card"
        />
        <div class="text-bold">
          {{ entidad.titulo }}
        </div>
      </div>

      <q-btn
        color="primary"
        class="full-width q-mx-auto block"
        dense
        unelevated
        no-caps
        :href="entidad.link ?? '#'"
        :target="entidad.nueva_pestana ? '_blank' : '_self'"
      >
        <q-icon name="bi-box-arrow-up-right" size="xs" class="q-mr-sm"></q-icon
        >Abrir acceso directo
      </q-btn>
    </div>

    <div class="col-12 text-bold q-mb-md">
      <q-icon name="bi-chat-square-text" class="q-mr-sm"></q-icon>
      Descripción
    </div>

    <div class="col-12 q-mb-md">
      <div
        v-html="entidad.descripcion"
        class="border-white bg-solid q-pa-md rounded-card"
      ></div>
    </div>

    <div class="col-12 text-bold q-mb-md">
      <q-icon name="bi-archive" class="q-mr-sm"></q-icon>
      Archivos
    </div>

    <div class="col-12">
      <gestor-archivos
        ref="refArchivo"
        label="Adjuntar archivos"
        :mixin="mixin"
        :permitir-eliminar="false"
        :permitir-subir="false"
        :multiple="false"
      >
      </gestor-archivos>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { ref } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AccesoDirecto } from '../domain/AccesoDirecto'

/********
 * Mixin
 ********/
const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<AccesoDirecto>,
    required: true,
  },
})

const { entidad } = props.mixin.useReferencias()
const { consultar } = props.mixin.useComportamiento()
const { onConsultado } = props.mixin.useHooks()

/*************
 * Variables
 *************/
const refArchivo = ref()

/********
 * Hooks
 ********/
onConsultado(() =>
  setTimeout(() => refArchivo.value.listarArchivosAlmacenados(entidad.id), 1)
)

defineExpose({
  consultar,
})
</script>
