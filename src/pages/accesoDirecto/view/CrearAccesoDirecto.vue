<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-bold">Crear acceso directo</div>
    <div class="col-12 col-md-5">
      <label class="q-mb-sm block">Titulo</label>
      <q-input
        v-model="entidad.titulo"
        placeholder="Obligatorio"
        outlined
        dense
      >
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <label class="q-mb-sm block">Link</label>
      <q-input v-model="entidad.link" placeholder="https://" outlined dense>
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <br />
      <q-checkbox
        v-model="entidad.nueva_pestana"
        label="Abrir en nueva pestaña"
      />
    </div>

    <!-- Descripcion -->
    <div class="col-12 col-md-9">
      <div class="row justify-between">
        <label class="q-mb-sm block">Descripción</label>
        <b class="text-italic">*No enviar imágenes demasiado grandes</b>
      </div>
      <essential-editor v-model="entidad.descripcion" :disable="false">
      </essential-editor>
    </div>

    <div class="col-12 col-md-3">
      <label for="q-mb-sm block">Imagen <i>(Icono de acceso directo)</i></label>
      <selector-imagen
        file_extensiones=".jpg, image/*"
        :imagen="entidad.imagen"
        :comprimir="false"
        :alto="'400px'"
        :error="!!v$.imagen.$errors.length"
        @update:model-value="(base64: string) => (entidad.imagen = base64)"
      >
        <template v-slot:error>
          <div v-for="error of v$.imagen.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </selector-imagen>
    </div>

    <div class="col-12 q-mb-md">
      <gestor-archivos
        ref="refArchivo"
        label="Adjuntar archivos"
        :mixin="mixin"
        :permitir-eliminar="true"
      >
      </gestor-archivos>
    </div>
  </div>

  <div class="row justify-end q-col-gutter-x-xs q-pt-md">
    <button-submits
      :accion="accion"
      @guardar="guardar(entidad)"
      @editar="editar(entidad)"
      @cancelar="$emit('cancelar')"
    />
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { ref } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AccesoDirecto } from 'pages/accesoDirecto/domain/AccesoDirecto'

defineEmits(['cancelar'])

/********
 * Mixin
 ********/
const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<AccesoDirecto>,
    required: true,
  },
})

const { entidad, accion } = props.mixin.useReferencias()
const { guardar, setValidador, reestablecer, editar } =
  props.mixin.useComportamiento()
const { onGuardado, onModificado } = props.mixin.useHooks()

/***********
 * Varibles
 ***********/
const refArchivo = ref()

/*************
 * Reglas
 **************/
const reglas = {
  titulo: { required },
  imagen: { required },
}

const v$ = useVuelidate(reglas, entidad)
setValidador(v$.value)

/************
 * Funciones
 ************/
const subirArchivos = async (id: number) => await refArchivo.value.subir({ id })

onGuardado((id?: number) => {
  if (id) setTimeout(() => subirArchivos(id), 1)
  reestablecer()
})

onModificado((id?: number) => {
  if (id) setTimeout(() => subirArchivos(id), 1)
  reestablecer()
})

const limpiarArchivos = () => refArchivo.value.limpiarListado()
const listarArchivos = (id: number) =>
  setTimeout(() => refArchivo.value.listarArchivosAlmacenados(id), 1)

defineExpose({
  limpiarArchivos,
  listarArchivos,
})
</script>
