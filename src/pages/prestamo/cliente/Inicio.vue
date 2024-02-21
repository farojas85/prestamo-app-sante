<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../../helpers';
import { useCliente } from '../../../composables/prestamo/clientes';
import { useDatosSession } from '../../../composables/session';
import dayjs from 'dayjs';
import ClienteForm from './Form.vue';
import VerDocumentosForm from './modals/VerDocumentos.vue';
import PrePrestamoForm from './modals/PrePrestamo.vue';

const { Toast, Swal } = useHelper();

const { usuario, roles } = useDatosSession();

const prePrestamo = ref({
    id:'',
    cliente_id:'',
    numero_documento:'',
    nombres:'',
    apellido_paterno:'',
    apellido_materno:'',
    telefono:'',
    direccion:'',
    fecha_prestamo:'',
    user_id:'',
    role:'',
    frecuencia_pago_id:'',
    capital_inicial:0,
    aplicacion_interes_id:'',
    interes:0,
    numero_cuotas:1,
    aplicacion_mora_id:'',
    interes_moratorio:2.5,
    dias_gracia:0,
    total:0,
    valor_cuota:0,
    estado_crud:"",
    cuotas:[],
    errors:[]
});

const limpiarClienteSeleccionado = () => {
    prePrestamo.value.id='';
    prePrestamo.value.cliente_id='';
    prePrestamo.value.numero_documento='';
    prePrestamo.value.nombres='';
    prePrestamo.value.apellido_paterno='';
    prePrestamo.value.apellido_materno='';
    prePrestamo.value.telefono='';
    prePrestamo.value.direccion='';
    prePrestamo.value.fecha_prestamo='';
    prePrestamo.value.user_id='';
    prePrestamo.value.role='';
    prePrestamo.value.frecuencia_pago_id='';
    prePrestamo.value.capital_inicial=0;
    prePrestamo.value.aplicacion_interes_id='';
    prePrestamo.value.interes=0;
    prePrestamo.value.numero_cuotas=1;
    prePrestamo.value.aplicacion_mora_id='';
    prePrestamo.value.interes_moratorio=2.5;
    prePrestamo.value.dias_gracia=0;
    prePrestamo.value.estado_crud="";
    prePrestamo.value.cuotas=[];
    prePrestamo.value.errors=[];
}

const {
    form, dato, clientes, errors, respuesta, cliente,
    provincias,distritos, archivos, lideres,tipoDocumentos,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerCliente, subirAnversoDni, subirReversoDni, verDocumentos,
    obtenerListaLideres, obtenerListaTipoDocumentos
} = useCliente();


onMounted(() => {
    dato.value.role = roles.value.slug;
    dato.value.user = usuario.value.id;
    dato.value.lider = '%';
    listar();
    obtenerListaLideres(dato.value)
})

const nuevo = () => {
    limpiar();
    form.value.estado_crud = 'nuevo';
    (
        document.getElementById('modal-cliente-title')
    ).innerHTML ="Nuevo Cliente";

    $('#modal-cliente').modal('show')
}

const obtenerDatos = async(id) => {
    limpiar();
    await obtenerCliente(id);
    let dato = cliente.value;
    let person = dato.persona;
    let emple = dato.cliente;


    form.value.id = id;
    form.value.tipo_documento_id = person.tipo_documento_id ?? '';
    form.value.numero_documento = person.numero_documento;
    form.value.sexo_id = person.sexo_id ?? '';
    form.value.nombres = person.nombres;
    form.value.apellido_paterno = person.apellido_paterno;
    form.value.apellido_materno = person.apellido_materno;
    form.value.telefono = person.telefono;
    form.value.direccion = person.direccion;
    form.value.persona_id = emple.persona_id ?? '';
    form.value.user_id = emple.user_id ?? '';
    form.value.departamento_id = dato.departamento?.id ?? '';
    form.value.provincia_id = dato.provincia?.id ?? '';
    form.value.distrito_id = dato.distrito?.id ?? '';
    form.value.superior_id = emple.superior_id ?? '';
    // departamentos.value = dato.departamentos ?? [];
    form.value.provincias = dato.provincias ?? [];
    form.value.distritos = dato.distritos ?? [];
    form.value.cuentas_bancarias = dato.cliente_cuentas
    form.value.es_activo = emple.es_activo == 1 ? true : false
}


