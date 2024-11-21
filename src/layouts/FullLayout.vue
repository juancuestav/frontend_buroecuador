<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container>
      <essential-loading></essential-loading>
      <router-view v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { useQuasar } from 'quasar'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLoading },
  setup() {
    const authenticationStore = useAuthenticationStore()

    const $q = useQuasar()
    authenticationStore.isMobileVersion = $q.platform.is.mobile
  },
})
</script>
