<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header
      class="bg-body-background text-dark"
      :class="{ 'q-px-lg': !$q.screen.xs }"
    >
      <transition name="slide-fade" mode="out-in">
        <div v-if="mostrarBuscar" class="q-pa-xs">
          <q-input
            v-model="buscarModulo"
            placeholder="PRESIONE ESC PARA CERRAR"
            @update:model-value="filtrarMenu"
            bg-color="grey-1"
            input-class="text-black"
            @keyup.esc="resetearBuscador()"
            @clear="resetearBuscador()"
            @keyup.arrow-up="onKeyUp"
            @keyup.arrow-down="onKeyDown"
            @keyup.enter="onKeyEnter"
            autofocus
            dense
            outlined
            clearable
          >
            <template #prepend>
              <q-icon name="search" size="xs"></q-icon>
            </template>
          </q-input>
        </div>
      </transition>

      <transition name="scale" mode="out-in">
        <div v-if="buscarModulo" class="row justify-center">
          <q-list
            dense
            bordered
            class="lista-busqueda bg-solid custom-shadow text-color"
            style="width: 90%; margin: 0 auto"
          >
            <div
              ref="refListadoBusqueda"
              v-for="(link, index) in resultadosBusqueda"
              :key="index"
            >
              <q-item
                :focused="posicionResultados == index"
                clickable
                v-if="link.link"
                :to="link.link"
                @click="resetearBuscador()"
              >
                <q-item-section avatar>
                  <q-icon :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.title }}</q-item-label>
                  <q-item-label caption v-if="link.parentTitle">{{
                    link.parentTitle
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
      </transition>

      <q-toolbar class="row justify-between border-bottom q-py-md">
        <span>
          <q-btn
            color="primary"
            dense
            aria-label="Menu"
            unelevated
            flat
            icon="menu"
            @click="toggleLeftDrawer"
            ><!--<svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C3 4.44772 3.44772 4 4 4H16C16.5523 4 17 4.44772 17 5C17 5.55228 16.5523 6 16 6H4C3.44772 6 3 5.55228 3 5Z"
                fill="#fff"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 10C3 9.44772 3.44772 9 4 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10Z"
                fill="#fff"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 15C3 14.4477 3.44772 14 4 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H4C3.44772 16 3 15.5523 3 15Z"
                fill="#fff"
              />
            </svg> -->
          </q-btn>

          <q-btn @click="mostrarBuscar = !mostrarBuscar" unelevated no-caps>
            <q-icon
              name="bi-search"
              size="xs"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field q-mr-xs"
            ></q-icon>
            <span v-if="!$q.screen.xs" class="">Módulos del sistema</span>
          </q-btn>
        </span>

        <!--<b v-if="$q.screen.xs">{{ appName }}</b> -->

        <span>
          <!-- <q-toggle
            v-model="modoOscuro"
            checked-icon="bi-moon-fill"
            label=""
            unchecked-icon="bi-sun-fill"
            @click="toggleDarkMode()"
          /> -->
          <q-btn
            color="primary"
            label="Descarga la app móvil"
            href="https://play.google.com/store/apps/details?id=org.capacitor.quasar.buroecuador&pcampaignid=web_share&pli=1"
            target="_blank"
            unelevated
            no-caps
          ></q-btn>
          <!-- Notificaciones -->
          <boton-notificaciones></boton-notificaciones>

          <q-btn no-caps flat dense round>
            <q-avatar size="38px">
              <img v-bind:src="imagenPerfil" />
            </q-avatar>
            <q-menu>
              <div class="row bg-desenfoque-2 no-wrap q-pa-md">
                <div class="column items-center">
                  {{ nombreUsuario }}
                  <q-avatar size="68px" class="q-mb-md">
                    <img src="~assets/user.png" />
                  </q-avatar>

                  <q-btn
                    label="Cerrar sesión"
                    color="primary"
                    size="sm"
                    class="full-screen block"
                    v-close-popup
                    no-wrap
                    no-caps
                    unelevated
                    square
                    @click="logout()"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </span>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-drawer my-font border-right"
      :class="{ 'bg-solid': $q.screen.xs }"
    >
      <!-- Drawer Header -->
      <div class="absolute-top row items-center q-pa-md border-bottom q-mx-md">
        <q-avatar size="35px" class="rounded-card q-mr-md">
          <img :src="($q.dark.isActive ? logoOscuro : logoClaro) ?? ''" />
        </q-avatar>

        <div class="text-center text-bold">
          {{ appName }}
        </div>
      </div>

      <!-- Drawer Body -->
      <q-scroll-area style="height: calc(100% - 102px); margin-top: 86px">
        <q-list>
          <div v-for="item in links" :key="item.title">
            <q-item-label
              v-if="item.hasOwnProperty('header') && item.can"
              class="text-color"
              header
              >{{ item.header }}</q-item-label
            >
            <EssentialLink
              v-else
              :title="item.title ?? ''"
              :link="item.link"
              :target="item.target"
              :icon="item.icon"
              :children="item.children"
              :can="item.can"
              class="q-mx-sm"
            ></EssentialLink>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Router -->
    <q-page-container
      class="bg-body-bacskground my-font"
      :style="{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'auto',
        backgroundPosition: 'top right',
        backgroundRepeat: 'no-repeat',
        marginTop: '90px',
      }"
    >
      <!-- <q-page-container class="bg-body-background q-pb-xl"> -->
      <simple-chat></simple-chat>

      <router-view v-slot="{ Component }">
        <!-- <essential-loading></essential-loading> -->
        <!-- <transition name="scale" mode="out-in"> -->
        <keep-alive
          :exclude="['tablero_principal', 'puntuacion_cliente']"
          class="bg-body-background-inverso rounded-carfd"
        >
          <component :is="Component" />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
      <div class="absolute-bottom">
        <!-- <footer-component></footer-component> -->
      </div>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.lista-busqueda {
  position: fixed;
  top: 50px;
  z-index: 10;
}
</style>

<script lang="ts">
// Dependencias
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useAuthenticationStore } from 'src/stores/authentication'
import { defineComponent, ref, computed, watchEffect, watch } from 'vue'
import { LocalStorage, Platform, useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'
import fondo from 'src/assets/img/bg.svg'

// Dependencias - Capacitor
import { StatusBar, Style } from '@capacitor/status-bar'

// Componentes
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import FooterComponent from 'components/FooterComponent.vue'
import SimpleChat from 'components/chat/view/SimpleChat.vue'
import EssentialLink from 'components/EssentialLink.vue'
import BotonNotificaciones from 'components/notificaciones/view/BotonNotificaciones.vue'
import { MenuOption } from 'shared/menu/MenuOption'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
    EssentialLoading,
    SimpleChat,
    FooterComponent,
    BotonNotificaciones,
  },

  setup() {
    /**********
     * Stores
     **********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const authenticationStore = useAuthenticationStore()
    const menu = useMenuStore()

    /*************
     * Variables
     *************/
    const leftDrawerOpen = ref(false)
    const Router = useRouter()
    const modoOscuro = ref(LocalStorage.getItem('dark') ?? false)
    const notificaciones = ref([])
    const mostrarBuscar = ref(false)
    const buscarModulo = ref()
    const refListadoBusqueda = ref()
    const posicionResultados = ref(-1)
    const resultadosBusqueda = ref<MenuOption[]>([])

    const $q = useQuasar()
    $q.dark.set(Boolean(modoOscuro.value))

    /************
     * Funciones
     ************/
    function toggleDarkMode() {
      $q.dark.set(Boolean(modoOscuro.value))
      LocalStorage.set('dark', modoOscuro.value)
    }

    const nombreUsuario = computed(() => {
      const usuario = authenticationStore.user
      if (usuario) {
        return `${usuario.name} ${usuario.apellidos ?? ''} `
      }
      return ''
    })

    async function logout() {
      await authenticationStore.logout()
      Router.replace({ name: 'Login' })
    }

    // función para obtener los módulos permitidos
    function obtenerModulosPermitidos() {
      const modulosPermitidos = menu.links.filter(
        (link: MenuOption) => link.can
      )

      return modulosPermitidos.map((modulo) => {
        if (modulo.children && Array.isArray(modulo.children)) {
          const firstPermittedChild = modulo.children.find((child) => child.can)
          if (firstPermittedChild) {
            modulo.link = firstPermittedChild.link
          }
        }
        return modulo
      })
    }

    function filtrarMenu(val) {
      const modulosPermitidos = obtenerModulosPermitidos()
      resultadosBusqueda.value = filterItems(modulosPermitidos, val)
      posicionResultados.value = -1
    }

    function filterItems(items, searchTerm) {
      const searchTerms = searchTerm?.toLowerCase().split(' ')

      function matches(item) {
        return searchTerms?.every(
          (term) => new RegExp(term, 'i').test(item.title ?? '') && item.can
        )
      }

      function filterRecursive(items, parentTitle = '') {
        return items.reduce((acc, item) => {
          const childrenMatches = item.children
            ? filterRecursive(item.children, item.title)
            : []

          if (matches(item) && (!item.children || item.children.length === 0)) {
            acc.push({ ...item, parentTitle })
          } else if (childrenMatches.length > 0) {
            acc.push(...childrenMatches)
          }

          return acc
        }, [])
      }

      return filterRecursive(items)
    }

    const resetearBuscador = () => {
      posicionResultados.value = -1
      buscarModulo.value = null
      mostrarBuscar.value = false
    }

    function onKeyEnter() {
      const rutaDestino =
        resultadosBusqueda.value[posicionResultados.value].link
      if (rutaDestino) Router.push(rutaDestino)
      resetearBuscador()
    }

    function onKeyUp() {
      posicionResultados.value =
        posicionResultados.value > 0 ? posicionResultados.value - 1 : 0
    }

    function onKeyDown() {
      if (posicionResultados.value < refListadoBusqueda.value.length - 1)
        posicionResultados.value++
    }

    /*******
     * Init
     *******/
    authenticationStore.isMobileVersion = $q.platform.is.mobile

    // Establecer favicon
    configuracionGeneralStore
      .consultarConfiguracion()
      .then(() => configuracionGeneralStore.cambiarFavicon())

    // Titulo pagina
    const appName = computed(
      () => configuracionGeneralStore.configuracion?.nombre_empresa
    )

    watchEffect(
      () =>
        (document.title =
          (notificaciones.value.length
            ? `(${notificaciones.value.length})`
            : '') +
          ' ' +
          appName.value)
    )

    // Función para actualizar el color de la barra de estado
    const updateStatusBarColor = () => {
      if (Platform.is.android || Platform.is.ios || Platform.is.capacitor) {
        const color = $q.dark.isActive ? '#060606' : '#DFDFDF' // Ajusta los colores según tus necesidades
        StatusBar.setBackgroundColor({ color })

        // Cambiar el color del texto de la barra de estado
        const style = $q.dark.isActive ? Style.Dark : Style.Light // Texto blanco en tema oscuro, negro en tema claro
        StatusBar.setStyle({ style }) // Cambiar el estilo del texto
      }
    }

    watch(
      computed(() => $q.dark.isActive),
      updateStatusBarColor
    )
    // Llamamos a la función para establecer el color al inicio
    updateStatusBarColor()

    return {
      imagenPerfil: `https://ui-avatars.com/api/?name=${authenticationStore.user?.name.substr(
        0,
        1
      )}+${authenticationStore.user?.apellidos.substr(
        0,
        1
      )}&bold=true&background=7aa81528&color=7aa815`,
      appName,
      logoApp: process.env.LOGO_APP,
      links: computed(() => menu.links),
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout,
      nombreUsuario,
      modoOscuro,
      toggleDarkMode,
      mostrarBuscar,
      resetearBuscador,
      onKeyUp,
      onKeyDown,
      onKeyEnter,
      buscarModulo,
      filtrarMenu,
      resultadosBusqueda,
      posicionResultados,
      refListadoBusqueda,
      fondo,
    }
  },
})
</script>
