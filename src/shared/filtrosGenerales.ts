/* eslint-disable @typescript-eslint/no-explicit-any */
import { Usuario } from 'pages/usuarios/domain/Usuario'
import { ordernarListaString } from './utils'
import { ref } from 'vue'
import { Canton } from './ubicacion/canton/domain/Provincia'

export const useFiltrosGenerales = (listadosAuxiliares) => {
  /*************
   * Variables
   *************/
  const paises = ref(listadosAuxiliares.paises)
  const provincias = ref(listadosAuxiliares.provincias)
  const cantones = ref(listadosAuxiliares.cantones)
  const usuarios = ref(listadosAuxiliares.usuarios)

  function filtrarPaises(val, update) {
    if (val === '') {
      update(() => (paises.value = listadosAuxiliares.paises))
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      paises.value = listadosAuxiliares.paises.filter(
        (v) => v.pais.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  function filtrarProvincias(val, update) {
    if (val === '') {
      update(() => (provincias.value = listadosAuxiliares.provincias))
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.provincias)
        provincias.value = listadosAuxiliares.provincias.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
    })
  }

  function filtrarCantones(val, update) {
    if (val === '') {
      update(() => (cantones.value = listadosAuxiliares.cantones))
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.cantones)
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
    })
  }

  function ordenarCantones() {
    cantones.value.sort((a: Canton, b: Canton) =>
      ordernarListaString(a.nombre!, b.nombre!)
    )
  }

  function filtrarUsuarios(val, update) {
    if (val === '') {
      update(() => {
        usuarios.value = listadosAuxiliares.usuarios
      })
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      usuarios.value = listadosAuxiliares.usuarios.filter(
        (v) =>
          v.name.toLowerCase().indexOf(needle) > -1 ||
          v.apellidos.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  function ordenarUsuarios() {
    usuarios.value.sort((a: Usuario, b: Usuario) =>
      ordernarListaString(a.apellidos!, b.apellidos!)
    )
  }

  /****************
   * Modulo medico
   ****************/
  //   const filtrarEnfermedades = (val, update) => filtrarLista(val, update, enfermedades, 'codigo_nombre_enfermedad', listadosAuxiliares.enfermedades)

  /***************************************
   * Filtro global optimizado
   * Actualmente filtra por un solo campo
   ***************************************/
  /* function filtrarLista(val, update, lista, clave, defaultValue = []) {
    if (val === '') {
      update(() => (lista.value = defaultValue))
    }
    update(() => {
      const needle = val.toLowerCase()
      lista.value = defaultValue.filter(
        (v: any) => v[clave].toLowerCase().indexOf(needle) > -1
      )
    })
  } */

  return {
    paises,
    filtrarPaises,
    provincias,
    filtrarProvincias,
    cantones,
    filtrarCantones,
    ordenarCantones,
    usuarios,
    filtrarUsuarios,
    ordenarUsuarios,
  }
}
