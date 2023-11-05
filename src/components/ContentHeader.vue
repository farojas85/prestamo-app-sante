<script setup>
import { toRefs } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    titulo: String,
    subTitulo: String,
    icon: String,
    titleHeader: Object
})

const { titleHeader } = toRefs(props)
const route = useRoute();
const icono = route.meta.icono;
</script>
<template>
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">
                        <i :class="titleHeader?.icon ? titleHeader?.icon : icono"></i> {{ titleHeader.titulo }}
                    </h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="/dashboard">Home</a></li>
                        <li class="breadcrumb-item active">{{ route.name }}</li>
                        <li class="breadcrumb-item active" v-if="titleHeader?.subTitulo">{{ titleHeader?.subTitulo }}</li>
                    </ol>
                </div><!-- /.col -->
            </div><!-- /.row -->
        </div><!-- /.container-fluid -->
    </div>
</template>
