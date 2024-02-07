<script setup>
import { ref, onMounted } from 'vue';
import { useHelper, defineTitle } from '../../helpers';
import { useDashboardInversionista } from '../../composables/dashboards/dashboard-inversionista';
import { useDatosSession } from '../../composables/session';
import ContentHeader from '../../components/ContentHeader.vue';
import VueApexCharts from 'vue3-apexcharts';

const titleHeader = ref({
    titulo: "Dashboard Inversionista",
    subTitulo: "",
    icon: "",
    vista: ""
});

const { usuario, roles } = useDatosSession();

const {
    total_inversiones, total_ganancia,
    obtenerDataDashboard
} = useDashboardInversionista();

const series = ref([
  {
    name: 'Series 1',
    data: [30, 40, 35, 50, 49, 60, 70, 91]
  }
]);

const chartOptions = ref({
  chart: {
    type: 'line'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  }
});

onMounted(() => {
    defineTitle(titleHeader.value.titulo)
    obtenerDataDashboard(usuario.value.id);
})
</script>
<style scoped>
    .chart {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    }
</style>
<template>
    <ContentHeader :title-header="titleHeader"></ContentHeader>
    <section class="content">
        <div class="row">
            <div class="col-lg-3 col-6">
                <!-- small box -->
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3 v-html="'S/ '+total_inversiones"></h3>
                        <p>Total de Inversiones</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <a href="#" class="small-box-footer">&nbsp;
                        <!-- More info <i class="fas fa-arrow-circle-right"></i> -->
                    </a>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <!-- small box -->
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3 v-html="'S/ '+total_ganancia"></h3>
                        <p>Total ganancia en días</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        &nbsp;
                        <!-- More info <i class="fas fa-arrow-circle-right"></i> -->
                    </a>
                </div>
            </div>
        </div>
    </section>
    <div class="row">
        <div class="col-md-3">
            <!-- <VueApexCharts :options="chartOptions" :series="series"></VueApexCharts> -->
        </div>
    </div>
</template>