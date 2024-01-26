<script setup>
import { onMounted, ref, inject } from 'vue';
import { defineTitle } from '../../helpers';
import ContentHeader from '../../components/ContentHeader.vue';
import { useDatosSession } from '../../composables/session';

const { usuario, puede } = useDatosSession();

const Auth = inject('Auth');

const titleHeader = ref({
    titulo:'Historial Inversión',
    icon:'fas fa-file-invoice-dollar',
    subTitulo:'Registro Inversiones',
    vista:"Historial Inversión"
})


onMounted(() => {
    defineTitle(titleHeader.value.vista);
    cambiarVista('Historial Inversión','fas fa-file-invoice-dollar');
})

const cambiarVista =(nuevaVista, icono) => {
    titleHeader.value.vista = nuevaVista;
    titleHeader.value.titulo = nuevaVista;
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
                                @click.prevent="cambiarVista('Historial Inversión','fas fa-file-invoice-dollar')"
                                v-if="puede('registro-inversiones.historial')">
                                <i class="fas fa-file-invoice-dollar"></i> Historial Inversiones
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Registro Inversión','fas fa-hand-holding-dollar')"
                                v-if="puede('registro-inversiones.nuevo')">
                                <i class="fas fa-hand-holding-dollar"></i> Registrar Inversiones
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>