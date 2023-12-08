<script setup>
import { RouterView } from 'vue-router';
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

const { usuario, roles, menus } = useDatosSession();

onMounted(() => {
    cargarClasesDefaultLayout();
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
