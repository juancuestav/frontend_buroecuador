<template>
  <q-page padding>
    <transition name="scale" mode="out-in">
      <slot name="modales" />
    </transition>

    <div v-if="titulo" class="text-h5 text-bold q-mb-md">{{ titulo }}</div>

    <div class="bg-redsq-pa-md">
      <slot name="formulario" />
    </div>

    <div class="row justify-end q-col-gutter-x-xs q-pt-md">
      <span>
        <slot name="custom-buttons"></slot>
      </span>
      <button-submits
        v-if="mostrarButtonSubmits"
        :accion="accion"
        :permitirGuardar="puedeCrear"
        :permitirModificar="puedeEditar"
        :permitirCancelar="puedeCancelar"
        :disabled="storeCargando.cargando"
        :labelGuardar="labelGuardar"
        @cancelar="reestablecer()"
        @editar="editar(entidad, resetFormularioOnUpdate)"
        @eliminar="eliminar(entidad, cbEliminar)"
        @guardar="guardar(entidad)"
      />
    </div>
  </q-page>
</template>

<script src="./SimpleLayout.ts"></script>
