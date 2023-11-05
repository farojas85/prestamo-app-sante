<script setup>
    import { onMounted, ref } from 'vue';
    import { defineTitle } from '../../helpers';
    // import { useDatosSession } from '../../composables/session';

    import ContentHeader from '../../components/ContentHeader.vue';
    import EmpresaView from './Empresa.vue';
    import PrestamosView from './Prestamos.vue';

    // const { usuario, puede } = useDatosSession();

    const titleHeader = ref({
        titulo: 'Configuraciones',
        icon: "fas fa-gear",
        subTitulo: '',
        vista: "Configuraciones"
    })

    onMounted(() => {
        defineTitle(titleHeader.value.vista);
    })
</script>
<template>
    <ContentHeader :titleHeader="titleHeader"></ContentHeader>
    <section class="content">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item active"><a class="nav-link active" href="#empresa" data-toggle="tab">Empresa</a></li>
                            <li class="nav-item"><a class="nav-link" href="#prestamo" data-toggle="tab">Préstamos</a></li>
                            <!-- <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a></li> -->
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <EmpresaView></EmpresaView>
                            <PrestamosView></PrestamosView>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
