<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { useHelper } from '../../../helpers';
import { useCliente } from '../../../composables/prestamo/clientes';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast, soloNumeros } = useHelper();

const { form } = toRefs(props);


const buscarPersona = ref({
    tipo_documento_id: '',
    numero_documento:'' 
})

const {
    errors, respuesta, tipoDocumentos, sexos, persona,
    obtenerListaTipoDocumentos, obtenerListaSexos,
    buscarDatosDni, agregarCliente
} = useCliente();

onMounted(() => {
    obtenerListaTipoDocumentos();
    obtenerListaSexos();
});

const obtenerPersona = async() => {
    buscarPersona.value.tipo_documento_id = form.value.tipo_documento_id;
    buscarPersona.value.numero_documento  = form.value.numero_documento;

    await buscarDatosDni(buscarPersona.value)
    if(errors.value)
    {
        form.value.errors = errors.value
    }
    // if(persona.value)
    // {
    //     form.value.nombres = persona.value.nombres;
    //     form.value.apellido_paterno = persona.value.apellidoPaterno;
    //     form.value.apellido_materno = persona.value.apellidoMaterno;


    // }
}

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregarCliente(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-cliente').modal('hide')
            emit('onListar')
        }
    },
    'editar': async() => {
        // form.value.errors = [];
        // await actualizarMoneda(form.value);

        // if(errors.value) form.value.errors = errors.value;

        // if(respuesta.value.ok==1)
        // {
        //     form.value.errors = [];
        //     Toast.fire({icon:'success', title:respuesta.value.mensaje})
        //     $('#modal-moneda').modal('hide')
        //     emit('onListar')
        // }
    },
}

const guardar = () => {
    crud[form.value.estado_crud]()
}

</script>
<template>
<form @submit.prevent="guardar">
    <div class="modal fade" id="modal-cliente">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-cliente-title">Nuevo Empleado</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header bg-primary">
                                    <h4 class="card-title">Datos Personales</h4>
                                </div>
                                <div class="card-body">
                                    <div class="form-group row">
                                        <label for="tipo_documento" class="col-form-label col-form-label-sm col-md-3 mb-1">Tipo Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <select class="form-control form-control-sm"
                                                v-model="form.tipo_documento_id" id="tipo_documento"
                                                :class="{ 'is-invalid' : form.errors.tipo_documento_id}">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="tipo in tipoDocumentos" :value="tipo.id" :title="tipo.nombre_largo">{{ tipo.nombre_corto }}</option>
                                            </select>
                                            <small class="text-danger" v-for="error in form.errors.tipo_documento_id" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="numero_documento" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro.   Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento"
                                                maxlength="15"    v-model="form.numero_documento"
                                                :class="{ 'is-invalid' : form.errors.numero_documento}" placeholder="Nro. documento de Identidad"
                                                @keypress="soloNumeros" @change="obtenerPersona"
                                                />
                                            <small class="text-danger" v-for="error in form.errors.numero_documento" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="nombres" class="col-form-label col-form-label-sm col-md-3 mb-1">Nombres:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="nombres"
                                                v-model="form.nombres"
                                                :class="{ 'is-invalid' : form.errors.nombres}" placeholder="Ingrese Nombres"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.nombres" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apellido_paterno" class="col-form-label col-form-label-sm col-md-3 mb-1">Apellido Paterno:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="apellido_paterno"
                                                v-model="form.apellido_paterno"
                                                :class="{ 'is-invalid' : form.errors.apellido_paterno}" placeholder="Ingrese apellido_paterno"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.apellido_paterno" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apellido_materno" class="col-form-label col-form-label-sm col-md-3 mb-1">Apellido Materno:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="apellido_materno"
                                                v-model="form.apellido_materno"
                                                :class="{ 'is-invalid' : form.errors.apellido_materno}" placeholder="Ingrese apellido_materno"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.apellido_materno" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="sexo" class="col-form-label col-form-label-sm col-md-3 mb-1">Sexo:</label>
                                        <div class="col-md-9 mb-1">
                                            <select class="form-control form-control-sm"
                                                v-model="form.sexo_id" id="sexo"
                                                :class="{ 'is-invalid' : form.errors.sexo_id}">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="sex in sexos" :value="sex.id" >{{ sex.nombre }}</option>
                                            </select>
                                            <small class="text-danger" v-for="error in form.errors.sexo_id" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="telefono" class="col-form-label col-form-label-sm col-md-3 mb-1">Tel&eacute;fono:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="telefono"
                                                v-model="form.telefono"
                                                :class="{ 'is-invalid' : form.errors.telefono}" placeholder="Ingrese teléfono"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.telefono" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="direccion" class="col-form-label col-form-label-sm col-md-3 mb-1">Direcci&oacute;n:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="direccion"
                                                v-model="form.direccion"
                                                :class="{ 'is-invalid' : form.errors.direccion}" placeholder="Ingrese teléfono"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.direccion" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
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