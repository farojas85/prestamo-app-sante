<script setup>
import { toRefs, onMounted, ref } from 'vue';

const props = defineProps({
    archivos: Array
});

const rutaCliente = import.meta.env.VITE_APP_API_URL+'/storage/clientes/';

const { archivos } = toRefs(props);

</script>
<template>
    <div id="mld-ver-documentos" class="modal fade">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Ver Documentos</h5>
            </div>
            <div class="modal-body" style="border-top: 1px solid; border-bottom: 1px solid;">
                <div class="card" v-for="archivo in archivos">
                    <div class="card-header">
                        <h3 v-if="archivo.includes('CONTRATO')"  v-text="'CONTRATO'"></h3>
                        <h3 v-if="archivo.includes('DNI_ANVERSO')"  v-text="'DNI ANVERSO'"></h3>
                        <h3 v-if="archivo.includes('DNI_REVERSO')"  v-text="'DNI REVERSO'"></h3>
                        <h3 v-if="archivo.includes('VOUCHER_DESEMBOLSO')"  v-text="'VOUCHER DESEMBOLSO'"></h3>
                    </div>
                    <div class="card-body">
                        <div class="embed-responsive embed-responsive-16by9">
                            <iframe class="embed-responsive-item" :src="rutaCliente+archivo"
                                allowfullscreen></iframe>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="fa-fa-ban"> Cerrar</span>
                </button>
            </div>
        </div>
    </div>
</div>
</template>