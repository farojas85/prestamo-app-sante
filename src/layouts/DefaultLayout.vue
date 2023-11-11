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

const { usuario, roles, menus } = useDatosSession();

onMounted(() => {
    cargarClasesDefaultLayout();
});


</script>
<template>
    <div class="wrapper">
        <Preloader></Preloader>
        <Navbar :usuario="usuario"></Navbar>
        <Sidebar :usuario="usuario" :menus="menus"></Sidebar>
        <div class="content-wrapper">
            <router-view ></router-view>
        </div>
        <Footer></Footer>
        <Aside></Aside>
    </div>
</template>
