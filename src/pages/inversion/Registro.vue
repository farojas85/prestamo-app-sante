<script setup>
import { toRefs, onMounted } from 'vue';
import {useHelper} from '../../helpers';
import { useHistorialInversion } from '../../composables/registro-inversion/historial-inversion';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast } = useHelper();

const { form } = toRefs(props);

const {
    errors, respuesta, tasa_interes,
    obtenerTasaInteresInversion, agregrarRegistroInversion
} = useHistorialInversion();

onMounted(() => {
    obtenerTasaInteresInversion('Interés Inversión');    
});

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregrarRegistroInversion(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-registro').modal('hide')
            emit('onListar')
        }

    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarMenu(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-registro').modal('hide')
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
    <div class="modal fade" id="modal-registro">
        <div class="modal-dialog" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-registro-title">Nueva Inversi&oacute;n</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <label for="monto" class="col-form-label col-form-label-sm col-md-3 mb-1">Monto:</label>
                        <div class="col-md-9 mb-1">
                            <input type="text" class="form-control form-control-sm" name="monto"
                                v-model="form.monto"
                                :class="{ 'is-invalid' : form.errors.monto}" placeholder="Ingrese monto de inversión"
                                >
                            <small class="text-danger" v-for="error in form.errors.monto" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="tasa_interes" class="col-form-label col-form-label-sm col-md-3 mb-1">Tasa de Interés:</label>
                        <div class="col-md-9 mb-1">
                            <select class="form-control form-control-sm"
                                v-model="form.tasa_interes" id="tasa_interes" name="tasa_interes"
                                :class="{ 'is-invalid' : form.errors.tasa_interes}"
                                :disabled="form.estado_crud=='mostrar'">
                                <option value="">-Seleccionar-</option>
                                <option v-for="tasa in tasa_interes" :value="tasa.valor" >{{ tasa.valor }}</option>
                            </select>
                            <small class="text-danger" v-for="error in form.errors.tasa_interes" :key="error">{{error }}</small>
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