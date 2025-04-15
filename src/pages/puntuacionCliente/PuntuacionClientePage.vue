<template>
  <q-page padding>
    <div class="text-h5 text-bold q-mb-md">Mi puntuación</div>

    <div
      v-if="puedeCrear"
      class="row bg-solid rounded-card q-pt-xs q-pb-lg q-mb-md"
    >
      <div class="col-12 q-mb-md">
        <SelectorUsuario
          :mixin="mixin"
          :propietario="4"
          :disable="false"
          @selected="seleccionarUsuario"
        ></SelectorUsuario>
      </div>

      <div class="col-12 q-mb-md">
        <label class="q-mb-sm block">Ingrese la puntuación</label>
        <q-input
          v-model="userProfile.puntuacion"
          placeholder="Ingrese puntuación"
          :disable="!userProfile.user"
          outlined
          dense
        >
          <template #prepend><q-icon name="bi-person-check"></q-icon></template>
        </q-input>
      </div>

      <div class="col-12 row justify-end">
        <button-submits
          :accion="accion"
          @cancelar="reestablecer()"
          @editar="editarPuntuacion()"
        />
      </div>
    </div>

    <div class="row card-capas q-pa-md">
      <div class="col-12"></div>
      <div class="col-12 col-md-6 q-mb-md">
        <div class="text-h6 q-mb-xl">
          Puntuación del cliente
          <q-icon name="bi-stars" color="amber"></q-icon>
        </div>
        <div class="q-gutter-sm">
          <div>
            <strong>Nombre:</strong> {{ usuario.name }}
            {{ usuario.apellidos }}
          </div>
          <div>
            <strong>Tipo de Identificación:</strong>
            {{ usuario.tipo_identificacion === 1 ? 'Cédula' : 'Otro' }}
          </div>
          <div>
            <strong>Identificación:</strong>
            {{ usuario.identificacion }}
          </div>
          <div><strong>Dirección:</strong> {{ usuario.direccion }}</div>
          <div><strong>Edad:</strong> {{ usuario.edad }}</div>
          <div>
            <strong>Fecha de Nacimiento:</strong>
            {{ usuario.fecha_nacimiento || 'No disponible' }}
          </div>
          <div><strong>Celular:</strong> {{ usuario.celular }}</div>
          <div><strong>Email:</strong> {{ usuario.email }}</div>
          <div><strong>Rol:</strong> {{ usuario.rol }}</div>
          <div>
            <strong>Estado de Verificación:</strong>
            {{ usuario.estado_verificacion || 'No verificado' }}
          </div>
          <div>
            <strong>Notificaciones:</strong>
            {{ usuario.puede_recibir_notificaciones ? 'Sí' : 'No' }}
          </div>
          <div>
            <strong>Fecha de Verificación de Email:</strong>
            {{ usuario.email_verified_at }}
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <planet-score-animation
          :score="
            parseInt(userProfile.puntuacion ? userProfile.puntuacion + '' : '0')
          "
          :fecha-actualizacion="userProfile.updated_at ?? ''"
        ></planet-score-animation>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones } from 'config/utils'
import { ref } from 'vue'

// Componentes
import SelectorUsuario from 'components/inputs/selectorUsuario/view/SelectorUsuario.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import PlanetScoreAnimation from './PlanetScoreAnimation.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { UserProfile } from 'pages/userProfile/domain/UserProfile'
import { UserProfileController } from 'pages/userProfile/infraestructure/UserProfileController'
import { Usuario } from 'pages/usuarios/domain/Usuario'

defineOptions({
  name: 'puntuacion_cliente',
})

/*********
 * Stores
 *********/
const auth = useAuthenticationStore()

/********
 * Mixin
 ********/
const mixin = new ContenedorSimpleMixin(
  UserProfile,
  new UserProfileController()
)
const { entidad: userProfile, accion } = mixin.useReferencias()
const { editarParcial, reestablecer, consultar } = mixin.useComportamiento()
const { onReestablecer } = mixin.useHooks()

/************
 * Variables
 ************/
const { notificarAdvertencia } = useNotificaciones()
const usuario = ref(auth.user)
const puedeCrear = auth.can('crear.archivos_reportes')

/************
 * Funciones
 ************/
const editarPuntuacion = () => {
  if (userProfile.id)
    editarParcial(userProfile.id, { puntuacion: userProfile.puntuacion })
  else notificarAdvertencia('Debe seleccionar un usuario')
}

const seleccionarUsuario = (usuarios: Usuario[]) => {
  userProfile.id = usuarios[0].user_profile_id
  usuario.value = usuarios[0]
  consultar(userProfile)
}

const datosDefecto = () => {
  // userProfile.id = usuario.value.user_profile_id
  userProfile.id = auth.user.user_profile_id
  usuario.value = auth.user
  consultar(userProfile)
}

/*********
 * Hooks
 *********/
onReestablecer(() => datosDefecto())

/*******
 * Init
 *******/
accion.value = acciones.editar
datosDefecto()
</script>

<style>
.bg-score {
  background-color: #1218288a;
  /* background-image: linear-gradient(to bottom, #121828, #0a0f14); */
}
</style>
