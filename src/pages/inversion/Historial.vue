<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHelper } from '../../helpers';
import { useHistorialInversion } from '../../composables/registro-inversion/historial-inversion';
import { useDatosSession } from '../../composables/session';
import RegistroForm from './Registro.vue';

const { Swal, Toast } = useHelper();

const {
    form, dato, inversiones, errors, respuesta, tasa_interes,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerTasaInteresInversion
} = useHistorialInversion();

const {usuario, roles} = useDatosSession();

onMounted(() => {
    dato.value.user = usuario.value.id;
    dato.value.role = roles.value.slug
    listar();
});

const nuevo = () => {
    limpiar();

    form.value.estado_crud = 'nuevo';

    (
        document.getElementById('modal-registro-title')
    ).innerHTML ="Nuevo Registro de Inversión";

    $('#modal-registro').modal('show')

}
</script>
<template>
    <div class="row">
        <div class="col-md-12 t-2">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h5 class="card-title">
                        Historial de Inversiones
                        <a class="btn btn-danger btn-sm ml-1"
                            @click="nuevo" >
                            <i class="fa fa-plus"></i>
                        </a>
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row mt-2">
                        <div class="col-md-3">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Mostrar</span>
                                </div>
                                <select class="custom-select custom-select-sm form-control form-control-sm text-center"
                                    v-model="dato.paginacion" @change="cambiarPaginacion">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <div class="input-group-append">
                                    <div class="input-group-text">Registros</div>
                                </div>
                            </div>               
                        </div>
                        <div class="col-md-6">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Buscar</span>
                                </div>
                                <input type="text" name="table-search" id="table-search"
                                    class="form-control"  placeholder="Buscar..." v-model="dato.buscar"
                                    @change="buscar" />
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-info btn-sm">
                                        <i class="fas fa-search"></i>
                                    </button>                                  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped table-bordered table-hover text-nowrap">
                                    <thead class="bg-navy">
                                        <tr>                                            
                                            <th class="text-center">#</th>
                                            <th class="text-center">Fecha</th>
                                            <th class="text-center">Monto</th>
                                            <th class="text-center">Tasa Interés (%)</th>
                                            <!-- <th class="text-center">Detalle</th> -->
                                            <!-- <th>Cliente</th> -->
                                            <!-- <th>Forma Pago</th>
                                            <th>Medio Pago</th> -->
                                            <!-- <th v-if="roles.slug!= 'lider'">Líder</th>
                                            <th>Estado</th> -->
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="inversiones.total == 0">
                                            <td class="text-center text-danger table-danger" colspan="11">--Datos No registrados--</td>    
                                        </tr>
                                        <tr v-else v-for="(inv,index) in inversiones.data">
                                            <td class="text-center" v-text="index+inversiones.from"></td>
                                            <td class="text-center" v-text="inv.fecha"></td>
                                            <td class="text-center">{{ parseFloat(inv.monto).toFixed(2) }}</td>
                                            <td class="text-center" v-text="inv.tasa_interes"></td>
                                            <!-- <td v-text="inv.cliente"></td> -->
                                            <!-- <td v-text="inv.forma_inv"></td>
                                            <td v-text="inv.medio_inv"></td> -->
                                            <!-- <td v-if="roles.slug!='lider'" v-text="inv.lider"></td> -->
                                            <!-- <td class="text-center">
                                                <span class="badge badge-info" v-if="inv.estado_operacion=='Generado'">Generado</span>
                                                <span class="badge badge-warning" v-else-if="inv.estado_operacion=='Pendiente'">Pendiente</span>
                                                <span class="badge badge-success" v-else-if="inv.estado_operacion=='Pagado'">Pagado</span>
                                                <span class="badge badge-secondary" v-else-if="inv.estado_operacion=='Anulado'">Anulado</span>
                                                <span class="badge badge-danger" v-else-if="inv.estado_operacion=='Eliminado'">Eliminado</span>
                                                <span class="badge bg-orange" v-else-if="inv.estado_operacion=='Pre-Pagado'">Pre-Pagado</span>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-success btn-xs mr-1"
                                                    v-if="['super-usuario','gerente'].includes(roles.slug) && inv.estado_operacion=='Pre-Pagado'"
                                                    @click="aceptarinv(inv.id)">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button type="button" class="btn btn-primary btn-xs mr-1"
                                                    title="Ver Voucher" @click="mostrarVoucher(inv.id)" >
                                                    <i class="fas fa-check-to-slot"></i>
                                                </button>
                                                <button class="btn bg-indigo btn-xs mr-1"
                                                    title="Impprimir recibo" v-if="pago.estado_operacion=='Pagado'"
                                                        @click.prevent="imprimirRecibo(pago.id)"
                                                    >
                                                    <i class="fas fa-print"></i>
                                                </button>
                                            </td> -->
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
    <RegistroForm :form="form" :onListar="listar"></RegistroForm>
</template>