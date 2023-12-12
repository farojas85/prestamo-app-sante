<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHelper } from '../../helpers';
import { useRegistroPago } from '../../composables/registro-pago/registro-pago';
import { useDatosSession } from '../../composables/session';
import verVoucherForm from './modals/VerVoucher.vue';
import ReciboPagoForm from './modals/ReciboPago.vue';

const { Swal, Toast } = useHelper();
const {
    respuesta,errors, registro_pagos, vouchers, registro_pago,
    limpiarRegistroPago,obtenerHistorialPagos, obtenerDataRegistroPago,
    aceptarRegistroPago, imprimirReciboPago
} = useRegistroPago();

const {usuario, roles} = useDatosSession();

const busqueda = ref({
    pagina:1,
    paginacion:50,
    frase:'',
    user: usuario.value.id,
    role: roles.value.slug
})

onMounted(() => {
    obtenerHistorialPagos(busqueda.value)
})

const cambiarPaginacion = () => {

}

const buscar = () => {

}

const mostrarVoucher = async(id) => {
    limpiarRegistroPago();
    vouchers.value = [];
    await obtenerDataRegistroPago(id)

    $('#mdl-ver-voucher').modal('show');
}

const acepta = async(id) => {
    let pago  = registro_pagos.value.data.find(p => p.id === id);

    let data = new FormData();
    data.append('id',id);
    data.append('cuota_id',pago.cuota_id);

    await aceptarRegistroPago(data);

    if(respuesta.value.ok==1)
    {
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        });
        obtenerHistorialPagos(busqueda.value);
    }
    if(respuesta.value.ok==0)
    {

    }
}
const aceptarPago =(id) => {

    let pago = registro_pagos.value.data.find(p => p.id === id);

    Swal.fire({
        title:'¿Está seguro de Aceptar el Pago?',
        text:'De: '+pago.cliente,
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        cancelButtonColor:'#dc3545',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            acepta(id)
        }
    })
}

const imprimirRecibo = ( id) => {
    registro_pago.value = registro_pagos.value.data.find(p => p.id === id);
    // imprimirReciboPago(pago);
    $('#mdl-recibo-pago').modal('show');
}


</script>
<template>
    <div class="row">
        <div class="col-md-12 t-2">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h5 class="card-title">Historial Pagos</h5>
                </div>
                <div class="card-body">
                    <div class="row mt-2">
                        <div class="col-md-3">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Mostrar</span>
                                </div>
                                <select class="custom-select custom-select-sm form-control form-control-sm text-center"
                                    v-model="busqueda.paginacion" @change="cambiarPaginacion">
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
                                    class="form-control"  placeholder="Buscar..." v-model="busqueda.frase"
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
                                            <th class="text-center">Serie/Número</th>
                                            <th class="text-center">Total</th>
                                            <th class="text-center">Detalle</th>
                                            <th>Cliente</th>
                                            <!-- <th>Forma Pago</th>
                                            <th>Medio Pago</th> -->
                                            <th v-if="roles.slug!= 'lider'">Líder</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="registro_pagos.total == 0">
                                            <td class="text-center text-danger table-danger" colspan="11">--Datos No registrados--</td>    
                                        </tr>
                                        <tr v-else v-for="(pago,index) in registro_pagos.data">
                                            <td class="text-center" v-text="index+registro_pagos.from"></td>
                                            <td class="text-center" v-text="pago.fecha"></td>
                                            <td class="text-center" v-text="pago.serie_numero"></td>
                                            <td class="text-center">{{ parseFloat(pago.total).toFixed(2) }}</td>
                                            <td class="text-center" v-text="pago.cuota"></td>
                                            <td v-text="pago.cliente"></td>
                                            <!-- <td v-text="pago.forma_pago"></td>
                                            <td v-text="pago.medio_pago"></td> -->
                                            <td v-if="roles.slug!='lider'" v-text="pago.lider"></td>
                                            <td class="text-center">
                                                <span class="badge badge-info" v-if="pago.estado_operacion=='Generado'">Generado</span>
                                                <span class="badge badge-warning" v-else-if="pago.estado_operacion=='Pendiente'">Pendiente</span>
                                                <span class="badge badge-success" v-else-if="pago.estado_operacion=='Pagado'">Pagado</span>
                                                <span class="badge badge-secondary" v-else-if="pago.estado_operacion=='Anulado'">Anulado</span>
                                                <span class="badge badge-danger" v-else-if="pago.estado_operacion=='Eliminado'">Eliminado</span>
                                                <span class="badge bg-orange" v-else-if="pago.estado_operacion=='Pre-Pagado'">Pre-Pagado</span>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-success btn-xs mr-1"
                                                    v-if="['super-usuario','gerente'].includes(roles.slug) && pago.estado_operacion=='Pre-Pagado'"
                                                    @click="aceptarPago(pago.id)">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button type="button" class="btn btn-primary btn-xs mr-1"
                                                    title="Ver Voucher" @click="mostrarVoucher(pago.id)" >
                                                    <i class="fas fa-check-to-slot"></i>
                                                </button>
                                                <button class="btn bg-indigo btn-xs mr-1"
                                                    title="Impprimir recibo" v-if="pago.estado_operacion=='Pagado'"
                                                        @click.prevent="imprimirRecibo(pago.id)"
                                                    >
                                                    <i class="fas fa-print"></i>
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
        </div>
    </div>
    <verVoucherForm :vouchers="vouchers"></verVoucherForm>
    <ReciboPagoForm :registro_pago="registro_pago"></ReciboPagoForm>
</template>