<template>
  <q-dialog
    v-model="abierto"
    :maximized="modalMaximized"
    :full-width="true"
    persistent
    top
  >
    <q-card
      flat
      class="bg-transparent rounded-card no-border"
      :class="{ 'q-py-md q-px-xl': !$q.screen.xs }"
    >
      <q-toolbar class="bg-body rounded-header">
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title>Editar fila</q-toolbar-title>

        <q-btn
          round
          glossy
          push
          dense
          color="negative"
          icon="bi-x"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section class="bg-body rounded-footer">
        <div class="row q-col-gutter-xs q-mb-md">
          <!-- Selects -->
          <div
            v-for="field in fieldsSelect"
            :key="field.field"
            class="col-12 col-md-3 q-mb-sm"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-select
              v-model="field.valor"
              :options="field.options"
              transition-show="scale"
              transition-hide="scale"
              :hint="field.hint"
              options-dense
              dense
              outlined
              :option-label="(item) => item.label"
              :option-value="(item) => item.label"
              use-input
              input-debounce="0"
              @filter="(val, update) => {
                const opciones = field.options
                  if (val === '') {
                    update(() => {
                      field.options = opciones
                    })
                    return
                  }
                  update(() => {
                    field.options = field.options!.filter(
                      (item) =>item.label.toLowerCase().indexOf(val.toLowerCase())>-1)
                  })
                }
              "
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Toggles -->
          <div
            v-for="field in fieldsToggle"
            :key="field.field"
            class="col-12 col-md-3"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-toggle
              keep-color
              v-model="field.valor"
              :label="field.valor ? 'SI' : 'NO'"
            />
          </div>
          <!-- Inputs normales -->
          <!-- :class="{ 'col-12 q-mb-sm': true, 'col-md-3': fields.length > 1 }" -->
          <div
            v-for="field in fields"
            :key="field.field"
            class="col-12 col-md-3"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-input
              v-model="field.valor"
              type="text"
              :autogrow="field.type !== 'number'"
              :hint="field.hint"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Imagenes -->
          <!-- :class="{ 'col-12 q-mb-sm': true, 'col-md-3': fields.length > 1 }" -->
          <div
            v-for="field in fieldsImagen"
            :key="field.field"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">{{ field.label }}</label>
            <selector-imagen
              :imagen="field.valor"
              file_extensiones=".jpg, image/*"
              @update:modelValue="(data) => (field.valor = data)"
              :hint="field.hint"
            >
            </selector-imagen>
          </div>
        </div>

        <!-- Botones formulario -->
        <div class="row q-gutter-md justify-end">
          <q-btn color="primary" no-caps @click="guardar()" push>
            <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>
            <div>Guardar</div>
          </q-btn>

          <q-btn color="negative" no-caps @click="cerrarModalEntidad()" push>
            <q-icon name="bi-x" size="xs" class="q-mr-sm"></q-icon>
            <div>Cancelar</div>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ColumnConfig } from '../domain/ColumnConfig'
import { computed, reactive, ref, defineComponent } from 'vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    SelectorImagen,
  },
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    fila: {
      type: Object as () => EntidadAuditable,
      required: false,
    },
    modalMaximized: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['limpiar', 'guardar'],

  // normal
  setup(props, { emit }) {
    const { notificarAdvertencia } = useNotificaciones()

    const fields = computed(() =>
      props.configuracionColumnas
        .map((fila: ColumnConfig<any>) => {
          return reactive({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            hint: fila.hint,
          })
        })
        .filter(
          (fila) =>
            fila.field !== 'acciones' &&
            fila.type !== 'imagen' &&
            fila.type !== 'select' &&
            fila.type !== 'toggle' &&
            fila.editable
        )
    )

    // select
    const fieldsSelect = computed(() =>
      props.configuracionColumnas
        .map((fila: ColumnConfig<any>) => {
          return reactive({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            options: fila.options,
            hint: fila.hint,
          })
        })
        .filter(
          (fila) =>
            fila.field !== 'acciones' && fila.type === 'select' && fila.editable
        )
    )
    // Todos los campos
    const fieldsAll = computed(() =>
      props.configuracionColumnas
        .map((fila: ColumnConfig<any>) => {
          return reactive({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            hint: fila.hint,
          })
        })
        .filter((fila) => fila.field !== 'acciones')
    )
    //toggles
    const fieldsToggle = computed(() =>
      props.configuracionColumnas
        .map((fila: ColumnConfig<any>) => {
          return reactive({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            hint: fila.hint,
          })
        })
        .filter(
          (fila) =>
            fila.field !== 'acciones' && fila.type === 'toggle' && fila.editable
        )
    )

    // imagenes
    const fieldsImagen = computed(() =>
      props.configuracionColumnas
        .map((fila: ColumnConfig<any>) => {
          return reactive({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            hint: fila.hint,
          })
        })
        .filter(
          (fila) =>
            fila.field !== 'acciones' && fila.type === 'imagen' && fila.editable
        )
    )

    const abierto = ref(false) //computed(() => !!props.fila)

    function abrir() {
      abierto.value = true
    }

    function guardar() {
      var mapped = fields.value.map((item) => ({ [item.field]: item.valor }))
      var mappedSelect = fieldsSelect.value.map((item) => ({
        [item.field]: item.valor,
      }))
      var mappedToggle = fieldsToggle.value.map((item) => ({
        [item.field]: item.valor,
      }))
      var mappedImagen = fieldsImagen.value.map((item) => ({
        [item.field]: item.valor,
      }))
      const mappedAll = fieldsAll.value.map((item) => ({
        [item.field]: item.valor,
      }))
      const mappedLleno = [
        ...mappedAll,
        ...mapped,
        ...mappedSelect,
        ...mappedImagen,
        ...mappedToggle,
      ]
      const newObj = Object.assign({}, ...mapped)

      Object.assign(newObj, ...mappedSelect)
      Object.assign(newObj, ...mappedImagen)
      Object.assign(newObj, ...mappedAll)
      Object.assign(newObj, ...mappedLleno)

      const valido = validarRequeridos(newObj)

      if (valido) {
        emit('guardar', newObj)
        abierto.value = false
      }
    }

    function cerrarModalEntidad() {
      abierto.value = false
      emit('limpiar')
    }

    // function filtrarSelect(val, update) {
    // const opciones = fieldsSelect.filter
    // console.log(val)
    // if(val ===''){
    //   update(()=>{
    //     opciones = opciones
    //   })
    //   return
    // }
    // update(()=>{
    //   opciones = opciones.filter((item) => item.label.toLowerCase().includes(val.toLowerCase()))
    // })
    // }

    // Antes de cerrar el modal
    function validarRequeridos(fila) {
      const requeridos: any = props.configuracionColumnas
        .filter((item) => item.requerido)
        .map((item) => item.field)

      // console.log(requeridos)
      let valido = true

      for (let key in fila) {
        if (requeridos.includes(key) && !fila[key]) {
          valido = false
          notificarAdvertencia('El campo ' + key + ' es requerido')
        }
      }

      return valido
    }

    return {
      fields,
      fieldsSelect,
      fieldsToggle,
      fieldsAll,
      fieldsImagen,
      abierto,
      abrir,
      guardar,
      cerrarModalEntidad,
    }
  },
})
</script>
