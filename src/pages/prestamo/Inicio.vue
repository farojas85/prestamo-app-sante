<script setup>
import { onMounted, ref, inject } from 'vue';
import { defineTitle } from '../../helpers';
import { useDatosSession } from '../../composables/session';

import ContentHeader from '../../components/ContentHeader.vue';
import ClienteView from './cliente/Inicio.vue';
import PrestamoList from './Listado.vue';

const { usuario, puede } = useDatosSession();

const titleHeader = ref({
    titulo:'Préstamos',
    icon:"fas fa-handshake-angle",
    subTitulo:'Préstamos',
    vista:"Préstamos"
})


onMounted(() => {
    defineTitle(titleHeader.value.vista);
    cambiarVista('Préstamos','fas fa-handshake-angle');
})

const cambiarVista =(nuevaVista, icono) => {
    titleHeader.value.vista = nuevaVista;
    titleHeader.value.titulo = ""+nuevaVista;
    titleHeader.value.subTitulo = nuevaVista;
    titleHeader.value.icon = icono
    defineTitle(titleHeader.value.vista)
}
</script>
<template>
    <ContentHeader :titleHeader="titleHeader"></ContentHeader>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Préstamos','fas fa-handshake-angle')"
                                v-if="puede('tipo-accesos.inicio')">
                                <i class="fas fa-handshake-angle"></i> Prestamos
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Clientes','fas fa-users')"
                                v-if="puede('clientes.inicio')">
                                <i class="fas fa-users-line"></i> Clientes
                            </button>
                        </div>
                        <div class="card-body">
                            <ClienteView v-if="titleHeader.vista=='Clientes'"></ClienteView>
                            <PrestamoList v-else="titleHeader.vista=='Préstamos'"></PrestamoList>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>