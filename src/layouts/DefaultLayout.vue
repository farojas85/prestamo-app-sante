<script setup>
import { RouterView, useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { onMounted, ref, inject } from 'vue';
import { cargarClasesDefaultLayout } from '../helpers';
import { useDatosSession } from '../composables/session';
import Preloader from '../components/Preloader.vue';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import Aside from '../components/Aside.vue';
import ForzarCambioClave from '../components/ForzarCambioClave.vue';
import ModalNotificacion from '../components/ModalNotificacion.vue';
import {useNotificacion} from '../composables/configuracion/notificaciones';

const { usuario, roles, menus } = useDatosSession();

const { notificacion, obtenerNotificacionActiva } = useNotificacion();

const rutaNotificacion = import.meta.env.VITE_APP_API_URL+'/storage/notificaciones/';

const route = useRoute();


const cargarNotificacionActiva = async() => {
    await obtenerNotificacionActiva(roles.value.slug);
    if(
        route.fullPath =='/dashboard' && notificacion.value 
        && ['lider','lider-superio'].includes(roles.value.slug)
    ) {
        console.log(notificacion.value)
        $('#modal-aviso').modal('show')
        $('#modal-aviso-body').html('<img src="'+rutaNotificacion+'/'+notificacion.value.imagen+'" class="img-fluid" height="200"/>')
    }
}
onMounted(() => {
    cargarClasesDefaultLayout();
    cargarNotificacionActiva();
   
});


</script>
<template>
    <div class="wrapper">
        <Preloader></Preloader>
        <template v-if="usuario.forzar_cambio_clave == 0">
            <Navbar :usuario="usuario"></Navbar>
            <Sidebar :usuario="usuario" :menus="menus"></Sidebar>
            <div class="content-wrapper">
                <router-view ></router-view>
                <!-- <ModalNotificacion></ModalNotificacion> -->
            </div>
            <Footer></Footer>
            <Aside></Aside>
        </template>
        <template v-else-if="usuario.forzar_cambio_clave == 1">
            <div class="content-wrapper">
                <ForzarCambioClave ></ForzarCambioClave>
            </div>
        </template>
    </div>
</template>
