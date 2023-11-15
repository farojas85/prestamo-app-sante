<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../helpers';
import { useEmpleado } from '../../composables/empleado/empleados';
import EmpleadoForm from './Form.vue';

const { Toast, Swal } = useHelper();
const {
    form, dato, empleados, errors, respuesta, empleado,
    distritos, provincias, departamentos,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerEmpleado, inhabilitarEmpleado, habilitarEmpleado, imprimirContratoEmpleado
} = useEmpleado();


onMounted(() => {
    listar();
})

const nuevo = () => {
    limpiar();
    form.value.estado_crud = 'nuevo';
    (
        document.getElementById('modal-empleado-title')
    ).innerHTML ="Nuevo Empleado";

    $('#modal-empleado').modal('show')
}

const obtenerDatos = async(id) => {
    limpiar();
    await obtenerEmpleado(id);
    let dato = empleado.value;
    let person = dato.persona;
    let emple = dato.empleado;
    let user = dato.usuario;
    let role = dato.role;

    form.value.id = id;
    form.value.tipo_documento_id = person.tipo_documento_id ?? '';
    form.value.numero_documento = person.numero_documento;
    form.value.sexo_id = person.sexo_id ?? '';
    form.value.nombres = person.nombres;
    form.value.apellido_paterno = person.apellido_paterno;
    form.value.apellido_materno = person.apellido_materno;
    form.value.telefono = person.telefono;
    form.value.direccion = person.direccion;
    form.value.name = user.name;
    form.value.role_id = role.id;
    form.value.email = user.email;
    form.value.persona_id = emple.persona_id ?? '';
    form.value.user_id = emple.user_id ?? '';
    form.value.departamento_id = dato.departamento?.id ?? '';
    form.value.provincia_id = dato.provincia?.id ?? '';
    form.value.distrito_id = dato.distrito?.id ?? '';
    form.value.superior_id = emple.superior_id ?? '';
    departamentos.value = dato.departamentos ?? [];
    form.value.provincias = dato.provincias ?? [];
    form.value.distritos = dato.distritos ?? [];
    form.value.es_activo = emple.es_activo == 1 ? true : false
}


const editar = (id) => {
    limpiar();
    obtenerDatos(id);
    form.value.estado_crud = 'editar';
    (
        document.getElementById('modal-empleado-title')
    ).innerHTML ="Editar Empleado";

    $('#modal-empleado').modal('show')
}

const mostrar = (id) => {
    limpiar();
    obtenerDatos(id);
    form.value.estado_crud = 'mostrar';
    (
        document.getElementById('modal-empleado-title')
    ).innerHTML ="Mostrar Empleado";

    $('#modal-empleado').modal('show')
}

const inhabilita = async (id) => {
    await inhabilitarEmpleado(id)
    if(respuesta.value.ok==1) {
        errors.value=[]
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        })
    }
}

const inhabilitar = (id) => {
        Swal.fire({
        //title: 'Grados Ministeriales',
        title:'¿Está seguro de inhabilitar el Empleado?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Si",
        showCancelButton: true,
        cancelButtonText: "No",
        cancelButtonColor:'#c82333'
    }).then((result) => {
        if (result.isConfirmed) {
            inhabilita(id)
            listar()
        }
    })
}

const habilita = async (id) => {
    await habilitarEmpleado(id)
    if(respuesta.value.ok==1) {
        errors.value=[]
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        })
    }
}

const habilitar = (id) => {
        Swal.fire({
        //title: 'Grados Ministeriales',
        title:'¿Está seguro de habilitar el Empleado?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Si",
        showCancelButton: true,
        cancelButtonText: "No",
        cancelButtonColor:'#c82333'
    }).then((result) => {
        if (result.isConfirmed) {
            habilita(id)
            listar()
        }
    })
}

const imprimirContrato = async (id) => {
    await imprimirContratoEmpleado(id);
}

