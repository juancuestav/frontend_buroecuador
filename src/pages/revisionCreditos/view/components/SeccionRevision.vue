<template>
  <!-- Sección sin colapsar, separada por una línea gris clara -->
  <section class="seccion-revision">
    <header class="q-mb-md">
      <div class="seccion-revision__titulo row items-center no-wrap">
        {{ label }}
        <q-icon
          v-if="ayuda"
          name="bi-info-circle"
          size="15px"
          class="q-ml-sm text-grey-7 cursor-pointer"
        >
          <q-tooltip class="bg-dark" max-width="320px">{{ ayuda }}</q-tooltip>
        </q-icon>
      </div>
      <div v-if="caption" class="seccion-revision__subtitulo">
        {{ caption }}
      </div>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{ label: string; caption?: string; ayuda?: string }>()
</script>

<style scoped>
/* Cada sección se separa de lo anterior (buscador u otra sección) con una línea gris clara */
.seccion-revision {
  padding-block: 20px;
  border-top: 1px solid #e6e8eb;
}

.seccion-revision__titulo {
  font-size: 1rem;
  font-weight: 700;
}

.seccion-revision__subtitulo {
  font-size: 0.8rem;
  color: #78909c;
  margin-top: 2px;
}
</style>
