<script setup>
import { toRefs } from 'vue';
import {useRoute } from 'vue-router';

const props = defineProps({
    menus: Array
});

const { menus } = toRefs(props);

const route = useRoute();
const ruta = (String(route.path).toLowerCase()).substring(1);

</script>
<template>
    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li class="nav-header">MEN&Uacute; PRINCIPAL</li>
            <li class="nav-item" v-for="menu in menus" :key="menu.id" :class="{'menu-open': menu.submenu.some(su => su.slug === ruta )}">
                <template v-if="menu.submenu.length == 0">
                    <a :href="menu.slug" class="nav-link" 
                        :class="{ 'active': menu.slug == ruta }">
                        <i class="nav-icon" :class="menu.icono"></i>
                        <p>{{ menu.nombre }}</p>
                    </a>
                </template>
                <template v-else-if="menu.submenu.length > 0">
                    <a href="#" class="nav-link" :class="{'active': menu.submenu.some(su => su.slug === ruta)}">
                        <i :class="'nav-icon '+menu.icono"></i>
                        <p>
                            {{ menu.nombre }}
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item" v-for="subm in menu.submenu">
                            <a :href="subm.slug" class="nav-link" :class="{'active': subm.slug === ruta}">
                                <i class="far fa-circle nav-icon"></i>
                                <p>{{ subm.nombre }}</p>
                            </a>
                        </li>
                    </ul>
                </template>
            </li>
        </ul>
    </nav>
</template>