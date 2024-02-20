<script setup>
import { toRefs, onMounted, ref, computed } from 'vue';
import { useHelper } from '../../../../helpers';

const props = defineProps({
    clientepr: Object
})
const { clientepr } = toRefs(props);

</script>
<template>
     <div class="modal fade" id="modal-nuevo-prestamo">
        <div class="modal-dialog modal-xl " role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-nuevo-prestamo-title">Nuevo Prestamo</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body" id="datos-descargar">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-primary">
                                    <h4 class="card-title">Datos Cliente</h4>
                                </div>
                                <div class="card-body">
                                    <!-- <div class="form-group row">
                                        <label for="numero_documento_pre" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro. Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento_pre"
                                                maxlength="15" v-model="clientepr.persona.numero_documento"
                                                placeholder="Nro. documento de Identidad"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="numero_documento_pre" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro. Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento_pre"
                                                maxlength="15" v-model="clientepr.persona.numero_documento"
                                                placeholder="Nro. documento de Identidad"
                                                readonly
                                            />
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-danger">
                                    <h4 class="card-title">Datos Préstamo</h4>
                                </div>
                                <div class="card-body">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>