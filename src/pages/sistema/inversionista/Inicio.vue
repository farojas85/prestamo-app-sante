<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../../helpers';
import { useInversionista } from '../../../composables/sistema/inversionistas';
import InversionistaForm from './Form.vue';
import { prestamoApi } from '../../../api';

const { Toast, Swal } = useHelper();
const {
    form, dato, inversionistas, errors, respuesta, inversionista,
    distritos, provincias, departamentos,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerInversionista, inhabilitarInversionista, habilitarInversionista
} = useInversionista();


onMounted(() => {
    listar();
})

const nuevo = () => {
    limpiar();
    form.value.estado_crud = 'nuevo';
    (
        document.getElementById('modal-inversionista-title')
    ).innerHTML ="Nuevo Inversionista";

    $('#modal-inversionista').modal('show')
}

const obtenerDatos = async(id) => {
    limpiar();
    await obtenerInversionista(id);
    let dato = inversionista.value;
    let person = dato.persona;
    let emple = dato.inversionista;
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
        document.getElementById('modal-inversionista-title')
    ).innerHTML ="Editar Inversionista";

    $('#modal-inversionista').modal('show')
}

const mostrar = (id) => {
    limpiar();
    obtenerDatos(id);
    form.value.estado_crud = 'mostrar';
    (
        document.getElementById('modal-inversionista-title')
    ).innerHTML ="Mostrar Empleado";

    $('#modal-inversionista').modal('show')
}

const inhabilita = async (id) => {
    await inhabilitarInversionista(id)
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
        title:'¿Está seguro de inhabilitar el Inversionista?',
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
    await habilitarInversionista(id)
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
        title:'¿Está seguro de habilitar el INversionista?',
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
    //await imprimirContratoEmpleado(id);
}

const SubirContrato = async (id) => {
    //await obtenerInversionista(id);
    let persona = empleado.value.persona;
    let apellidos_nombres = (persona.apellido_paterno+' '+persona.apellido_materno+' '+persona.nombres) ?? "";

    const { value: file } = await Swal.fire({
        text:"De: "+apellidos_nombres,
        title: "Subir Contrato",
        input: "file",
        inputAttributes: {
            "accept": "application/pdf",
            "aria-label": "Subir contrato"
        }
    });

    if (file) {
        var formData = new FormData();
        
        var pdf = $('.swal2-file')[0].files[0];

        formData.append("contrato",file);
        formData.append('empleado_id',id);

        await  subirContratoEmpleado(formData);

        if(respuesta.value.ok==1)
        {
            Toast.fire({
                icon: 'success',
                title: respuesta.value.mensaje
            });
            listar();
        }
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //     Swal.fire({
        //     title: "Your uploaded picture",
        //     imageUrl: e.target.result,
        //     imageAlt: "The uploaded picture"
        //     });
        // };
        // reader.readAsDataURL(file);

    }
}
const enviarNotificacion = async(numero_documento) => {

}
</script>
<template>
    <div class="card card-primary card-outline">
        <div class="card-header">
            <h6 class="card-title">
                Listado de Inversionistas
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
                                <tr v-if="inversionistas.total == 0">
                                    <td class="text-danger text-center table-danger" colspan="8">
                                        -- Datos No Registrados --
                                    </td>
                                </tr>
                                <tr v-else v-for="(emple,index) in inversionistas.data">
                                    <td class="text-center" v-text="index+inversionistas.from"></td>
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
                                            <!-- <button type="button" class="btn btn-primary btn-sm dropdown-toggle mr-1" data-toggle="dropdown">
                                                <i class="fas fa-folder-closed"></i>
                                            </button>
                                            <div class="dropdown-menu table-warning">
                                                <a class="dropdown-item" href="#" @click.prevent="imprimirContrato(emple.id)">
                                                    <i class="fas fa-print fa-fw text-pruple"></i> Imprimir Contrato
                                                </a>
                                                <a class="dropdown-item" href="#" @click.prevent="SubirContrato(emple.id)">
                                                    <i class="fas fa-upload fa-fw text-primary"></i> Subir Contrato
                                                </a>

                                                <a class="dropdown-item" href="#" v-if="emple.contrato_pdf"
                                                    @click.prevent="verContratoEmpleado(emple.id)">
                                                    <i class="fas fa-file-pdf fa-fw text-danger"></i> Ver Contrato
                                                </a>
                                            </div> -->
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
                    Mostrando <b>{{inversionistas.from}}</b> a <b>{{ inversionistas.to }}</b> de <b>{{ inversionistas.total}}</b> Registros
                </div>
                <div class="col-md-3 text-right">
                    <nav>
                        <ul class="pagination">
                            <li v-if="inversionistas.current_page >= 2" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Primera Página"
                                    @click.prevent="cambiarPagina(1)">
                                    <span><i class="fas fa-backward-fast"></i></span>
                                </a>
                            </li>
                            <li v-if="inversionistas.current_page > 1" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Página Anterior"
                                    @click.prevent="cambiarPagina(inversionistas.current_page - 1)">

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
                            <li v-if="inversionistas.current_page < inversionistas.last_page" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    title="Página Siguiente"
                                    @click.prevent="cambiarPagina(inversionistas.current_page + 1)">
                                    <span><i class="fas fa-angle-right"></i></span>
                                </a>
                            </li>
                                <li v-if="inversionistas.current_page <= inversionistas.last_page-1" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    @click.prevent="cambiarPagina(inversionistas.last_page)"
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
    <InversionistaForm :form="form" @onListar="listar"></InversionistaForm>
</template>