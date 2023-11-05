<script setup>
import { toRefs } from 'vue';
import { useAutenticacion } from '../composables/autentication.js';
import { useHelper } from '../helpers';

const { logoutUsuario } = useAutenticacion();
const { Swal } = useHelper();

const props = defineProps({
    usuario: Object
});

const {usuario} = toRefs(props);

const logout = async() => {
    await logoutUsuario(usuario.value.id)
}

const cerrarSesion = async () => {
    Swal.fire({
        title: '¿Está seguro de Cerrar Sesión?',
        text: 'Préstamos APP',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            logout()
        }
    })
}

</script>
<template>
    <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
            <img src="/foto.png"  class="img-circle img-sm mr-1"/>{{ usuario?.name }}
        </a>
        <div class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
                <i class="fas fa-id-badge fa-fw mr-2"></i> Mi Perfil
            </a>
            <div class="dropdown-divider"></div>
            <a href="/configuraciones" class="dropdown-item">
                <i class="fas fa-gear mr-2"></i> Configuraciones
            </a>
            <div class="dropdown-divider"></div>
            <a href="" class="dropdown-item" @click.prevent="cerrarSesion">
                <i class="fas fa-power-off fa-fw mr-2"></i> Cerrar Sesi&oacute;n
            </a>
        </div>
    </li>
</template>