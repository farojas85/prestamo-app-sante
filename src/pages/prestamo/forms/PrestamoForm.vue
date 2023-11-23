<script setup>
import { toRefs, onMounted, ref, computed } from 'vue';
import ClienteForm from './ClienteForm.vue';
import { useHelper } from '../../../helpers';
import {usePrestamo } from '../../../composables/prestamo/prestamos';
import { useDatosSession } from '../../../composables/session';


const { soloNumeros, Toast } = useHelper();

const props = defineProps({
    form: Object,
    cardTitle: String
});

const emit = defineEmits(['onListar']);

const { form, cardTitle } = toRefs(props);


const cambiarCrud = (crud) => {
    form.value.estado_crud = crud;
}

const buscarDni = ref("");

const errorBusqueda = ref("");

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
    departamento_id:'',
    provincia_id:'',
    distrito_id:'',
    errors:[],
    estado_crud:''
});

const {
    frecuenciaPagos,aplicacionIntereses, persona, errors, respuesta,
    obtenerListaFrecuenciaPagos, obtenerListaAplicacionInrtereses, buscarClienteExiste,
    obtenerValorInteres,agregrarPrestamo,actualizarPrestamo
} = usePrestamo();


onMounted(() => {
    obtenerListaFrecuenciaPagos();
    obtenerListaAplicacionInrtereses()
})



form.value.total = computed(() => {
    if(form.value.capital_inicial == 0)
    {
        return 0;
    }
    return (Math.round( (parseFloat(form.value.capital_inicial)*( 1 + (parseFloat(form.value.interes)/100)))*100 )/100).toFixed(2) ;
});

form.value.valor_cuota = computed(() => {
    if(form.value.capital_inicial == 0)
    {
        return 0;
    }
    if(form.value.numero_cuotas <= 0 )  {
        return Math.round(parseFloat(form.value.total)).toFixed(2);
    }
    return (Math.round((parseFloat(form.value.total) / parseFloat(form.value.numero_cuotas))*100)/100).toFixed(2);
})

const limpiar = () => {
    form.value.id = null;
    form.value.cliente_id='';
    form.value.numero_documento="";
    form.value.nombres='';
    form.value.apellido_paterno='';
    form.value.apellido_materno='';
    form.value.telefono='';
    form.value.direccion='';
    form.value.fecha_prestamo='';
    form.value.user_id='';
    form.value.role='';
    form.value.frecuencia_pago_id='';
    form.value.capital_inicial=0;
    form.value.aplicacion_interes_id='';
    form.value.interes=0;
    form.value.numero_cuotas=1;
    form.value.aplicacion_mora_id='';
    form.value.interes_moratorio=2.5;
    form.value.dias_gracia=0;
    //form.value.total=0;
    //form.value.valor_cuota=0;
    form.value.cuotas = [];
    form.value.estado_crud='';
    form.value.errors = [];
    errors.value = [];
}

const limpiarCliente = () => {
    clienteFrm.value.id='';
    clienteFrm.value.tipo_documento_id='';
    clienteFrm.value.numero_documento='';
    clienteFrm.value.nombres='';
    clienteFrm.value.apellido_paterno='';
    clienteFrm.value.apellido_materno='';
    clienteFrm.value.sexo_id='';
    clienteFrm.value.telefono='';
    clienteFrm.value.direccion='';
    clienteFrm.value.correo_personal='';
    clienteFrm.value.es_activo=1;
    clienteFrm.value.errors=[];
    clienteFrm.value.estado_crud="";
}


const nuevoCliente = () => {
    clienteFrm.value.estado_crud = 'nuevo'
    errorBusqueda.value = ''
    $('#modal-cliente-form-title').html('Nuevo Cliente')
    $("#modal-cliente-form").modal('show')
}

const editarCliente = () => {
    clienteFrm.value.estado_crud = 'editar'
    errorBusqueda.value = ''
    $('#modal-cliente-form-title').html('Editar Cliente')
    $("#modal-cliente-form").modal('show')
}

const buscaExisteCliente = async() => {
    errorBusqueda.value="";
    limpiarCliente();

    await buscarClienteExiste(form.value.numero_documento)

    if(persona.value)
    {

        clienteFrm.value.id = persona.value.id
        clienteFrm.value.numero_documento = persona.value.numero_documento;
        clienteFrm.value.nombres = persona.value.nombres;
        clienteFrm.value.apellido_paterno = persona.value.apellido_paterno;
        clienteFrm.value.apellido_materno = persona.value.apellido_materno;
        clienteFrm.value.direccion = persona.value.direccion;
        clienteFrm.value.telefono = persona.value.telefono;

        form.value.cliente_id = clienteFrm.value.id
        form.value.nombres = clienteFrm.value.nombres;
        form.value.apellido_paterno = clienteFrm.value.apellido_paterno;
        form.value.apellido_materno = clienteFrm.value.apellido_materno;
        form.value.direccion = clienteFrm.value.direccion;
        form.value.telefono = persona.value.telefono;
    }

    if(!persona.value)
    {
        errorBusqueda.value = "Dni no encontrado.";
    }
}

const valorInteres = () => {
    if(form.value.frecuencia_pago_id!= "")
    {
        let frecuencia = frecuenciaPagos.value.find(f => f.id === form.value.frecuencia_pago_id)
        console.log(frecuencia)
        form.value.interes = parseFloat(frecuencia.valor_interes).toFixed(2)
    }
}