const editar = (id) => {
    limpiar();
    obtenerDatos(id);
    form.value.estado_crud = 'editar';
    (
        document.getElementById('modal-cliente-title')
    ).innerHTML ="Editar Cliente";

    $('#modal-cliente').modal('show')
}

const subirDniAnverso = async(id) => {
    await obtenerDatos(id);
    let apellidos_nombres = (form.value.apellido_paterno+' '+form.value.apellido_materno+' '+form.value.nombres) ?? "";

    const { value: file } = await Swal.fire({
        text:"De: "+apellidos_nombres,
        title: "Subir la cara Anversa del DNI",
        input: "file",
        inputAttributes: {
            "accept": "image/*",
            "aria-label": "Subir anverso del DNI"
        }
    });

    if (file) {
        var formData = new FormData();
        
        var pdf = $('.swal2-file')[0].files[0];

        formData.append("dni_anverso",file);
        formData.append('cliente_id',id);

        await  subirAnversoDni(formData);

        if(respuesta.value.ok==1)
        {
            Toast.fire({
                icon: 'success',
                title: respuesta.value.mensaje
            });
            listar();
        }
    }
}

const subirDniReverso = async(id) => {
    await obtenerDatos(id);
    let apellidos_nombres = (form.value.apellido_paterno+' '+form.value.apellido_materno+' '+form.value.nombres) ?? "";

    const { value: file } = await Swal.fire({
        text:"De: "+apellidos_nombres,
        title: "Subir la cara Reversa del DNI",
        input: "file",
        inputAttributes: {
            "accept": "image/*",
            "aria-label": "Subir reverso del DNI"
        }
    });

    if (file) {
        var formData = new FormData();
        
        var pdf = $('.swal2-file')[0].files[0];

        formData.append("dni_reverso",file);
        formData.append('cliente_id',id);

        await  subirReversoDni(formData);

        if(respuesta.value.ok==1)
        {
            Toast.fire({
                icon: 'success',
                title: respuesta.value.mensaje
            });
            listar();
        }
    }
}

const mostrarDocumentos = async(id) => {
    await verDocumentos(id);
    $('#mld-ver-documentos').modal('show');
}

const nuevoPrestamo = async (id) => {
    limpiarClienteSeleccionado();
    await obtenerCliente(id);
    let dato = cliente.value;
    prePrestamo.value.cliente_id = dato.id;
    prePrestamo.value.numero_documento = dato.persona.numero_documento;
    prePrestamo.value.nombres = dato.persona.nombres;
    prePrestamo.value.apellido_paterno = dato.persona.apellido_paterno;
    prePrestamo.value.apellido_materno = dato.persona.apellido_materno;
    prePrestamo.value.telefono = dato.persona.telefono;
    prePrestamo.value.direccion = dato.persona.direccion;
    prePrestamo.value.fecha_prestamo = dayjs().format('YYYY-MM-DD');
    prePrestamo.value.estado_crud = 'nuevo';
    $('#modal-nuevo-prestamo').modal('show');
}

