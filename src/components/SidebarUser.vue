<script setup>
import { toRefs } from 'vue';
import {useRoute } from 'vue-router';

const props = defineProps({
    usuario: Object
});

const { usuario } = toRefs(props);

</script>
<template>
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
            <img :src="usuario.foto" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
            <a href="#" class="d-block" v-text="usuario.name"></a>
        </div>
    </div>
</template>