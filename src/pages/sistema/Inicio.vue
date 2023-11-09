<script setup>
import { onMounted, ref, inject } from 'vue';
import { defineTitle } from '../../helpers';
import ContentHeader from '../../components/ContentHeader.vue';
import { useDatosSession } from '../../composables/session';
import UsuarioView from './usuario/Inicio.vue';
import TipoAccesoView from './tipo-acceso/Inicio.vue';
import RoleView from './role/Inicio.vue';
import MenuView from './menu/Inicio.vue';
import PermisoView from './permiso/Inicio.vue';

const { usuario, puede } = useDatosSession();

const Auth = inject('Auth');

const titleHeader = ref({
    titulo:'Configuración Usuario',
    icon:"fa fa-users",
    subTitulo:'Usuarios',
    vista:"Usuarios"
})


onMounted(() => {
    defineTitle(titleHeader.value.vista);
    cambiarVista('Permisos','fas fa-shield-alt');
})

const cambiarVista =(nuevaVista, icono) => {
    titleHeader.value.vista = nuevaVista;
    titleHeader.value.titulo = "Configuración "+nuevaVista;
    titleHeader.value.subTitulo = nuevaVista;
    titleHeader.value.icon = icono
    defineTitle(titleHeader.value.vista)
}
</script>
<template>
    <ContentHeader :titleHeader="titleHeader"></ContentHeader>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <!-- <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Usuarios','fa fa-users')"
                                v-if="puede('usuarios.inicio')" >
                                <i class="fa fa-users"></i> Usuarios
                            </button> -->
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Tipo Accesos','fas fa-low-vision')"
                                v-if="puede('tipo-accesos.inicio')">
                                <i class="fas fa-low-vision"></i> Tipo Acceso
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Roles','fas fa-tags')"
                                v-if="puede('roles.inicio')" >
                                <i class="fas fa-tags"></i> Roles
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Menús','fas fa-bars')"
                                v-if="puede('menus.inicio')" >
                                <i class="fas fa-bars"></i> Men&uacute;s
                            </button>
                            <!-- <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Menús - Roles','fas fa-user-minus')"
                                v-if="puede('menu-role.inicio')" >
                                <i class="fas fa-user-minus"></i> Men&uacute;s / Roles
                            </button> -->
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Permisos','fas fa-shield-alt')"
                                v-if="puede('permisos.inicio')" >
                                <i class="fas fa-shield-alt"></i> Permisos
                            </button>
                            <!-- <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Permisos - Roles','fas fa-user-shield')"
                                v-if="puede('permiso-role.inicio')">
                                <i class="fas fa-user-shield"></i> Permisos / Roles
                            </button> -->
                        </div>
                        <div class="card-body">
                            <UsuarioView v-if="titleHeader.vista=='Usuarios'"></UsuarioView>
                            <TipoAccesoView v-else-if="titleHeader.vista=='Tipo Accesos'"></TipoAccesoView>
                            <RoleView v-else-if="titleHeader.vista == 'Roles'"></RoleView>
                            <MenuView v-else-if="titleHeader.vista == 'Menús'"></MenuView>
                            <PermisoView v-else-if="titleHeader.vista == 'Permisos'"></PermisoView>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>