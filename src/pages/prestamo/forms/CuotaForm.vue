<script setup>
import { toRefs,ref } from 'vue';
import { usePrestamo } from '../../../composables/prestamo/prestamos';
import jsPDF from 'jspdf';

const props = defineProps({
    form: Object
});

const { form } = toRefs(props);

const { descargarCuotas } = usePrestamo();

// const datosDescagar = ref(null);

const descargar = () => {
    descargarCuotas(form.value)
}

</script>

<template>
    <div class="modal fade" id="modal-cuota">
        <div class="modal-dialog modal-lg " role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-cuota-title">Pr&eacute;stamo - Cuotas</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="datos-descargar">
                    <div class="form-group row">
                        <div class="col-md-12 text-center">
                            <h4>{{ form.nombres+' 'form.apellido_paterno+' '+form.apellido_materno }}</h4>

                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-4 border-right">
                            <div class="description-block ">
                                <h5 class="description-header font-weight-bold text-primary">Monto Préstamo</h5>
                                <span class="description-text text-primary display-5">{{ parseFloat(form.capital_inicial).toFixed(2)}}</span>
                            </div>
                        </div>
                        <div class="col-md-4 border-right">
                            <div class="description-block">
                                <h5 class="description-header font-weight-bold text-success">Tasa de Interés</h5>
                                <span class="description-text text-success display-5">{{ parseFloat(form.interes).toFixed(2) }} %</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="description-block">
                                <h5 class="description-header font-weight-bold text-primary">N&uacute;mero de Cuotas </h5>
                                <span class="description-text text-primary display-5" v-text="form.numero_cuotas"></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-12 text-center text-primary">
                            <h4 class="font-weight-bold">Cronograma de pagos</h4>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-12 table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center">Nro.</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Fecha Vence</th>
                                        <th class="text-center">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  v-if="form.cuotas.length == 0">
                                        <td class="text-danger text-center" colspan="4">--Cuotas no registradas--</td>
                                    </tr>
                                    <tr v-else v-for="(cuota,index) in form.cuotas">
                                        <td class="text-center" v-text="cuota.numero_cuota"></td>
                                        <td class="text-center" v-text="cuota.descripcion"></td>
                                        <td class="text-center" v-text="cuota.fecha_vencimiento"></td>
                                        <td class="text-center" v-text="cuota.monto_cuota"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card-footer">  
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <button type="button" class="btn btn-danger mr-3" data-dismiss="modal" >
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                         
                            <button type="button" class="btn btn-success" @click.prevent="descargar">
                                <i class="fas fa-download"></i> Descargar
                            </button>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>