<script setup>
import { ref, toRefs } from 'vue';
import { useDatosSession } from '../../composables/session';
import DashboardAdmin from './DashboardAdmin.vue';
import DashboardGerente from './DashboardGerente.vue';
import DashboardLiderSuperior from './DashboardLiderSuperior.vue';
import DashboardLider from './DashboardLider.vue';

const {
    roles
} = useDatosSession();

</script>
<template>
    <DashboardAdmin v-if="['super-usuario','admin'].includes(roles.slug)"></DashboardAdmin>
    <DashboardGerente v-else-if="roles.slug=='gerente'"></DashboardGerente>
    <DashboardLiderSuperior v-else-if="roles.slug=='lider-superior'"></DashboardLiderSuperior>
    <DashboardLider v-else-if="roles.slug=='lider'"></DashboardLider>
</template>