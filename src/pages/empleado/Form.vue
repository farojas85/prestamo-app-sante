<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { useHelper } from '../../helpers';
import { useEmpleado } from '../../composables/empleado/empleados';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast, soloNumeros } = useHelper();

const { form } = toRefs(props);

const buscandoEmpleado = ref(false);


const buscarPersona = ref({
    tipo_documento_id: '',
    numero_documento:'' 
})

const {
    errors, respuesta, tipoDocumentos, sexos, roles, persona,
    departamentos, provincias, distritos, superiores,
    obtenerListaTipoDocumentos, obtenerListaSexos, obtenerListaRoles, obteneListaDepartamentos,
    obteneListaProvincias, obteneListaDistritos, limpiar, obtenerListaSuperioresPorRole,
    buscarDatosDni, agregarEmpleado, actualizarEmpleado
} = useEmpleado();

onMounted(() => {
    obtenerListaTipoDocumentos();
    obtenerListaSexos();
    obtenerListaRoles();
    obteneListaDepartamentos();
});

const obtenerPersona = async() => {
    limpiar();
    buscandoEmpleado.value = true;
    buscarPersona.value.tipo_documento_id = form.value.tipo_documento_id;
    buscarPersona.value.numero_documento  = form.value.numero_documento;

    await buscarDatosDni(buscarPersona.value)

    if(errors.value)
    {
        form.value.errors = errors.value
    }

    if(persona.value.numeroDocumento) {
        form.value.nombres = persona.value.nombres;
        form.value.apellido_paterno = persona.value.apellidoPaterno;
        form.value.apellido_materno = persona.value.apellidoMaterno;
        buscandoEmpleado.value = false
    }

    if(persona.value.numero_documento)
    {
        form.value.nombres = persona.value.nombres;
        form.value.apellido_paterno = persona.value.apellido_paterno;
        form.value.apellido_materno = persona.value.apellido_materno;
        buscandoEmpleado.value= false
    }
}

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregarEmpleado(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-empleado').modal('hide')
            emit('onListar')
        }
    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarEmpleado(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-empleado').modal('hide')
            emit('onListar')
        }
    },
}


const listarProvincias = async() => {
    await obteneListaProvincias(form.value.departamento_id);
}

const listarDistritos = async() => {
    await obteneListaDistritos(form.value.provincia_id);
}

