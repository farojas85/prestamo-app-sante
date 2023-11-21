<script setup>
import { onMounted, ref, inject } from 'vue';
import { defineTitle } from '../../helpers';
import { useDatosSession } from '../../composables/session';
import ContentHeader from '../../components/ContentHeader.vue';
import RegistroPagoNuevoForm from './Listado.vue';

const { usuario, puede } = useDatosSession();

const titleHeader = ref({
    titulo:'Registro Pago',
    icon:"fas fa-hand-holding-dollar",
    subTitulo:'Registro Pago',
    vista:"Registro Pago"
})


onMounted(() => {
    defineTitle(titleHeader.value.vista);
    cambiarVista('Registro Pago','fas fa-hand-holding-dollar');
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
                                @click.prevent="cambiarVista('Registro Pago','fas fa-hand-holding-dollar')"
                                v-if="puede('registro-pagos.nuevo')">
                                <i class="fas fa-hand-holding-dollar"></i> Registrar Pago
                            </button>
                        </div>
                        <div class="card-body">
                            <RegistroPagoNuevoForm></RegistroPagoNuevoForm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>