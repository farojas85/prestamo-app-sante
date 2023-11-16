<script setup>
import { toRefs } from 'vue';
import {useHelper} from '../../../helpers';
import { useFrecuenciaPago } from '../../../composables/configuracion/frecuencia-pagos';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast } = useHelper();

const { form } = toRefs(props);

const {
    errors, respuesta,
    agregarFrecuenciaPago, actualizarFrecuenciaPago
} = useFrecuenciaPago();

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregarFrecuenciaPago(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-frecuencia-pago').modal('hide')
            emit('onListar')
        }
    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarFrecuenciaPago(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-frecuencia-pago').modal('hide')
            emit('onListar')
        }
    },
}

const guardar = () => {
    crud[form.value.estado_crud]()
}

</script>

<template>
<form @submit.prevent="guardar">
    <div class="modal fade" id="modal-frecuencia-pago">
        <div class="modal-dialog" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-frecuencia-pago-title">Nuevo Tipo de Actividad</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <label for="nombre" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nombre:</label>
                        <div class="col-md-9 mb-1">
                            <input type="text" class="form-control form-control-sm" name="nombre"
                                v-model="form.nombre"
                                :class="{ 'is-invalid' : form.errors.nombre}" placeholder="nombre de Tipo de Acceso"
                                >
                            <small class="text-danger" v-for="error in form.errors.nombre" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="dias" class="col-form-label col-form-label-sm col-md-3 mb-1"> Días:</label>
                        <div class="col-md-2 mb-1">
                            <input type="number" class="form-control form-control-sm" name="dias" min="1"
                                v-model="form.dias"
                                :class="{ 'is-invalid' : form.errors.dias}" placeholder="Ingrese días"
                                >
                            <small class="text-danger" v-for="error in form.errors.dias" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="valor_interes" class="col-form-label col-form-label-sm col-md-3 mb-1"> Valor Interés:</label>
                        <div class="col-md-2 mb-1">
                            <input type="number" class="form-control form-control-sm" name="valor_interes" step="0.1"
                                v-model="form.valor_interes"
                                :class="{ 'is-invalid' : form.errors.valor_interes}" placeholder="Ingrese valor Interés"
                                >
                            <small class="text-danger" v-for="error in form.errors.valor_interes" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="form-group row" v-if="form.estado_crud!='nuevo'">
                        <label class="col-form-label col-form-label-sm col-md-3">Estado</label>
                        <div class="col-md-9">
                            <div class="custom-control custom-checkbox">
                                <input class="custom-control-input" type="checkbox" id="customCheckbox2" v-model="form.es_activo" :value="form.es_activo">
                                <label for="customCheckbox2" class="custom-control-label">{{ form.es_activo ==1 ? 'Activo' : 'Inactivo' }}</label>
                            </div>
                            <small class="text-danger" v-for="error in errors.es_activo"
                                :key="error">{{error }}</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">
                        <i class="fas fa-times fa-fw"></i>Cerrar
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save fa-fw"></i>
                        {{ form.estado_crud == 'nuevo'? 'Guardar' : 'Modificar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>
</template>