const listarSuperioresPorRole = async() => {
    await obtenerListaSuperioresPorRole(form.value.role_id)
}
const guardar = () => {
    crud[form.value.estado_crud]()
}
</script>
<template>
<form @submit.prevent="guardar">
    <div class="modal fade" id="modal-empleado">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-empleado-title">Nuevo Empleado</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
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
                                                :class="{ 'is-invalid' : form.errors.tipo_documento_id}"
                                                :disabled="form.estado_crud=='mostrar'">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="tipo in tipoDocumentos" :value="tipo.id" :title="tipo.nombre_largo">{{ tipo.nombre_corto }}</option>
                                            </select>
                                            <small class="text-danger" v-for="error in form.errors.tipo_documento_id" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="numero_documento" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro. Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento"
                                                maxlength="15"    v-model="form.numero_documento" :disabled="form.estado_crud=='mostrar'"
                                                :class="{ 'is-invalid' : form.errors.numero_documento}" placeholder="Nro. documento de Identidad"
                                                @keypress="soloNumeros" @change="obtenerPersona"
                                            />
                                            <small class="text-primary" v-if="buscandoEmpleado"><i class="fas fa-spinner fa-spin"></i> Buscando nro. documento...</small>
                                            <small class="text-danger" v-for="error in form.errors.numero_documento" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="nombres" class="col-form-label col-form-label-sm col-md-3 mb-1">Nombres:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="nombres"
                                                v-model="form.nombres" :disabled="form.estado_crud=='mostrar'"
                                                :class="{ 'is-invalid' : form.errors.nombres}" placeholder="Ingrese Nombres"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.nombres" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apellido_paterno" class="col-form-label col-form-label-sm col-md-3 mb-1">Apellido Paterno:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="apellido_paterno"
                                                v-model="form.apellido_paterno" :disabled="form.estado_crud=='mostrar'"
                                                :class="{ 'is-invalid' : form.errors.apellido_paterno}" placeholder="Ingrese apellido_paterno"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.apellido_paterno" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apellido_materno" class="col-form-label col-form-label-sm col-md-3 mb-1">Apellido Materno:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="apellido_materno"
                                                v-model="form.apellido_materno" :disabled="form.estado_crud=='mostrar'"
                                                :class="{ 'is-invalid' : form.errors.apellido_materno}" placeholder="Ingrese apellido_materno"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.apellido_materno" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="sexo" class="col-form-label col-form-label-sm col-md-3 mb-1">Sexo:</label>
                                        <div class="col-md-9 mb-1">
                                            <select class="form-control form-control-sm"
                                                v-model="form.sexo_id" id="sexo" :disabled="form.estado_crud=='mostrar'"
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
                                                v-model="form.telefono" :disabled="form.estado_crud=='mostrar'"
                                                :class="{ 'is-invalid' : form.errors.telefono}" placeholder="Ingrese teléfono"
                                                >
                                            <small class="text-danger" v-for="error in form.errors.telefono" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header bg-danger">
                                            <h4 class="card-title">Datos Ubigeo</h4>
                                        </div>
                                        <div class="card-body">
                                            <div class="form-group row">
                                                <label for="direccion" class="col-form-label col-form-label-sm col-md-3 mb-1">Direcci&oacute;n:</label>
                                                <div class="col-md-9 mb-1">
                                                    <textarea
                                                        class="form-control form-control-sm" id="direccion"
                                                        v-model="form.direccion" :disabled="form.estado_crud=='mostrar'"
                                                        :class="{ 'is-invalid' : form.errors.direccion}" placeholder="Ingrese Dirección"
                                                        ></textarea>
                                                    <small class="text-danger" v-for="error in form.errors.direccion" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label for="depatamento" class="col-form-label col-form-label-sm col-md-3 mb-1">Departamento:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.departamento_id" id="depatamento"
                                                        :class="{ 'is-invalid' : form.errors.departamento_id}"
                                                        :disabled="form.estado_crud=='mostrar'"
                                                        @change="listarProvincias()">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="depa in departamentos" :value="depa.id" >{{ depa.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.departamento_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label for="provincia" class="col-form-label col-form-label-sm col-md-3 mb-1">Provincia:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.provincia_id" id="provincia"
                                                        :class="{ 'is-invalid' : form.errors.provincia_id}"
                                                        :disabled="form.estado_crud=='mostrar'"
                                                        @change="listarDistritos">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="prov in form.provincias" :value="prov.id" >{{ prov.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.provincia_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label for="distrito" class="col-form-label col-form-label-sm col-md-3 mb-1">Distrito:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.distrito_id" id="distrito"
                                                        :class="{ 'is-invalid' : form.errors.distrito_id}"
                                                        :disabled="form.estado_crud=='mostrar'">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="dist in form.distritos" :value="dist.id" >{{ dist.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.distrito_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header bg-warning">
                                            <h4 class="card-title">Datos Usuario</h4>
                                        </div>
                                        <div class="card-body">
                                            <div class="form-group row" v-if="['editar','mostrar'].includes(form.estado_crud)">
                                                <label for="name" class="col-form-label col-form-label-sm col-md-3 mb-1">Nombre Usuario:</label>
                                                <div class="col-md-9 mb-1">
                                                    <input type="text" class="form-control form-control-sm" id="name"
                                                        v-model="form.name" :disabled="form.estado_crud=='mostrar'"
                                                        :class="{ 'is-invalid' : form.errors.name}" placeholder="Ingrese Usuario"
                                                        >
                                                    <small class="text-danger" v-for="error in form.errors.name" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label for="email" class="col-form-label col-form-label-sm col-md-3 mb-1">Correo Elect.:</label>
                                                <div class="col-md-9 mb-1">
                                                    <input type="email" class="form-control form-control-sm" id="email"
                                                        v-model="form.email" :disabled="form.estado_crud=='mostrar'"
                                                        :class="{ 'is-invalid' : form.errors.email}" placeholder="Ingrese Correo Electrónico"
                                                        >
                                                    <small class="text-danger" v-for="error in form.errors.email" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label for="role" class="col-form-label col-form-label-sm col-md-3 mb-1">Rol:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.role_id" id="role"
                                                        :class="{ 'is-invalid' : form.errors.role_id}"
                                                        :disabled="form.estado_crud=='mostrar'"
                                                        @change="listarSuperioresPorRole" >
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="rol in roles" :value="rol.id" >{{ rol.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.role_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <!-- <div class="form-group row" v-if="form.estado_crud=='nuevo'">
                                                <label for="password" class="col-form-label col-form-label-sm col-md-3 mb-1">Contrase&ntilde;a:</label>
                                                <div class="col-md-9 mb-1">
                                                    <input type="password" class="form-control form-control-sm" id="password"
                                                        v-model="form.password"
                                                        :class="{ 'is-invalid' : form.errors.password}" placeholder="Ingrese Contraseña"
                                                        >
                                                    <small class="text-danger" v-for="error in form.errors.password" :key="error">{{error }}</small>
                                                </div>
                                            </div> -->
                                            <div class="form-group row">
                                                <label for="superior" class="col-form-label col-form-label-sm col-md-3 mb-1">Superior:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.superior_id" id="superior"
                                                        :class="{ 'is-invalid' : form.errors.superior_id}"
                                                        :disabled="form.estado_crud=='mostrar'">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="sup in superiores" :value="sup.id" >{{ sup.nombres_apellidos }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.superior_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
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