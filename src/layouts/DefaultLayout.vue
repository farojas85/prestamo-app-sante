<script setup>
import { RouterView } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { onMounted, ref, inject } from 'vue';
import { cargarClasesDefaultLayout } from '../helpers';
// import { useUserStore } from '../store';
import Preloader from '../components/Preloader.vue';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
// import Footer from '../components/Footer.vue';
// import Aside from '../components/Aside.vue';

// const { usuario } = useUserStore();
// const usuario = ref(
//     jwtDecode(localStorage.getItem('token-api')).user ?? null
// );  

onMounted(() => {
    cargarClasesDefaultLayout();
});


</script>
<template>
    <div class="wrapper">
        <Preloader></Preloader>
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <div class="content-wrapper">
            <router-view ></router-view>
        </div>
        <!-- <Footer></Footer>
        <Aside></Aside> -->
    </div>
</template>
