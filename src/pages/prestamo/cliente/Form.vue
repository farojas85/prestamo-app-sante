<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { useHelper } from '../../../helpers';
import { useCliente } from '../../../composables/prestamo/clientes';
import { useDatosSession } from '../../../composables/session';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast, soloNumeros } = useHelper();

const { form} = toRefs(props);

const { roles, usuario } = useDatosSession();

const buscandoCliente = ref(false);

const buscarPersona = ref({
    tipo_documento_id: '',
    numero_documento:'' 
})

const {
    errors, respuesta, tipoDocumentos, sexos, persona,
    departamentos, provincias, distritos, entidad_financieras, 
    cuenta_bancaria, empleados,
    obtenerListaTipoDocumentos, obtenerListaSexos,limpiar,
    obteneListaDepartamentos, obteneListaProvincias, obteneListaDistritos,
    obtenerListaEntidadFinancieras, buscarDatosDni, agregarCliente, actualizarCliente,
    obtenerListaEmpleados
} = useCliente();

onMounted(() => {
    obteneListaDepartamentos();
    obtenerListaTipoDocumentos();
    obtenerListaSexos();
    obtenerListaEntidadFinancieras();
    listarEmpleados();
});


const listarEmpleados = async() => {
    let role = (roles.value.slug);
    let user_id = usuario.value.id;
    let dato = { role : role, user_id : user_id }

    await  obtenerListaEmpleados(dato);
}

const obtenerPersona = async() => {

    limpiar();

    buscandoCliente.value = true;
    buscarPersona.value.tipo_documento_id = form.value.tipo_documento_id;
    buscarPersona.value.numero_documento  = form.value.numero_documento;

    await buscarDatosDni(buscarPersona.value);

    if(errors.value)
    {
        form.value.errors = errors.value
    }

    if(persona.value.numeroDocumento) {
        form.value.nombres = persona.value.nombres;
        form.value.apellido_paterno = persona.value.apellidoPaterno;
        form.value.apellido_materno = persona.value.apellidoMaterno;
        buscandoCliente.value = false
    }

    if(persona.value.numero_documento)
    {
        form.value.nombres = persona.value.nombres;
        form.value.apellido_paterno = persona.value.apellido_paterno;
        form.value.apellido_materno = persona.value.apellido_materno;
        buscandoCliente.value= false
    }
}


const listarProvincias = async() => {
    await obteneListaProvincias(form.value.departamento_id);
    if(form.estado_crud != 'nuevo') 
    {
        form.value.provincias = provincias.value
        form.value.provincia_id = ""
    }
}

const listarDistritos = async() => {
    await obteneListaDistritos(form.value.provincia_id);
    if(form.estado_crud != 'nuevo') 
    {
        form.value.distritos = distritos.value
        form.value.distrito_id =""
    }
}

const agregarCuentaBancaria = () => {
    let cuenta = form.value.cuentas_bancarias.find(cc => cc.entidad_financiera_id == cuenta_bancaria.value.entidad_financiera_id);
    if(!cuenta)
    {
        let banco = entidad_financieras.value.find(e => e.id === cuenta_bancaria.value.entidad_financiera_id);

        let cuenta_nueva = {
            id:'',
            cliente_id:form.value.id ?? null,
            banco:banco.nombre,
            entidad_financiera_id: cuenta_bancaria.value.entidad_financiera_id,
            numero_cuenta : cuenta_bancaria.value.numero_cuenta ?? ''
        }
        form.value.cuentas_bancarias.push(cuenta_nueva);
    }
}

const eliminarCuentaBancaria = (index) => {
    form.value.cuentas_bancarias.splice(index,1);
}

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        form.value.user_id = usuario.value.id;
        form.value.role = roles.value.slug;
        
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
        
        form.value.errors = [];
        form.value.user_id = usuario.value.id;
        form.value.role = roles.value.slug;

        await actualizarCliente(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-cliente').modal('hide')
            emit('onListar')
        }
    }
}

const guardar = () => {
    crud[form.value.estado_crud]()
}

const onClose = () => {
    cuenta_bancaria.value.id="";
    cuenta_bancaria.value.cliente_id="";
    cuenta_bancaria.value.entidad_financiera_id ="";
    cuenta_bancaria.value.banco="";
    cuenta_bancaria.value.numero_cuenta="";
}

