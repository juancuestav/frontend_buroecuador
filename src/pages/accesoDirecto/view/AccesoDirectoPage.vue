<template>
  <multiple-page-layout :mixin="mixin" @regresar="reestablecer()">
    <template #tab1>
      <q-page padding>
        <div class="row justify-between items-center q-mb-md">
          <span class="text-h6 text-bold q-mb-md">Accesos directos</span>
          <q-btn
            v-if="authenticationStore.can('crear.accesos_directos')"
            :color="mostrarCrearAccesoDirecto ? 'blue-10' : 'primary'"
            @click="mostrarCrearAccesoDirecto = !mostrarCrearAccesoDirecto"
            rounded
            no-wrap
            unelevated
            no-caps
          >
            <q-icon
              :name="
                mostrarCrearAccesoDirecto ? 'bi-chevron-up' : 'bi-chevron-down'
              "
              size="xs"
              class="q-mr-xs"
            ></q-icon
            >{{
              (mostrarCrearAccesoDirecto ? 'Ocultar' : 'Mostrar') +
              ' formulario para crear nuevo acceso directo'
            }}
          </q-btn>
        </div>

        <transition name="bounce">
          <div
            v-show="mostrarCrearAccesoDirecto"
            class="row q-mb-xl bg-desenfoque rounded-card q-pa-md"
          >
            <div class="col-12">
              <crear-acceso-directo
                ref="refCrearAccesoDirecto"
                :mixin="mixin"
                @cancelar="
                  () => {
                    mostrarCrearAccesoDirecto = false
                    reestablecer()
                  }
                "
              ></crear-acceso-directo>
            </div>
          </div>
        </transition>

        <div class="row q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="tituloBuscar"
              placeholder="Buscar acceso directo..."
              @update:model-value="onInputChange()"
              outlined
              dense
            >
              <template #prepend><q-icon name="bi-search"></q-icon></template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div
            v-for="accesoDirecto in listado"
            :key="accesoDirecto.id"
            class="col-6 col-md-2 col-sm-3"
          >
            <card-acceso-directo
              :acceso-directo="accesoDirecto"
              @click="consultarAccesoDirecto(accesoDirecto.id)"
              @eliminar="eliminar(accesoDirecto)"
              @editar="prepararEditar"
            ></card-acceso-directo>
          </div>
        </div>
      </q-page>
    </template>

    <template #tab2>
      <ver-acceso-directo
        ref="refVerAccesoDirecto"
        :mixin="mixin"
      ></ver-acceso-directo>
    </template>
  </multiple-page-layout>
</template>

<script lang="ts" setup>
// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { acciones } from 'config/utils'
import { nextTick, ref } from 'vue'

// Componentes
import MultiplePageLayout from 'src/shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import CrearAccesoDirecto from 'pages/accesoDirecto/view/CrearAccesoDirecto.vue'
import CardAccesoDirecto from 'pages/accesoDirecto/view/CardAccesoDirecto.vue'
import VerAccesoDirecto from 'pages/accesoDirecto/view/VerAccesoDirecto.vue'

// Logica y controladores
import { AccesoDirectoController } from 'pages/accesoDirecto/infraestructure/AccesoDirectoController'
import { ArchivoController } from 'shared/archivos/infraestructure/ArchivoController'
import { AccesoDirecto } from 'pages/accesoDirecto/domain/AccesoDirecto'
import { useAuthenticationStore } from 'stores/authentication'

const authenticationStore = useAuthenticationStore()

/********
 * Mixin
 *********/
const mixin = new ContenedorSimpleMixin(
  AccesoDirecto,
  new AccesoDirectoController(),
  new ArchivoController()
)

const { listado, tabsPage, accion } = mixin.useReferencias()
const { listar, eliminar, reestablecer, consultar } = mixin.useComportamiento()
const { onReestablecer } = mixin.useHooks()

/*************
 * Variables
 *************/
const tituloBuscar = ref()
const mostrarCrearAccesoDirecto = ref(false)
const refVerAccesoDirecto = ref()
const refCrearAccesoDirecto = ref()
let debounceTimer

/************
 * Funciones
 ************/
const consultarAccesoDirecto = (idAccesoDirecto: number) => {
  tabsPage.value = '2'
  nextTick(() => {
    refVerAccesoDirecto.value.consultar({ id: idAccesoDirecto })
  })
}

const prepararEditar = (idAccesoDirecto: number) => {
  accion.value = acciones.editar
  consultar({ id: idAccesoDirecto })
  refCrearAccesoDirecto.value.listarArchivos(idAccesoDirecto)
  mostrarCrearAccesoDirecto.value = true
}

const onInputChange = () => {
  // Limpiar el temporizador anterior
  clearTimeout(debounceTimer)

  // Configurar un nuevo temporizador
  debounceTimer = setTimeout(() => {
    // Llamar la función de búsqueda
    searchAction(tituloBuscar.value)
  }, 500) // 500ms de espera
}

const searchAction = (textoBuscar: string) => {
  listar({ search: textoBuscar })
}

/********
 * Hooks
 ********/
onReestablecer(() => {
  nextTick(() => refCrearAccesoDirecto.value.limpiarArchivos())
  mostrarCrearAccesoDirecto.value = false
})

/********
 * Init
 ********/
listar()
</script>
