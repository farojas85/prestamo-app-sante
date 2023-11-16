<script setup>
import { ref, toRefs, onMounted } from 'vue';
import PrestamoFrom from './forms/PrestamoForm.vue';
import { usePrestamo } from '../../composables/prestamo/prestamos';
import { useDatosSession } from '../../composables/session';

const { usuario, roles} = useDatosSession();
const cardTitle = ref('Nuevo Préstamo');

const { 
    prestamos, errors, form, dato, respuesta, 
    listar, buscar, isActived, pagesNumber, cambiarPagina, cambiarPaginacion,
    limpiar
} = usePrestamo();

onMounted(() => {
    listar();
})

const cambiarCrud = (crud) => {
    if(crud == 'nuevo') {
        nuevo(crud);
    }
}


const nuevo = (crud) => {
    limpiar();
    form.value.estado_crud = crud
    form.value.user_id = usuario.value.id
    form.value.role = roles.value.slug
    cardTitle.value = 'Nuevo Préstamo'
}


</script>
<template>
    <div class="row" v-if="form.estado_crud==''">
        <div class="col-md-12">
            <div class="card mt-3 card-outline card-primary">
                <div class="card-header">
                    <h5 class="card-title">
                        Listado Préstamos
                        <button type="button" class="btn bg-maroon btn-sm btn-rounded" @click="cambiarCrud('nuevo')" >
                            <i class="fas fa-plus"></i> Nuevo
                        </button>                        
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row mt-2">
                        <div class="col-md-12">
                            <div class="input-group input-group-sm">
                                <div class="input-group-append">
                                    <label class="col-form-label col-form-label-sm">Mostrar&nbsp;</label>
                                    <select class="custom-select custom-select-sm form-control form-control-sm"
                                            @change="cambiarPaginacion">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>&nbsp;
                                <button type="button" class="btn bg-purple btn-sm dropdown-toggle"
                                        data-toggle="dropdown">
                                    Filtros
                                </button>
                                <div class="dropdown-menu ">
                                    <a class="dropdown-item" href="#" @click="todos">Todos</a>
                                    <a class="dropdown-item" href="#" @click="habilitados">Habilitados</a>
                                    <a class="dropdown-item" href="#" @click="eliminados">Eliminados</a>
                                </div>
                                &nbsp;
                                <input type="text" name="table-search" id="table-search"
                                    class="form-control"  placeholder="Buscar..." v-model="dato.buscar"
                                    @change="buscar">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-info">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped table-bordered table-hover text-nowrap">
                                    <thead class="bg-navy">
                                        <tr>
                                            
                                            <th class="text-center">#</th>
                                            <th>Fecha/Hora</th>
                                            <th>Cliente</th>
                                            <!-- <th v-if="$auth.hasRole('administrador') || $auth.hasRole('super-usuario')">Cobrador</th> -->
                                            <th>Capital Inicial</th>
                                            <th>Interes</th>
                                            <th>Monto Final</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="prestamos.total == 0">
                                            <td class="text-center text-danger table-danger" colspan="9">--Datos No registrados--</td>
    
                                        </tr>
                                        <tr v-else v-for="(presta, indice) in prestamos.data">
                                            <td v-text="indice+prestamos.from"></td>
                                            <td v-text="presta.fecha_prestamo"></td>
                                            <td v-text="presta.cliente"></td>
                                            <td v-text="presta.capital_inicial"></td>
                                            <td v-text="presta.interes"></td>
                                            <td v-text="presta.total"></td>
                                            <td class="text-center">
                                                <span class="badge badge-info" v-if="presta.estado==1">Generado</span>
                                                <span class="badge badge-warning" v-else-if="presta.estado==2">Generado</span>
                                                <span class="badge badge-success" v-if="presta.estado==3">Pagado</span>
                                                <span class="badge badge-secondary" v-if="presta.estado==4">Anulado</span>
                                                <span class="badge badge-danger" v-if="presta.estado==5">Eliminado</span>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-if="form.estado_crud=='nuevo'">
        <div class="col-md-12">
            <PrestamoFrom :form="form" :cardTitle="cardTitle" @onListar="listar"></PrestamoFrom>
        </div>
    </div>
</template>