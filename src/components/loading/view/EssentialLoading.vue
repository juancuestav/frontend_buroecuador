<template>
  <!-- <transition name="fade" mode="out-in"> -->
  <!--  -->
  <section v-show="status.estaCargando.value" class="loading-background">
    <!-- <q-spinner-ios size="4em" color="primary" /> -->
    <!-- <q-circular-progress
      indeterminate
      size="90px"
      :thickness="0.2"
      color="lime"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
    /> -->
    <q-circular-progress
      indeterminate
      size="75px"
      :thickness="0.6"
      color="primary"
      center-color="white"
      class="q-ma-md"
    />
  </section>
  <!-- </transition> -->
</template>

<script setup>
import { StatusEssentialLoading } from '../application/StatusEssentialLoading'

const status = new StatusEssentialLoading()
</script>

<style>
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}
</style>
