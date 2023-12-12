<script setup>
import { toRefs, onMounted, ref } from 'vue';

const props = defineProps({
    vouchers: Array
});

const { vouchers } = toRefs(props);

const rutaRegistroPago = import.meta.env.VITE_APP_API_URL+'/storage/registro-pagos/';

</script>
<template>
    <div id="mdl-ver-voucher" class="modal fade">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        VER VOUCHER
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">
                            <i class="fas fa-times"></i>
                        </span>
                    </button>
                </div>
                <div class="modal-body" style="border-top: 1px solid; border-bottom: 1px solid;">
                    <div class="card" v-for="voucher in vouchers">
                        <div class="card-header">
                            <!-- <h3 v-text="voucher"></h3> -->
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <img  :src="rutaRegistroPago+voucher" class="img-fluid"/>
                                </div>
                            </div>
                            <!-- <div class="embed-responsive embed-responsive-16by9"> -->

                                <!-- <iframe class="embed-responsive-item" :src="rutaRegistroPago+voucher"
                                    allowfullscreen></iframe> -->
                            <!-- </div> -->
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