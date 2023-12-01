<script setup>
import { ref } from 'vue';
import { useRegistroPago } from '../../composables/registro-pago/registro-pago';

const {
    respuesta, errors, clientes, prestamos, cliente, cuotas, prestamo,
    buscarClientesPrestamo, listarPrestamosCliente, listarCuotasPrestamo
} = useRegistroPago();

const frase = ref("");

const clienteEncontrado = ref(0);
const prestamoEncontrado = ref(0);
const cuotaEncontrada = ref(0);

const busquedaCliente = async() =>{

    clienteEncontrado.value =0;    
    prestamoEncontrado.value = 0;
    cuotaEncontrada.value = 0;
    cliente.value = {};
    prestamos.value = {};

    await buscarClientesPrestamo(frase.value);

    if(clientes.value.length > 0 )
    {
        clienteEncontrado.value= 1;
    }
}

const buscarPrestamos= async(index,id) => {
    prestamos.value = {};
    cliente.value = {};
    prestamoEncontrado.value = 0;
    cuotaEncontrada.value = 0;

    await listarPrestamosCliente(id);

    cliente.value = clientes.value[index];
    clienteEncontrado.value = 2;
    
    if(prestamos.value)
    {
        clientes.value = []
        prestamoEncontrado.value = 1;
    }
}

const buscarCuotas = async(index,id) => {
    cuotas.value = [];
    prestamo.value ={};
    cuotaEncontrada.value = 0;

    await listarCuotasPrestamo(id);

    prestamo.value = prestamos.value.data[index];
    prestamoEncontrado.value = 2;

    if(cuotas.value)
    {
        prestamos.value = {};
        cuotaEncontrada.value = 1;
    }
}