</script>
<template>
<form @submit.prevent="guardar">
    <div class="modal fade" id="modal-cliente">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-cliente-title">Nuevo Empleado</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                        @click="onClose">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-1">
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
                                        <label for="numero_documento" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro. Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento"
                                                maxlength="15"    v-model="form.numero_documento"
                                                :class="{ 'is-invalid' : form.errors.numero_documento}" placeholder="Nro. documento de Identidad"
                                                @keypress="soloNumeros" @change="obtenerPersona"
                                            />
                                            <small class="text-primary" v-if="buscandoCliente"><i class="fas fa-spinner fa-spin"></i> Buscando nro. documento...</small>
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

                                    <div class="form-group row" v-if="['super-usuario','gerente','lider-superior'].includes(roles.slug)">
                                        <label for="empleado" class="col-form-label col-form-label-sm col-md-3 mb-1">Lider:</label>
                                        <div class="col-md-9 mb-1">
                                            <select class="form-control form-control-sm"
                                                v-model="form.empleado_id" id="empleado"
                                                :class="{ 'is-invalid' : form.errors.empleado_id}">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="emp in empleados" :value="emp.id" >{{ emp.empleado }}</option>
                                            </select>
                                            <small class="text-danger" v-for="error in form.errors.empleado_id" :key="error">{{error }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-1">
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
                                                    <input type="text" class="form-control form-control-sm" id="direccion"
                                                        v-model="form.direccion"
                                                        :class="{ 'is-invalid' : form.errors.direccion}" placeholder="Ingrese teléfono"
                                                        >
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
                                                        @change="listarProvincias">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="depa in departamentos" :value="depa.id" >{{ depa.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.departamento_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row" v-if="form.estado_crud=='nuevo'">
                                                <label for="provincia" class="col-form-label col-form-label-sm col-md-3 mb-1">Provincia:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.provincia_id" id="provincia"
                                                        :class="{ 'is-invalid' : form.errors.provincia_id}"
                                                        :disabled="form.estado_crud=='mostrar'"
                                                        @change="listarDistritos">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="prov in provincias" :value="prov.id" >{{ prov.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.provincia_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row" v-else-if="form.estado_crud!=='nuevo'">
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
                                            <div class="form-group row" v-if="form.estado_crud=='nuevo'">
                                                <label for="distrito" class="col-form-label col-form-label-sm col-md-3 mb-1">Distrito:</label>
                                                <div class="col-md-9 mb-1">
                                                    <select class="form-control form-control-sm"
                                                        v-model="form.distrito_id" id="distrito"
                                                        :class="{ 'is-invalid' : form.errors.distrito_id}"
                                                        :disabled="form.estado_crud=='mostrar'">
                                                        <option value="">-Seleccionar-</option>
                                                        <option v-for="dist in distritos" :value="dist.id" >{{ dist.nombre }}</option>
                                                    </select>
                                                    <small class="text-danger" v-for="error in form.errors.distrito_id" :key="error">{{error }}</small>
                                                </div>
                                            </div>
                                            <div class="form-group row" v-else-if="form.estado_crud!=='nuevo'">
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
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header bg-success">
                                    <h4 class="card-title">Datos Cuentas Bancarias</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table table-sm table-bordered">
                                        <tr>
                                            <td >
                                                <select class="form-control form-control-sm"
                                                    v-model="cuenta_bancaria.entidad_financiera_id">
                                                    <option value="">-BANCO-</option>
                                                    <option v-for="entidad in entidad_financieras" :key="entidad.id" 
                                                        :value="entidad.id" v-text="entidad.nombre"
                                                        ></option>
                                                </select>
                                            </td>
                                            <td >
                                                <input type="text" class="form-control form-control-sm" placeholder="Ingrese Número Cuenta"
                                                    v-model="cuenta_bancaria.numero_cuenta" />
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-primary" @click="agregarCuentaBancaria">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Banco</th>
                                            <th>Número Cuenta</th>
                                            <th></th>
                                        </tr>
                                        <tr v-for="(cuenta,index) in form.cuentas_bancarias">
                                            <td v-text="cuenta.banco"></td>
                                            <td v-text="cuenta.numero_cuenta"> </td>
                                            <td>
                                                <button type="button" class="btn btn-xs btn-danger" @click="eliminarCuentaBancaria(index)">
                                                    <i class="fa fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal"
                        @click="onClose">
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