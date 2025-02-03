<template>
  <q-page padding>
    <!-- Modal: nuevo negocio-->
    <q-dialog v-model="mostrarDialog" maximized>
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{ tituloModal }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <!-- Contenido del modal -->
          <slot name="formulario" />
          <button-submits
            :accion="accion"
            @cancelar="ocultar()"
            @guardar="guardar(entidad)"
            @editar="editar(entidad)"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Contenido principal: cards -->
    <p class="text-bold q-mb-md">Publicidad popup</p>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 q-mb-sm">
        <q-card class="card-image rounded-card full-height" flat bordered @click="mostrar()">
          <q-card-section class="text-center">
            <img
              src="~assets/add_alt.svg"
              width="160"
              height="160"
              class="card-img-top q-pa-sm"
              style="object-fit: contain"
            />
            <a class="text-bold text-center block"> Crear</a>
          </q-card-section>
        </q-card>
      </div>

      <div
        class="col-12 col-md-4 q-mb-sm"
        v-for="item in listado"
        :key="item.id"
      >
        <card-image
          :image-url="item.imagen"
          title=""
          :subtitle="item.titulo"
          class="card-image"
          :permitir-custom-action="false"
          :permitir-custom-action2="false"
          @click-event="cardSeleccionado(item.id)"
          @eliminar="eliminarCard(item.id)"
          @custom-action="runCustomAction(item.id)"
          @custom-action2="runCustomAction2(item.id)"
        ></card-image>
      </div>
    </div>
  </q-page>
</template>

<script src="./CardLayout.ts"></script>

<style lang="scss" scoped>
.card-image {
  transition: all 0.2s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1.04);
  }
}

a {
  cursor: pointer;
}
</style>