const agregarDetalle = async(index,id) => {

}
</script>
<template>
    <div class="row">
        <div class="col-md-6 mb-2">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text font-weight-bold" id="basic-addon1" >Cliente</span>
                </div>
                <input type="text" class="form-control" placeholder="Ingrese número de documento, apellidos, nombres del cliente"
                    v-model="frase"
                    @change="busquedaCliente"
                />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8 table-responsive" v-if="clienteEncontrado==0">
            <div class="callout callout-danger">
                <h5 class="text-secondary">Ingrese nombres, apellidos o número de documento del cliente y presine ENTER o TAB</h5>
                <p class="text-indigo">Se mostrará un Listado con los datos que coincidan con la búsqueda</p>
            </div>
        </div>
        <div class="col-md-8 table-responsive" v-else-if="clienteEncontrado==1">
            <table class="table table-sm table-bordered">
                <thead>
                    <tr class="table-info">
                        <th>#</th>
                        <th>Cliente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="clientes.length == 0">
                        <td class="text-center text-danger" colspan="3">--Datos no econtrados--</td>
                    </tr>
                    <tr v-else v-for="(cli,index) in clientes">
                        <td v-text="index+1"></td>
                        <td v-text="cli.cliente"></td>
                        <td>
                            <button type="button" class="btn btn-xs btn-success" @click="buscarPrestamos(index,cli.id)">
                                <i class="fas fa-check"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row" v-if="clienteEncontrado==2">
        <div class="col-md-12">
            <div class="card border border-info">
                <div class="card-header py-2 bg-info">
                    <h5 class="card-title">Datos Cliente</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Nro. Documento</span>
                                </div>
                                <label class="form-control">{{ cliente?.numero_documento }}</label>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Apellidos y Nombres</span>
                                </div>
                                <label class="form-control">{{ cliente?.cliente }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Teléfono</span>
                                </div>
                                <label class="form-control">{{ cliente?.telefono }}</label>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Dirección</span>
                                </div>
                                <label class="form-control">{{ cliente?.direccion }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12" v-if="prestamoEncontrado==0">
            <div class="callout callout-danger">
                <h5 class="text-danger">Préstamos no registrados</h5>
                <p class="text-secondary">No se han encontrado préstamos del cliente seleccionado</p>
            </div>
        </div>
        <div class="col-md-12" v-else-if="prestamoEncontrado==1">
            <div class="card  border border-success">
                <div class="card-header bg-success">
                    <h5 class="card-title">Listado Préstamos</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12 table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th class="text-center">#</th>
                                        <th class="text-center">Fecha Préstamo</th>
                                        <th class="text-center">Captital Inicial</th>
                                        <th class="text-center">Interés</th>
                                        <th class="text-center">Número Cuotas</th>
                                        <th class="text-center">Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="prestamos?.total == 0">
                                        <td class="text-center text-danger table-danger" colspan="7">--Datos no encontrados--</td>
                                    </tr>
                                    <tr v-else v-for="(presta,index) in prestamos.data">
                                        <td class="text-center" v-text="index+prestamos.from"></td>
                                        <td v-text="presta.fecha_prestamo"></td>
                                        <td class="text-center">{{ parseFloat(presta.capital_inicial).toFixed(2) }}</td>
                                        <td class="text-center">{{ parseFloat(presta.interes).toFixed(2) }}</td>
                                        <td class="text-center" v-text="presta.numero_cuotas"></td>
                                        <td class="text-center">
                                            <span class="badge badge-info" v-if="presta.estado=='Generado'">Generado</span>
                                            <span class="badge badge-warning" v-else-if="presta.estado=='Pendiente'">Pendiente</span>
                                            <span class="badge badge-success" v-else-if="presta.estado=='Pagado'">Pagado</span>
                                            <span class="badge badge-secondary" v-else-if="presta.estado=='Anulado'">Anulado</span>
                                            <span class="badge badge-danger" v-else-if="presta.estado=='Eliminado'">Eliminado</span>
                                            <span class="badge bg-indigo" v-else-if="presta.estado=='Observado'">Observado</span>
                                            <span class="badge bg-maroon" v-else-if="presta.estado=='Rechazado'">Rechazado</span>
                                            <span class="badge bg-primary" v-else-if="presta.estado=='Aceptado'">Aceptado</span>
                                            <span class="badge bg-orange" v-else-if="presta.estado=='Abonado'">Abonado</span>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-sm btn-success" @click="buscarCuotas(index,presta.id)">
                                                <i class="fas fa-check"></i>
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
    <div class="row" v-if="prestamoEncontrado == 2">
        <div class="col-md-12">
            <div class="card border border-primary">
                <div class="card-header py-2 bg-primary">
                    <h5 class="card-title">Listado de Cuotas</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mb-1">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Fecha Préstamo</span>
                                </div>
                                <label class="form-control">{{ prestamo?.fecha_prestamo }}</label>
                            </div>
                        </div>
                        <div class="col-md-4 mb-1">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Capital Inicial</span>
                                </div>
                                <label class="form-control">{{ prestamo?.capital_inicial }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-1">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Interes</span>
                                </div>
                                <label class="form-control">{{ prestamo?.interes }}</label>
                            </div>
                        </div>
                        <div class="col-md-4 mb-1">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Número Cuotas</span>
                                </div>
                                <label class="form-control">{{ prestamo?.numero_cuotas }}</label>
                            </div>
                        </div>
                        <div class="col-md-4 mb-1">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Estado</span>
                                </div>
                                <label class="form-control">
                                    <span class="badge badge-info" v-if="prestamo.estado=='Generado'">Generado</span>
                                    <span class="badge badge-warning" v-else-if="prestamo.estado=='Pendiente'">Pendiente</span>
                                    <span class="badge badge-success" v-else-if="prestamo.estado=='Pagado'">Pagado</span>
                                    <span class="badge badge-secondary" v-else-if="prestamo.estado=='Anulado'">Anulado</span>
                                    <span class="badge badge-danger" v-else-if="prestamo.estado=='Eliminado'">Eliminado</span>
                                    <span class="badge bg-indigo" v-else-if="prestamo.estado=='Observado'">Observado</span>
                                    <span class="badge bg-maroon" v-else-if="prestamo.estado=='Rechazado'">Rechazado</span>
                                    <span class="badge bg-primary" v-else-if="prestamo.estado=='Aceptado'">Aceptado</span>
                                    <span class="badge bg-orange" v-else-if="prestamo.estado=='Abonado'">Abonado</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th class="text-center">#</th>
                                        <th class="text-center">Fecha Vencimiento</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Monto</th>
                                        <th class="text-center">Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="cuotas?.length== 0">
                                        <td class="text-center text-danger table-danger" colspan="6">--Datos no encontrados--</td>
                                    </tr>
                                    <tr v-else v-for="(cuota,index) in cuotas">
                                        <td class="text-center" v-text="index+1"></td>
                                        <td class="text-center" v-text="cuota.fecha_vencimiento"></td>
                                        <td class="text-center" v-text="cuota.descripcion"></td>
                                        <td class="text-center" v-text="cuota.monto_cuota"></td>
                                        <td class="text-center">
                                            <span class="badge badge-warning" v-if="cuota.estado=='Pendiente'">Pendiente</span>
                                            <span class="badge badge-success" v-else-if="cuota.estado=='Pagado'">Pagado</span>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-sm btn-success" @click="buscarCuotas(index,cuota.id)">
                                                <i class="fas fa-plus"></i>
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
</template>