const crud = {
    'nuevo': async() => {

        form.value.errors = [];
        await agregrarPrestamo(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            form.value.estado_crud =''
            emit('onListar')
        }
    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarPrestamo(form.value);

        if(errors.value) form.value.errors = errors.value;

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            form.value.estado_crud =''
            emit('onListar')
        }
    },
}

const guardar = async() => {
    crud[form.value.estado_crud]()
}

const cancelar = () => {
   limpiar()
   form.value.estado_crud = ""
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
                                                    v-model="form.numero_documento"
                                                    maxlength="15" @keypress="soloNumeros" 
                                                    @change="buscaExisteCliente" :readonly="form.estado_crud=='mostrar'"/>
                                                <!-- <div class="input-group-append">
                                                    <button type="button" class="btn btn-danger" @click="nuevoCliente"
                                                        v-if="form.estado_crud=='nuevo'">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-warning" @click="editarCliente"
                                                        v-if="form.estado_crud=='editar'">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                </div> -->
                                            </div>
                                            <small class="text-danger" v-if="errorBusqueda">{{ errorBusqueda }}</small>
                                        </div>
                                    </div>
                                    <!-- <div class="row" v-if="clienteFrm.nombres">
                                        <div class="col-md-12">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Nombres y Apellidos</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese número de documento"
                                                    readonly
                                                    :value="clienteFrm.nombres+' '+clienteFrm.apellido_paterno+' '+clienteFrm.apellido_materno"
                                                    />
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Dirección</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese dirección"
                                                    readonly
                                                    :value="clienteFrm.direccion"
                                                    />
                                            </div>
                                        </div>
                                    </div> -->

                                    <div class="row" v-if="form.nombres">
                                        <div class="col-md-12">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Nombres y Apellidos</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese número de documento"
                                                    readonly
                                                    :value="form.nombres+' '+form.apellido_paterno+' '+form.apellido_materno"
                                                    />
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Dirección</span>
                                                </div>
                                                <input type="text" class="form-control" placeholder="Ingrese dirección"
                                                    readonly
                                                    :value="form.direccion"
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
                                            <label for="fecha_prestamo" class="col-form-label col-form-label-sm col-md-4">Fecha</label>
                                            <div class="col-md-8">
                                                <input type="date" class="form-control form-control-sm" v-model="form.fecha_prestamo" title="Fecha Préstamo"
                                                    :class="{ 'is-invalid': form.errors.fecha_prestamo }"
                                                    id="fecha_prestamo"
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="frecuencia_pago_id" class="col-form-label col-form-label-sm col-md-3">Aplicar Interés a</label>
                                            <div class="col-md-9">
                                                <select class="form-control form-control-sm" v-model="form.aplicacion_interes_id"
                                                    :disabled="form.estado_crud=='mostrar'">
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
                                            <label for="frecuencia_pago_id" class="col-form-label col-form-label-sm col-md-4">Frecuencia Pago</label>
                                            <div class="col-md-8">
                                                <select class="form-control form-control-sm" v-model="form.frecuencia_pago_id"
                                                    :disabled="form.estado_crud=='mostrar'"
                                                    @change="valorInteres"
                                                >
                                                    <option value="">-SELECCIONAR-</option>
                                                    <option v-for="moneda in frecuenciaPagos" :key="moneda.id" :value="moneda.id"
                                                            v-text="moneda.nombre"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Capital Inicial</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.capital_inicial" title="Capital Inicial"
                                                    :class="{ 'is-invalid': form.errors.capital_inicial }" placeholder="0.00" 
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                   
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-4">Interés</label>
                                            <div class="col-md-8">
                                                <input type="text" class="form-control form-control-sm" v-model="form.interes" title="Interés"
                                                    :class="{ 'is-invalid': form.errors.interes }" placeholder="0.00" 
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="numero_cuotas" class="col-form-label col-form-label-sm col-md-3">Número cuotas</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.numero_cuotas" title="Número de Cuotas"
                                                    :class="{ 'is-invalid': form.errors.numero_cuotas }" placeholder="0.00" 
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="interes_moratorio" class="col-form-label col-form-label-sm col-md-4">Interés Mora</label>
                                            <div class="col-md-8">
                                                <input type="text" class="form-control form-control-sm" v-model="form.interes_moratorio" title="Interés Moratorio"
                                                    :class="{ 'is-invalid': form.errors.interes_moratorio }" placeholder="0.00" 
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Días de gracia</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.dias_gracia" title="Número de Cuotas"
                                                    :class="{ 'is-invalid': form.errors.numero_cuotas }" placeholder="0" 
                                                    :readonly="form.estado_crud=='mostrar'"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <label for="interes_moratorio" class="col-form-label col-form-label-sm col-md-4">TOTAL</label>
                                            <div class="col-md-8">
                                                <input type="text" class="form-control form-control-sm" v-model="form.total" title="Interés Moratorio"
                                                    readonly />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <label for="monto" class="col-form-label col-form-label-sm col-md-3">Valor de Cuota</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control form-control-sm" v-model="form.valor_cuota" title="Valor de la CUota"
                                                    readonly />
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
                    <button type="submit" class="btn btn-danger mr-3" @click.prevent="cancelar">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <span v-if="form.estado_crud!='mostrar'">
                        <button type="submit" class="btn btn-success" @click.prevent="guardar">
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
                <div class="modal-dialog modal-xl">
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