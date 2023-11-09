<script setup>
import { onMounted, ref, inject } from 'vue';
import { defineTitle } from '../../helpers';
import ContentHeader from '../../components/ContentHeader.vue';
import { useDatosSession } from '../../composables/session';
import FrecuenciaPagoView from './frecuencia-pago/Inicio.vue';
import AplicacionInteresView from './aplicacion-interes/Inicio.vue';
import AplicacionMoraView from './aplicacion-mora/Inicio.vue';
import MonedaView from './moneda/Inicio.vue';

const { usuario, puede } = useDatosSession();

const Auth = inject('Auth');

const titleHeader = ref({
    titulo:'Configuración Frecuencia Pagos',
    icon:"far fa-calendar-days",
    subTitulo:'Frecuencia Pagos',
    vista:"Frecuencia Pagos"
})


onMounted(() => {
    defineTitle(titleHeader.value.vista);
    cambiarVista('Frecuencia Pagos','far fa-calendar-days');
})

const cambiarVista =(nuevaVista, icono) => {
    titleHeader.value.vista = nuevaVista;
    titleHeader.value.titulo = "Configuración "+nuevaVista;
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
                                @click.prevent="cambiarVista('Frecuencia Pagos','far fa-calendar-days')"
                                v-if="puede('frecuencia-pagos.inicio')" >
                                <i class="far fa-calendar-days"></i> Frecuencia Pagos
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Aplicación Intereses','fas fa-i')"
                                v-if="puede('aplicacion-intereses.inicio')">
                                <i class="fas fa-i"></i> Aplicación Intereses
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Aplicación Moras','fas fa-list-check')"
                                v-if="puede('aplicacion-moras.inicio')" >
                                <i class="fas fa-list-check"></i> Aplicación Moras
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Monedas','fas fa-coins')"
                                v-if="puede('monedas.inicio')" >
                                <i class="fas fa-coins"></i> Monedas
                            </button>
                            <!--<button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Menús - Roles','fas fa-user-minus')"
                                v-if="puede('menu-role.inicio')" >
                                <i class="fas fa-user-minus"></i> Men&uacute;s / Roles
                            </button>s
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Permisos','fas fa-shield-alt')"
                                v-if="puede('permisos.inicio')" >
                                <i class="fas fa-shield-alt"></i> Permisos
                            </button>
                            <button class="btn btn-app bg-primary"
                                @click.prevent="cambiarVista('Permisos - Roles','fas fa-user-shield')"
                                v-if="puede('permiso-role.inicio')">
                                <i class="fas fa-user-shield"></i> Permisos / Roles
                            </button> -->
                        </div>
                        <div class="card-body">
                            <FrecuenciaPagoView v-if="titleHeader.vista=='Frecuencia Pagos'"></FrecuenciaPagoView>
                            <AplicacionInteresView v-else-if="titleHeader.vista=='Aplicación Intereses'"></AplicacionInteresView>
                            <AplicacionMoraView v-else-if="titleHeader.vista == 'Aplicación Moras'"></AplicacionMoraView>
                            <MonedaView v-else-if="titleHeader.vista == 'Monedas'"></MonedaView>
                            <!-- <PermisoView v-else-if="titleHeader.vista == 'Permisos'"></PermisoView> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>