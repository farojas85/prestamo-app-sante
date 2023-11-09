<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { useHelper } from '../../../helpers';
import { useCliente } from '../../../composables/prestamo/clientes';

const props = defineProps({
    clienteFrm: Object
});


const { clienteFrm } = toRefs(props);

const buscarPersona = ref({
    tipo_documento_id: '',
    numero_documento:'' 
});

const buscandoCliente = ref(false);

const limpiarCliente = () => {
    clienteFrm.value.id = null;
    clienteFrm.value.sexo_id='';
    clienteFrm.value.nombres='';
    clienteFrm.value.apellido_paterno='';
    clienteFrm.value.apellido_materno='';
    clienteFrm.value.telefono='';
    clienteFrm.value.direccion='';
    clienteFrm.value.persona_id='';
    clienteFrm.value.es_activo=1;
    clienteFrm.value.estado_crud='';
    clienteFrm.value.errors = [];
    errors.value = [];
}

const { Toast, soloNumeros } = useHelper();

const {
    errors, respuesta, tipoDocumentos, sexos, persona,
    obtenerListaTipoDocumentos, obtenerListaSexos,
    buscarDatosDni, agregarCliente
} = useCliente();

onMounted(() => {
    limpiarCliente();
    obtenerListaTipoDocumentos();
    obtenerListaSexos();
});


const obtenerPersona = async() => {

    limpiarCliente();
    buscandoCliente.value = true;
    buscarPersona.value.tipo_documento_id = clienteFrm.value.tipo_documento_id;
    buscarPersona.value.numero_documento  = clienteFrm.value.numero_documento;

    await buscarDatosDni(buscarPersona.value)

    if(errors.value)
    {
        clienteFrm.value.errors = errors.value
    }

    if(persona.value.numeroDocumento) {
        clienteFrm.value.nombres = persona.value.nombres;
        clienteFrm.value.apellido_paterno = persona.value.apellidoPaterno;
        clienteFrm.value.apellido_materno = persona.value.apellidoMaterno;
        buscandoCliente.value = false
    }

    if(persona.value.numero_documento)
    {
        clienteFrm.value.nombres = persona.value.nombres;
        clienteFrm.value.apellido_paterno = persona.value.apellido_paterno;
        clienteFrm.value.apellido_materno = persona.value.apellido_materno;
        buscandoCliente.value= false
    }
    // if(persona.value)
    // {


    // }
}

const guardarCliente = async() => {

    await agregarCliente(clienteFrm.value)

    if(errors.value) { clienteFrm.value.errors = errors.value;  }

   if(respuesta.value.ok==1)
    {
        clienteFrm.value.id = persona.value.id
        clienteFrm.value.errors = [];
        Toast.fire({icon:'success', title:respuesta.value.mensaje})
        $('#modal-cliente').modal('hide')
    }
}
</script>
<template>
    <div class="form-group row">
        <label for="tipo_documento" class="col-form-label col-form-label-sm col-md-4 mb-1">Tipo Documento:</label>
        <div class="col-md-8 mb-1">
            <select class="form-control form-control-sm"
                v-model="clienteFrm.tipo_documento_id" id="tipo_documento"
                :class="{ 'is-invalid' : clienteFrm.errors.tipo_documento_id}">
                <option value="">-Seleccionar-</option>
                <option v-for="tipo in tipoDocumentos" :value="tipo.id" :title="tipo.nombre_largo">{{ tipo.nombre_corto }}</option>
            </select>
            
            <small class="text-danger" v-for="error in clienteFrm.errors.tipo_documento_id" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="numero_documento" class="col-form-label col-form-label-sm col-md-4 mb-1"> Nro.   Documento:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="numero_documento"
                maxlength="15"    v-model="clienteFrm.numero_documento"
                :class="{ 'is-invalid' : clienteFrm.errors.numero_documento}" placeholder="Nro. documento de Identidad"
                @keypress="soloNumeros" @change="obtenerPersona"
            />
            <small class="text-primary" v-if="buscandoCliente"><i class="fas fa-spinner fa-spin"></i> Buscando nro. documento...</small>
            <small class="text-danger" v-for="error in clienteFrm.errors.numero_documento" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="nombres" class="col-form-label col-form-label-sm col-md-4 mb-1">Nombres:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="nombres"
                v-model="clienteFrm.nombres"
                :class="{ 'is-invalid' : clienteFrm.errors.nombres}" placeholder="Ingrese Nombres"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.nombres" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="apellido_paterno" class="col-form-label col-form-label-sm col-md-4 mb-1">Apellido Paterno:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="apellido_paterno"
                v-model="clienteFrm.apellido_paterno"
                :class="{ 'is-invalid' : clienteFrm.errors.apellido_paterno}" placeholder="Ingrese apellido paterno"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.apellido_paterno" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="apellido_materno" class="col-form-label col-form-label-sm col-md-4 mb-1">Apellido Materno:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="apellido_materno"
                v-model="clienteFrm.apellido_materno"
                :class="{ 'is-invalid' : clienteFrm.errors.apellido_materno}" placeholder="Ingrese apellido materno"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.apellido_materno" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="sexo" class="col-form-label col-form-label-sm col-md-4 mb-1">Sexo:</label>
        <div class="col-md-8 mb-1">
            <select class="form-control form-control-sm"
                v-model="clienteFrm.sexo_id" id="sexo"
                :class="{ 'is-invalid' : clienteFrm.errors.sexo_id}">
                <option value="">-Seleccionar-</option>
                <option v-for="sex in sexos" :value="sex.id" >{{ sex.nombre }}</option>
            </select>
            <small class="text-danger" v-for="error in clienteFrm.errors.sexo_id" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="telefono" class="col-form-label col-form-label-sm col-md-4 mb-1">Tel&eacute;fono:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="telefono"
                v-model="clienteFrm.telefono"
                :class="{ 'is-invalid' : clienteFrm.errors.telefono}" placeholder="Ingrese teléfono"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.telefono" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="direccion" class="col-form-label col-form-label-sm col-md-4 mb-1">Direcci&oacute;n:</label>
        <div class="col-md-8 mb-1">
            <input type="text" class="form-control form-control-sm" id="direccion"
                v-model="clienteFrm.direccion"
                :class="{ 'is-invalid' : clienteFrm.errors.direccion}" placeholder="Ingrese teléfono"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.direccion" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="form-group row">
        <label for="direccion" class="col-form-label col-form-label-sm col-md-4 mb-1">Correo Personal</label>
        <div class="col-md-8 mb-1">
            <input type="email" class="form-control form-control-sm" id="direccion"
                v-model="clienteFrm.correo_personal"
                :class="{ 'is-invalid' : clienteFrm.errors.correo_personal}" placeholder="Ingrese Correo Electrónico Personal"
                >
            <small class="text-danger" v-for="error in clienteFrm.errors.correo_personal" :key="error">{{error }}</small>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">
            <i class="fas fa-times fa-fw"></i>Cerrar
        </button>
        <button type="submit" class="btn btn-success" @click.prevent="guardarCliente" data-dismiss="modal">
            <i class="fas fa-save fa-fw"></i>
            {{ clienteFrm.estado_crud == 'nuevo'? 'Guardar' : 'Modificar' }}
        </button>
    </div>
</template>