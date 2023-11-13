<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../helpers';
import { useEmpleado } from '../../composables/empleado/empleados';
import EmpleadoForm from './Form.vue';

const { Toast, Swal } = useHelper();
const {
    form, dato, empleados, errors, respuesta, empleado,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar,
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
                                    <td>
                                        <template v-if="emple.es_activo==1">
                                            <button class="btn btn-warning btn-sm mr-1"
                                                title="Editar Empleado"
                                                @click.prevent="editar(emple.id)">
                                                <i class="fas fa-edit"></i>
                                            </button>
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