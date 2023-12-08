<script setup>
import { ref, onMounted } from 'vue';
import { useHelper } from '../../../helpers';
import { useNotificacion } from '../../../composables/configuracion/notificaciones';
import NotificacionForm from './Form.vue';

const { Toast, Swal } = useHelper();
const {
    form, dato, notificaciones, errors, respuesta, notificacion,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerNotificacion, eliminarNotificacion
} = useNotificacion();

onMounted(() => {
    listar();
})

const rutaNotificacion = import.meta.env.VITE_APP_API_URL+'/storage/notificaciones/';

const nuevo = () => {
    limpiar();

    form.value.estado_crud = 'nuevo';
    (
        document.getElementById('modal-notificacion-title')
    ).innerHTML ="Nueva Notificación";

    $('#modal-notificacion').modal('show')
}

const obtenerDatos = async(id) => {
    await obtenerNotificacion(id)
    
    if(notificacion.value)
    {
        form.value.id = notificacion.value.id;
        form.value.titulo = notificacion.value.titulo;
        form.value.contenido = notificacion.value.contenido;
        form.value.fecha_inicio = notificacion.value.fecha_inicio;
        form.value.fecha_fin = notificacion.value.fecha_fin;
        form.value.role_id = notificacion.value.role_id;

        if(notificacion.value.imagen)
        {
            form.value.imagen = rutaNotificacion+notificacion.value.imagen
        }
    }

}
const editar = async(id) => {
    limpiar();
    obtenerDatos(id);
    form.value.errors = [];
    form.value.estado_crud = 'editar';

    (
        document.getElementById('modal-notificacion-title')
    ).innerHTML ="Editar Notificación";

    $('#modal-notificacion').modal('show')
}

const elimina = async (id) => {
    await eliminarNotificacion(id)
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
        title:'¿Está seguro de eliminar la Notificacion?',
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

</script>
<template>
    <div class="card card-success card-outline">
        <div class="card-header">
            <h6 class="card-title">
                Listado Notificaciones
                <a class="btn btn-danger btn-sm ml-1"
                    @click.prevent="nuevo" >
                    <i class="fa fa-plus"></i>
                </a>
            </h6>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-2 mb-1">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Mostrar</span>
                        </div>
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
                </div>
                <div class="col-md-6 mb-1">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Buscar</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Ingrese Nombre"
                            v-model="dato.buscar" @keyup="buscar"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 mb-1">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">#</th>
                                    <th>T&iacute;tulo</th>
                                    <th class="text-center">Fecha Inicio</th>
                                    <th class="text-center">Fecha Fin</th>
                                    <th class="text-center">Rol</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="notificaciones.total == 0">
                                    <td class="text-danger text-center table-danger" colspan="7">
                                        -- Datos No Registrados --
                                    </td>
                                </tr>
                                <tr v-else v-for="(notif,index) in notificaciones.data">
                                    <td class="text-center" v-text="index+notificaciones.from"></td>
                                    <td v-text="notif.titulo"></td>
                                    <td v-text="notif.fecha_inicio"></td>
                                    <td v-text="notif.fecha_fin"></td>
                                    <td class="text-center" v-text="notif.role"></td>
                                    <td>                                       
                                        <button class="btn btn-warning btn-sm mr-1"
                                            title="Editar Notificación"
                                            @click.prevent="editar(notif.id)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger btn-sm mr-1"
                                            title="Eliminar Notificación"
                                            @click.prevent="eliminar(notif.id)">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <NotificacionForm :form="form" @onListar="listar"></NotificacionForm>
</template>