</script>
<template>
    <div class="card card-primary card-outline">
        <div class="card-header">
            <h6 class="card-title">
                Listado de Clientes
                <a class="btn btn-danger btn-sm ml-1"
                    @click.prevent="nuevo" >
                    <i class="fa fa-plus"></i> Nuevo
                </a>
            </h6>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-2 mb-1">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Mostrar</span>
                        </div>
                        <select class="form-control" v-model="dato.paginacion"
                            @change="cambiarPaginacion">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="50">75</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4 mb-1" v-if="roles.slug!='lider'">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" v-if="['super-usuario','gerente'].includes(roles.slug)">L&iacute;der Superior</span>
                            <span class="input-group-text" v-else-if="['lider-superior'].includes(roles.slug)">L&iacute;der</span>
                        </div>
                        <select class="form-control" v-model="dato.lider"
                            @change="listar(1)">
                            <option value="">-Seleccionar-</option>
                            <option value="%">TODOS</option>
                            <option v-for="lider in lideres" :value="lider.id" v-text="lider.empleado"></option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6 mb-1">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Buscar</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Ingrese Num. documento, nombres, apellidos"
                            v-model="dato.buscar" @change="buscar"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-1">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">Nro. Documento</th>
                                    <th class="text-center">Apellidos y Nombres</th>
                                    <th class="text-center">Tel&eacute;fono</th>
                                    <th class="text-center" v-if="roles.slug!='lider'">Lider</th>
                                    <th class="text-center">valoración</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="clientes.total == 0">
                                    <td class="text-danger text-center table-danger" colspan="7">
                                        -- Datos No Registrados --
                                    </td>
                                </tr>
                                <tr v-else v-for="(cli,index) in clientes.data">
                                    <td class="text-center" v-text="index+clientes.from"></td>
                                    <td class="text-center" v-text="cli.numero_documento"></td>
                                    <td class="text-left" v-text="cli.apellidos_nombres"></td>
                                    <td class="text-center" v-text="cli.telefono"></td>
                                    <td v-text="cli.lider" v-if="roles.slug!='lider'"></td>
                                    <td></td>
                                    <td>
                                        <template v-if="cli.es_activo==1">
                                            <button class="btn btn-warning btn-sm mr-1"
                                                title="Editar Cliente"
                                                @click.prevent="editar(cli.id)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button type="button" class="btn bg-purple btn-sm mr-1"
                                                title="Nuevo Préstamo"
                                                v-if="['super-usuario','gerente','lider'].includes(roles.slug)"
                                                @click="nuevoPrestamo(cli.id)">
                                                <i class="fa-solid fa-square-plus"></i>
                                            </button>
                                            <button type="button" class="btn btn-primary btn-sm dropdown-toggle mr-1" 
                                                data-toggle="dropdown" >
                                                <i class="fas fa-folder-closed"></i>
                                            </button>
                                            <div class="dropdown-menu table-warning">
                                                <a class="dropdown-item" href="#" @click.prevent="subirDniAnverso(cli.id)">
                                                    <i class="fas fa-upload fa-fw text-primary"></i> Subir DNI - Anverso
                                                </a>
                                                <a class="dropdown-item" href="#" @click.prevent="subirDniReverso(cli.id)">
                                                    <i class="fas fa-upload fa-fw text-primary"></i> Subir DNI - Reverso
                                                </a>
                                                <a class="dropdown-item" href="#"
                                                    @click.prevent="mostrarDocumentos(cli.id)">
                                                    <i class="fas fa-eye fa-fw text-danger"></i> Ver Documentos
                                                </a>
                                            </div>
                                        </template>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    Mostrando <b>{{clientes.from}}</b> a <b>{{ clientes.to }}</b> de <b>{{ clientes.total}}</b> Registros
                </div>
                <div class="col-md-3 text-right">
                    <nav>
                        <ul class="pagination">
                            <li v-if="clientes.current_page >= 2" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Primera Página"
                                    @click.prevent="cambiarPagina(1)">
                                    <span><i class="fas fa-backward-fast"></i></span>
                                </a>
                            </li>
                            <li v-if="clientes.current_page > 1" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Página Anterior"
                                    @click.prevent="cambiarPagina(clientes.current_page - 1)">

                                    <span><i class="fas fa-angle-left"></i></span>
                                </a>
                            </li>
                            <li v-for="page in pagesNumber()" class="page-item"
                                :key="page"
                                :class="[ page == isActived() ? 'active' : '']"
                                :title="'Página '+ page">
                                <a href="#" class="page-link"
                                    @click.prevent="cambiarPagina(page)">{{ page }}</a>
                            </li>
                            <li v-if="clientes.current_page < clientes.last_page" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    title="Página Siguiente"
                                    @click.prevent="cambiarPagina(clientes.current_page + 1)">
                                    <span><i class="fas fa-angle-right"></i></span>
                                </a>
                            </li>
                                <li v-if="clientes.current_page <= clientes.last_page-1" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    @click.prevent="cambiarPagina(clientes.last_page)"
                                    title="Última Página">
                                    <span><i class="fas fa-forward-fast"></i></span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
    <ClienteForm :form="form" @onListar="listar"></ClienteForm>
    <VerDocumentosForm :archivos="archivos"></VerDocumentosForm>
    <PrePrestamoForm :prePrestamo="prePrestamo"></PrePrestamoForm>
</template>