const SubirContrato = async (id) => {
    const { value: file } = await Swal.fire({
        title: "Subir Contrato",
        input: "file",
        inputAttributes: {
            "accept": "pdf/*",
            "aria-label": "Subir contrato"
        }
    });

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            Swal.fire({
            title: "Your uploaded picture",
            imageUrl: e.target.result,
            imageAlt: "The uploaded picture"
            });
        };
        reader.readAsDataURL(file);
    }
}
const enviarNotificacion = async(numero_documento) => {

}
</script>
<template>
    <div class="card card-primary card-outline">
        <div class="card-header">
            <h6 class="card-title">
                Listado de Empleados
                <a class="btn btn-danger btn-sm ml-1"
                    @click.prevent="nuevo" >
                    <i class="fa fa-plus"></i>
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
                <div class="col-md-6 mb-1">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Buscar</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Ingrese Num.documento, nombres, apellidos, usuario, email"
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
                                    <th>Foto</th>
                                    <th class="text-center">Nro. Documento</th>
                                    <th class="text-center">Apellidos y Nombres</th>
                                    <th class="text-center">Tel&eacute;fono</th>
                                    <th class="text-center">Usuario</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="empleados.total == 0">
                                    <td class="text-danger text-center table-danger" colspan="5">
                                        -- Datos No Registrados --
                                    </td>
                                </tr>
                                <tr v-else v-for="(emple,index) in empleados.data">
                                    <td class="text-center" v-text="index+empleados.from"></td>
                                    <td></td>
                                    <td class="text-center" v-text="emple.numero_documento"></td>
                                    <td class="text-left" v-text="emple.apellidos_nombres"></td>
                                    <td class="text-center" v-text="emple.telefono"></td>
                                    <td class="text-center" v-text="emple.name"></td>
                                    <td class="text-center">
                                        <span class="badge bg-success" v-if="emple.es_activo==1">Activo</span>
                                        <span class="badge bg-dark" v-else-if="emple.es_activo==0">Inactivo</span>
                                    </td>
                                    <td>
                                        <template v-if="emple.es_activo==1">
                                            <button class="btn btn-warning btn-sm mr-1"
                                                title="Editar Empleado"
                                                @click.prevent="editar(emple.id)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-info btn-sm mr-1"
                                                title="Mostrar Empleado"
                                                @click.prevent="mostrar(emple.id)">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn bg-primary btn-sm mr-1"
                                                title="Imprimir Contrato"
                                                @click.prevent="imprimirContrato(emple.id)">
                                                <i class="fas fa-print"></i>
                                            </button>
                                            <button class="btn bg-orange btn-sm mr-1"
                                                title="Subir Contrato"
                                                @click.prevent="SubirContrato(emple.id)">
                                                <i class="fas fa-upload"></i>
                                            </button>
                                            <button class="btn btn-secondary btn-sm mr-1"
                                                title="Inhabilitar Empleado"
                                                @click.prevent="inhabilitar(emple.id)">
                                                <i class="fas fa-ban"></i>
                                            </button>

                                        </template>
                                        <button class="btn btn-success btn-sm mr-1"
                                            title="Habilitar Empleado"
                                            @click.prevent="habilitar(emple.id)" v-if="emple.es_activo==0">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <!-- <button class="btn btn-success btn-sm mr-1"
                                            title="Enviar Notificaciń"
                                            @click.prevent="enviarNotificacion(emple.telefono)">
                                            <i class="fab fa-whatsapp"></i>
                                        </button> -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    Mostrando <b>{{empleados.from}}</b> a <b>{{ empleados.to }}</b> de <b>{{ empleados.total}}</b> Registros
                </div>
                <div class="col-md-3 text-right">
                    <nav>
                        <ul class="pagination">
                            <li v-if="empleados.current_page >= 2" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Primera Página"
                                    @click.prevent="cambiarPagina(1)">
                                    <span><i class="fas fa-backward-fast"></i></span>
                                </a>
                            </li>
                            <li v-if="empleados.current_page > 1" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Página Anterior"
                                    @click.prevent="cambiarPagina(empleados.current_page - 1)">

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
                            <li v-if="empleados.current_page < empleados.last_page" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    title="Página Siguiente"
                                    @click.prevent="cambiarPagina(empleados.current_page + 1)">
                                    <span><i class="fas fa-angle-right"></i></span>
                                </a>
                            </li>
                                <li v-if="empleados.current_page <= empleados.last_page-1" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    @click.prevent="cambiarPagina(empleados.last_page)"
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
    <EmpleadoForm :form="form" @onListar="listar"></EmpleadoForm>
</template>