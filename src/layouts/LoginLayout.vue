<script setup>
import { cargarClasesLoginLayout } from '../helpers';
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
    cargarClasesLoginLayout();
});
</script>
<template>
    <div class="login-box">
        <router-view></router-view>
    </div>
</template>