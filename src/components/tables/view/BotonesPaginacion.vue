<template>
  <div class="row">
    <q-btn
      v-if="scope.pagesNumber > 2"
      icon="first_page"
      color="grey-8"
      round
      dense
      flat
      :disable="scope.isFirstPage"
      @click="scope.firstPage"
    />

    <q-btn
      icon="chevron_left"
      color="secondary"
      dense
      class="q-mr-xs"
      flat
      :disable="scope.isFirstPage"
      @click="scope.prevPage"
    />

    <q-btn
      icon="chevron_right"
      color="secondary"
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.nextPage"
    />

    <q-btn
      v-if="scope.pagesNumber > 2"
      icon="last_page"
      color="grey-8"
      round
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.lastPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  scope: {
    type: Object,
    required: true,
  },
})
</script>
