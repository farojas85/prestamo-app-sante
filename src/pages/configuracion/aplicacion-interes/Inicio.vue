<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../../helpers';
import { useAplicacionInteres } from '../../../composables/configuracion/aplicacion-intereses';
import AplicacionInteresForm from './Form.vue';

const { Toast, Swal } = useHelper();
const {
    form, dato, aplicacionIntereses, errors, respuesta, aplicacionInteres,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerAplicacionInteres, eliminarAplicacionInteres, inhabilitarAplicacionInteres,
    habilitarAplicacionInteres
} = useAplicacionInteres();


onMounted(() => {
    listar();
})

const nuevo = () => {
    limpiar();

    form.value.estado_crud = 'nuevo';
    (
        document.getElementById('modal-aplicacion-interes-title')
    ).innerHTML ="Nuevo Aplicación de interés";

    $('#modal-aplicacion-interes').modal('show')

}

const obtenerDatos = async(id) => {
    await obtenerAplicacionInteres(id);
    form.value.id = aplicacionInteres.value.id;
    form.value.nombre = aplicacionInteres.value.nombre;
    form.value.es_activo = aplicacionInteres.value.es_activo == 1 ? true : false
}

const editar = (id) => {
    limpiar();
    obtenerDatos(id);
    form.value.estado_crud = 'editar';
    (
        document.getElementById('modal-aplicacion-interes-title')
    ).innerHTML ="Editar Aplicación de interés";

    $('#modal-aplicacion-interes').modal('show')
}

const elimina = async (id) => {
    await eliminarAplicacionInteres(id)
    if(respuesta.value.ok==1) {
        errors.value=[]
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        })
    }
}

const eliminar = (id) => {
        Swal.fire({
        //title: 'Grados Ministeriales',
        title:'¿Está seguro de eliminar la Aplicación de interés?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Si",
        showCancelButton: true,
        cancelButtonText: "No",
        cancelButtonColor:'#c82333'
    }).then((result) => {
        if (result.isConfirmed) {
            elimina(id)
            listar()
        }
    })
}

const inhabilita = async (id) => {
    await inhabilitarAplicacionInteres(id)
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
        title:'¿Está seguro de inhabilitar la Aplicación de interés?',
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
    await habilitarAplicacionInteres(id)
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
        title:'¿Está seguro de habilitar la Aplicación de interés?',
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

</script>
<template>
    <div class="card card-primary card-outline">
        <div class="card-header">
            <h6 class="card-title">
                Listado Aplicación Intereses
                <a class="btn btn-danger btn-sm ml-1"
                    @click.prevent="nuevo" >
                    <i class="fa fa-plus"></i>
                </a>
            </h6>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-2 mb-1">
                    <select class="form-control form-control-sm" v-model="dato.paginacion"
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
                <div class="col-md-6 mb-1">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text" id="basic-addon1">Buscar</span>
                        <input type="text" class="form-control" placeholder="Ingrese Nombre"
                            v-model="dato.buscar" @keyup="buscar"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-1">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="aplicacionIntereses.total == 0">
                                    <td class="text-danger text-center table-danger" colspan="5">
                                        -- Datos No Registrados --
                                    </td>
                                </tr>
                                <tr v-else v-for="(tipo,index) in aplicacionIntereses.data">
                                    <td class="text-center" v-text="index+aplicacionIntereses.from"></td>
                                    <td v-text="tipo.nombre"></td>
                                    <td class="text-center">
                                        <span class="badge bg-success" v-if="tipo.es_activo==1">Activo</span>
                                        <span class="badge bg-dark" v-else-if="tipo.es_activo==0">Inactivo</span>
                                    </td>
                                    <td>
                                        <template v-if="tipo.es_activo==1">
                                            <button class="btn btn-warning btn-sm mr-1"
                                                title="Editar Aplicación de interés"
                                                @click.prevent="editar(tipo.id)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm mr-1"
                                                title="Eliminar Aplicación de interés"
                                                @click.prevent="eliminar(tipo.id)">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                            <button class="btn btn-info btn-sm mr-1"
                                                title="Inhabilitar Aplicación de interés"
                                                @click.prevent="inhabilitar(tipo.id)">
                                                <i class="fas fa-ban"></i>
                                            </button>
                                        </template>
                                        <button class="btn btn-success btn-sm mr-1"
                                            title="Habilitar Aplicación de interés"
                                            @click.prevent="habilitar(tipo.id)" v-if="tipo.es_activo==0">
                                            <i class="fas fa-check"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    Mostrando <b>{{aplicacionIntereses.from}}</b> a <b>{{ aplicacionIntereses.to }}</b> de <b>{{ aplicacionIntereses.total}}</b> Registros
                </div>
                <div class="col-md-3 text-right">
                    <nav>
                        <ul class="pagination">
                            <li v-if="aplicacionIntereses.current_page >= 2" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Primera Página"
                                    @click.prevent="cambiarPagina(1)">
                                    <span><i class="fas fa-backward-fast"></i></span>
                                </a>
                            </li>
                            <li v-if="aplicacionIntereses.current_page > 1" class="page-item">
                                <a href="#" aria-label="Previous" class="page-link"
                                    title="Página Anterior"
                                    @click.prevent="cambiarPagina(aplicacionIntereses.current_page - 1)">

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
                            <li v-if="aplicacionIntereses.current_page < aplicacionIntereses.last_page" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    title="Página Siguiente"
                                    @click.prevent="cambiarPagina(aplicacionIntereses.current_page + 1)">
                                    <span><i class="fas fa-angle-right"></i></span>
                                </a>
                            </li>
                                <li v-if="aplicacionIntereses.current_page <= aplicacionIntereses.last_page-1" class="page-item">
                                <a href="#" aria-label="Next" class="page-link"
                                    @click.prevent="cambiarPagina(aplicacionIntereses.last_page)"
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
    <AplicacionInteresForm :form="form" @onListar="listar"></AplicacionInteresForm>
</template>