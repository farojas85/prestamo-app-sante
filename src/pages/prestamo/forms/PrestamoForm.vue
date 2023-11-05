<script setup>
import { toRefs, onMounted, ref } from 'vue';
import ClienteForm from './ClienteForm.vue';
import {usePrestamo } from '../../../composables/prestamo/prestamos';

const props = defineProps({
    form: Object,
    cardTitle: String
});

const { form, cardTitle } = toRefs(props);


const cambiarCrud = (crud) => {
    form.value.estado_crud = crud;
}

const clienteFrm = ref({
    id:'',
    tipo_documento_id:'',
    numero_documento:'',
    nombres:'',
    apellido_paterno:'',
    apellido_materno:'',
    sexo_id:'',
    telefono:'',
    direccion:'',
    correo_personal:'',
    es_activo:1,
    errors:[],
    estado_crud:''
});

const {
    frecuenciaPagos,aplicacionIntereses,
    obtenerListaFrecuenciaPagos, obtenerListaAplicacionInrtereses
} = usePrestamo();


onMounted(() => {
    obtenerListaFrecuenciaPagos();
    obtenerListaAplicacionInrtereses()
})
const guardar = async() => {

}

const nuevoCliente = () => {
    clienteFrm.value.estado_crud = 'nuevo'
    $('#modal-cliente-form-title').html('Nuevo Cliente')
    $("#modal-cliente-form").modal('show')
}

</script>
<template>
    <button type="button" class="btn bg-indigo btn-sm btn-rounded" @click="cambiarCrud('')" >
        <i class="fas fa-list"></i> Listado
    </button>
    <div class="card mt-3 card-outline card-info">
        <div class="card-header ">
            <h3 class="card-title" v-text="cardTitle"></h3>
        </div>
        <div class="card-body">
            <form id="form-prestamo" @submit.prevent="guardar">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card border border-info">
                            <div class="card-header bg-info">
                                <h3 class="card-title">Datos Cliente</h3>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">N&uacute;mero documento</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese número de documento"
                                                    v-model="clienteFrm.numero_documento"
                                                    maxlength="15" />
                                                <div class="input-group-prepend input-group-append-sm">
                                                    <button class="btn btn-info" @click="nuevoCliente">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Nombres y Apellidos</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese número de documento"
                                                    :value="clienteFrm.nombres+' '+clienteFrm.apellido_paterno+' '+clienteFrm.apellido_materno"
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card border border-danger">
                            <div class="card-header bg-maroon">
                                <h3 class="card-title">Datos Pr&eacute;stamo</h3>
                            </div>
                            <div class="card-body">
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="fecha_prestamo" class="col-form-label col-form-label-sm col-md-3">Fecha</label>
                                            <div class="col-md-9">
                                                <input type="date" class="form-control form-control-sm" v-model="form.fecha_prestamo" title="Fecha Préstamo"
                                                    :class="{ 'is-invalid': form.errors.fecha_prestamo }"
                                                    id="fecha_prestamo">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="frecuencia_pago_id" class="col-form-label col-form-label-sm col-md-3">Frecuencia Pago</label>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm" v-model="form.frecuencia_pago_id">
                                                    <option value="">-SELECCIONAR-</option>
                                                    <option v-for="moneda in frecuenciaPagos" :key="moneda.id" :value="moneda.id"
                                                            v-text="moneda.nombre"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>                                
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Monto</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.capital_inicial" title="Capital Inicial"
                                                    :class="{ 'is-invalid': form.errors.capital_inicial }" placeholder="0.00" />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="frecuencia_pago_id" class="col-form-label col-form-label-sm col-md-3">Aplicar Interés a</label>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm" v-model="form.aplicacion_interes_id">
                                                    <option value="">-SELECCIONAR-</option>
                                                    <option v-for="aplica in aplicacionIntereses" :key="aplica.id" :value="aplica.id"
                                                            v-text="aplica.nombre"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Interés</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.interes" title="Interés"
                                                    :class="{ 'is-invalid': form.errors.interes }" placeholder="0.00" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Número cuotas</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.numero_cuotas" title="Número de Cuotas"
                                                    :class="{ 'is-invalid': form.errors.numero_cuotas }" placeholder="0.00" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                </div>
            </form>
        </div>
        <div class="card-footer">  
            <div class="row">
                <div class="col-md-12 text-center">
                    <span v-if="form.estado_crud!='mostrar'">
                        <button type="submit" class="btn btn-success">
                            <span v-if="form.estado_crud=='nuevo'"><i class="fas fa-save"></i> Guardar</span>
                            <span v-else-if="form.estado_crud=='editar'"><i class="fas fa-sync-alt"></i> Actualizar</span>
                        </button>
                    </span>
                </div>
            </div>  
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="modal fade" id="modal-cliente-form">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-info">
                        <h4 class="modal-title" id="modal-cliente-form-title">Default Modal</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="modal-cliente-form-body">
                        <cliente-form :clienteFrm="clienteFrm"></cliente-form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>