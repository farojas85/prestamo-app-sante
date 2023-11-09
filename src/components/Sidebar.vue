<script setup>
import { toRefs, inject } from 'vue';
import {useRoute } from 'vue-router';
import { useDatosSession } from '../composables/session';
import Brandlogo from './Brandlogo.vue';
import SidebarSearch from './SidebarSearch.vue';
import SidebarUser from './SidebarUser.vue';
import SidebarMenu from './SidebarMenu.vue';

const {
    usuario, menus
} = useDatosSession();

</script>
<template>
    <aside class="main-sidebar elevation-4 sidebar-dark-info bg-navy">
        <Brandlogo></Brandlogo>
        <div class="sidebar">
            <SidebarUser :usuario="usuario"></SidebarUser>
            <!-- <SidebarSearch></SidebarSearch> -->
            <SidebarMenu :menus="menus"></SidebarMenu>
        </div>
    </aside>
</template>
