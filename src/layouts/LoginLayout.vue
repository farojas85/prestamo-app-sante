<script setup>
import { cargarClasesLoginLayout } from '../helpers';
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
    cargarClasesLoginLayout();
});
</script>
<template>
    <div class="position-relative">
        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="authentication-inner py-4">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <!-- <div class="login-box">
    </div> -->
</template>