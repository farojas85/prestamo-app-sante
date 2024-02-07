<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHelper } from '../../helpers';
import { useHistorialInversion } from '../../composables/registro-inversion/historial-inversion';
import { useDatosSession } from '../../composables/session';
import RegistroForm from './Registro.vue';
import dayjs  from 'dayjs';

const { Swal, Toast } = useHelper();

const {
    form, dato, inversiones, errors, respuesta, tasa_interes,inversionistas,
    registro_inversion,
    listar, buscar, isActived, pagesNumber, cambiarPaginacion, cambiarPagina,
    limpiar, obtenerTasaInteresInversion,obtenerListaInversionistas,
    listarPorInversionista, obtenerRegistroInversion, eliminarRegistroInversion
} = useHistorialInversion();

const {usuario, roles} = useDatosSession();

onMounted(() => {
    obtenerListaInversionistas()
    
    dato.value.user = '%';
    if(roles.value.slug=='inversionista')
    {
        dato.value.user = usuario.value.id
    }
    dato.value.role = roles.value.slug
    listar();
});

const nuevo = () => {
    limpiar();
    let dia = dayjs();
    form.value.estado_crud = 'nuevo';
    form.value.fecha = dia.format('YYYY-MM-DD') ?? '';

    (
        document.getElementById('modal-registro-title')
    ).innerHTML ="Nuevo Registro de Inversión";

    $('#modal-registro').modal('show')
}

const listarPorInv = (event) => {
     listarPorInversionista(event.target.value)
}

const ObtenerDatos = async(id) => {
    await obtenerRegistroInversion(id);
    form.value.id= registro_inversion.value.id;
    form.value.fecha= registro_inversion.value.fecha;
    form.value.inversionista_id= registro_inversion.value.inversionista_id;
    form.value.monto= registro_inversion.value.monto;
    form.value.tasa_interes= registro_inversion.value.tasa_interes;
}

const editar = (id) => {
    limpiar();
    ObtenerDatos(id);

    form.value.estado_crud = 'editar';

    (
        document.getElementById('modal-registro-title')
    ).innerHTML ="Editar Registro de Inversión";

    $('#modal-registro').modal('show')
}

const elimina = async (id) => {
    await eliminarRegistroInversion(id)
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
        title:'¿Está seguro de eliminar el registro de inversión?',
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
    <div class="row">
        <div class="col-md-12 t-2">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h5 class="card-title">
                        Historial de Inversiones
                        <a class="btn btn-danger btn-sm ml-1"
                            v-if="['gerente','super-usuario'].includes(roles.slug)"
                            @click="nuevo" >
                            <i class="fa fa-plus"></i>
                        </a>
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row mt-1">
                        <div class="col-md-1 mb-1">
                            <div class="input-group input-group-sm">
                                <!-- <div class="input-group-prepend">
                                    <span class="input-group-text">Mostrar</span>
                                </div> -->
                                <select class="custom-select custom-select-sm form-control form-control-sm"
                                    v-model="dato.paginacion" @change="cambiarPaginacion">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-5 mb-1" v-if="['gerente','super-usuario'].includes(roles.slug)">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Inversionista</span>
                                </div>
                                <select class="form-control form-control-sm"
                                    id="inversionista" name="inversionista" @change="listarPorInv($event)">
                                    <option value="">-Seleccionar-</option>
                                    <option v-for="inv in inversionistas" :value="inv.id" >{{ inv.apellidos_nombres }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6 mb-1">
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
                                            <th v-if="roles.slug!=='inversionista'">Inversionista</th>
                                            <th class="text-center">Monto</th>
                                            <th class="text-center">Tasa Interés mensual(%)</th>
                                            <th class="text-center">Dias transcurridos</th>
                                            <th class="text-center">Rentabilidad en días</th>
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
                                            <td v-if="roles.slug!=='inversionista'" v-text="inv.inversionista"></td>
                                            <td class="text-center">{{ parseFloat(inv.monto).toFixed(2) }}</td>
                                            <td class="text-center" v-text="inv.tasa_interes"></td>
                                            <td class="text-center" v-text="inv.dias_transcurridos"></td>
                                            <td class="text-center" v-text="inv.rentabilidad_diaria"></td>
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
                                            </td>-->
                                            <td>
                                                <template v-if="['gerente','super-usuario'].includes(roles.slug)">
                                                    <button  type="button" class="btn btn-warning btn-xs mr-1"
                                                        title="Editar Registro de Inversión"
                                                        @click="editar(inv.id)">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger btn-xs mr-1"
                                                        title="Eliminar registro de inversión" 
                                                        @click="eliminar(inv.id)" >
                                                        <i class="fas fa-trash-alt"></i>
                                                    </button>

                                                </template>
                                                 <!--<button class="btn bg-indigo btn-xs mr-1"
                                                    title="Impprimir recibo" v-if="pago.estado_operacion=='Pagado'"
                                                        @click.prevent="imprimirRecibo(pago.id)"
                                                    >
                                                    <i class="fas fa-print"></i>
                                                </button> -->
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
    <RegistroForm :form="form" @onListar="listar"></RegistroForm>
</template>