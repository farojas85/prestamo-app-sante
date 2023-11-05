<script setup>
import { toRefs, onMounted } from 'vue';
import {useHelper} from '../../../helpers';
import { useRole } from '../../../composables/sistema/roles';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast } = useHelper();

const { form } = toRefs(props);

const {
    errors, respuesta, tipoAccesos,
    agregarRole, actualizarRole, obtenerListaTipoAccesos
} = useRole();

onMounted(() => {
    obtenerListaTipoAccesos();
});

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregarRole(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-role').modal('hide')
            emit('onListar')
        }
    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarRole(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-role').modal('hide')
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
    <div class="modal fade" id="modal-role">
        <div class="modal-dialog" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-role-title">Nuevo Tipo de Actividad</h6>
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
                        <label for="slug" class="col-form-label col-form-label-sm col-md-3 mb-1"> Slug:</label>
                        <div class="col-md-9 mb-1">
                            <input type="text" class="form-control form-control-sm" name="slug"
                                v-model="form.slug"
                                :class="{ 'is-invalid' : form.errors.slug}" placeholder="Ruta de Acceso"
                                >
                            <small class="text-danger" v-for="error in form.errors.slug" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="tipo_acceso" class="col-form-label col-form-label-sm col-md-3 mb-1">Tipo Acceso:</label>
                        <div class="col-md-9 mb-1">
                            <select class="form-control form-control-sm"
                                v-model="form.tipo_acceso_id"
                                :class="{ 'is-invalid' : form.errors.tipo_acceso_id}">
                                <option value="">-Seleccionar-</option>
                                <option v-for="tipo in tipoAccesos" :value="tipo.id">{{ tipo.nombre }}</option>
                            </select>
                            <small class="text-danger" v-for="error in form.errors.tipo_acceso_id" :key="error">{{error }}</small>
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