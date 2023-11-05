<script setup>
import { onMounted } from 'vue';
import { useRoute, RouterView, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

onMounted(() => {
    if(!localStorage.getItem('token-api'))
    {
        //window.location.href= "/"
        const redirect = route.query.redirect || '/'
        router.push(redirect)
    }
})
</script>

<template>
    <component :is="$route.meta.layout">
        <router-view></router-view>
    </component>
</template>