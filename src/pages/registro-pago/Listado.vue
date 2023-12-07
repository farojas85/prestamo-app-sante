<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRegistroPago } from '../../composables/registro-pago/registro-pago';
import { useDatosSession } from '../../composables/session';
import { useHelper } from '../../helpers';

const {
    respuesta, errors, clientes, prestamos, cliente, cuotas, prestamo,
    forma_pagos, detalles, registro_pago, medio_pagos,
    buscarClientesPrestamo, listarPrestamosCliente, listarCuotasPrestamo,
    obtenerListaFormaPagos, limpiarRegistroPago, obtenerListaMedioPagos,
    agregrarRegistroPago
} = useRegistroPago();

const {usuario } = useDatosSession();

const { Toast } = useHelper();

const frase = ref("");

const clienteEncontrado = ref(0);
const prestamoEncontrado = ref(0);
const cuotaEncontrada = ref(0);

const indexPrestamo =ref("");

const busquedaCliente = async() =>{

    clienteEncontrado.value =0;    
    prestamoEncontrado.value = 0;
    cuotaEncontrada.value = 0;
    cliente.value = {};
    prestamos.value = {};
    cuotas.value = [];
    detalles.value = [];

    await buscarClientesPrestamo(frase.value);

    if(clientes.value.length > 0 )
    {
        clienteEncontrado.value= 1;
    }
}

const buscarPrestamos= async(index,id) => {
    prestamos.value = {};
    cliente.value = {};
    cuotas.value = [];
    detalles.value = [];
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

const buscaCuotaRegistro = async(id) => {
    cuotas.value = [];
    detalles.value = [];
    cuotaEncontrada.value = 0;
    forma_pagos.value = [];
    medio_pagos.value = [];
    limpiarRegistroPago();
    registro_pago.value.forma_pago="";
    registro_pago.value.medio_pago="";

    await listarCuotasPrestamo(id);

    await obtenerListaFormaPagos();
    
    registro_pago.value.prestamo_id = prestamo.value.id

    if(cuotas.value)
    {
        cuotaEncontrada.value = 1;
    }
}

const buscarCuotas = async(index,id) => {
    cuotas.value = [];
    prestamo.value ={};
    detalles.value = [];
    cuotaEncontrada.value = 0;
    forma_pagos.value = [];
    medio_pagos.value = [];
    limpiarRegistroPago();
    registro_pago.value.forma_pago="";
    registro_pago.value.medio_pago="";

    await listarCuotasPrestamo(id);

    await obtenerListaFormaPagos();
    
    prestamo.value = prestamos.value.data[index];
    prestamoEncontrado.value = 2;
    registro_pago.value.prestamo_id = prestamo.value.id

    if(cuotas.value)
    {
        prestamos.value = {};
        cuotaEncontrada.value = 1;
    }
}

const listaMedioPagos = async() => {
    medio_pagos.value = [];
    await obtenerListaMedioPagos(registro_pago.value.forma_pago);

    registro_pago.value.medio_pago='';
    registro_pago.value.numero_operacion="";
    registro_pago.value.fecha_deposito = "";
    registro_pago.value.imagen_voucher = "";
}



const agregarDetalle = async(index,id) => {

    let  micuota = cuotas.value[index];
    let cantidad = 1;

    let detalle = {
        id:micuota.id,
        cantidad: 1,
        fecha_vencimiento: micuota.fecha_vencimiento,
        descripcion:micuota.descripcion,
        monto_pagar:micuota.monto_cuota,
        monto_pagado: micuota.monto_cuota,
        saldo:0,
        estado_anterior:micuota.estado
    }

    registro_pago.value.detalles.push(detalle)

    cuotas.value[index].estado = 'Seleccionado';

}

const totalPagar = computed(() => {
    let suma = 0;
    registro_pago.value.detalles.forEach(de => {
        suma += parseFloat(de.monto_pagado)
    });
    return suma
})

const calcularSaldo = (index) => {
    let detalle = registro_pago.value.detalles[index];
    let monto_pagado = parseFloat(detalle.monto_pagado);
    let monto_pagar =   parseFloat(detalle.monto_pagar);

    if(monto_pagado > monto_pagar) {
        $('#error_detalle_'+index).html('El Monto Pagado es mayor que el monto pagar');
    }
    else if(monto_pagar < 0) {
        $('#error_detalle_'+index).html('Monto pagar no debe ser menor a cero');
    }

    else {
        $('#error_detalle_'+index).html('');
        let saldo = monto_pagar - monto_pagado;
    
        registro_pago.value.saldo = saldo;
    }
    
}

const validarImage = () => {
    registro_pago.value.imagen_voucher = $('#imagen_voucher')[0].files[0];
}

const guardar = async() => {

    registro_pago.value.total = totalPagar.value;
    registro_pago.value.user_id = usuario.value.id;

    await agregrarRegistroPago(registro_pago.value);

    if(errors.value)
    {
        registro_pago.value.errors = errors.value
    }

    if(respuesta.value)
    {
        if(respuesta.value.ok==1)
        {
            Toast.fire({icon:'success', title:respuesta.value.mensaje})

            buscaCuotaRegistro(prestamo.value.id)
        }
    }
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
                                    <tr v-else v-for="(cuota,index) in cuotas"
                                        :class="{'table-danger': ['Anulado','Eliminado','Seleccionado'].includes(cuota.estado) }">
                                        <td class="text-center" v-text="index+1"></td>
                                        <td class="text-center" v-text="cuota.fecha_vencimiento"></td>
                                        <td class="text-center" v-text="cuota.descripcion"></td>
                                        <td class="text-center" v-text="cuota.monto_cuota"></td>
                                        <td class="text-center">
                                            <span class="badge badge-warning" v-if="cuota.estado=='Pendiente'">Pendiente</span>
                                            <span class="badge badge-success" v-else-if="cuota.estado=='Pagado'">Pagado</span>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-sm btn-success" @click="agregarDetalle(index,cuota.id)"
                                                v-if="['Pendiente'].includes(cuota.estado)">
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
    <div class="row" v-if="registro_pago.detalles.length>0">
        <div class="col-md-12">
            <div class="card border border-success">
                <div class="card-header py-2 bg-success">
                    <h5 class="card-title">Registro de Pagos</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 mb-2">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Forma Pago</span>
                                </div>
                                <select class="form-control form-control-sm"
                                    v-model="registro_pago.forma_pago" id="forma_pago"
                                    :class="{ 'is-invalid' : registro_pago.errors.forma_pago}"
                                    @change="listaMedioPagos">
                                    <option value="">-Seleccionar-</option>
                                    <option v-for="forma in forma_pagos" :value="forma.id" >{{ forma.nombre }}</option>
                                </select>
                            </div>
                            <small class="text-danger" v-for="error in registro_pago.errors.forma_pago" :key="error">{{error }}</small>
                        </div>
                        <div class="col-md-3 mb-2">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Medio Pago</span>
                                </div>
                                <select class="form-control form-control-sm"
                                    v-model="registro_pago.medio_pago" id="medio_pago"
                                    :class="{ 'is-invalid' : registro_pago.errors.medio_pago}">
                                    <option value="">-Seleccionar-</option>
                                    <option v-for="medio in medio_pagos" :value="medio.id" >{{ medio.nombre }}</option>
                                </select>
                            </div>
                            <small class="text-danger" v-for="error in registro_pago.errors.medio_pago" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="row" v-if="[2,3].includes(registro_pago.forma_pago)">
                        <div class="col-md-3 mb-2">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Número Operación</span>
                                </div>
                                <input type ="text" class="form-control" v-model="registro_pago.numero_operacion" 
                                    :class="{ 'is-invalid' : registro_pago.errors.numero_operacion }"/>                        
                            </div>
                            <small class="text-danger" v-for="error in registro_pago.errors.numero_operacion" :key="error">{{error }}</small>
                        </div>
                        <div class="col-md-3">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Fecha Depósito</span>
                                </div>
                                <input type ="date" class="form-control" v-model="registro_pago.fecha_deposito" 
                                    :class="{ 'is-invalid' : registro_pago.errors.fecha_deposito }"/> 
                            </div>
                            <small class="text-danger" v-for="error in registro_pago.errors.fecha_deposito" :key="error">{{error }}</small>
                        </div>
                        <div class="col-md-6">
                            <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">Voucher</span>
                                </div>
                                <input type="file" class="form-control" id="imagen_voucher"
                                    :class="{ 'is-invalid' : registro_pago.errors.imagen_voucher }" @change="validarImage" /> 
                            </div>
                            <small class="text-danger" v-for="error in registro_pago.errors.imagen_voucher" :key="error">{{error }}</small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 table-responsive mb-2">
                            <table class="table table-sm table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th class="text-center">#</th>
                                        <th class="text-center">Fecha Vencimiento</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Monto Pagar</th>
                                        <th class="text-center">Monto Pagado</th>
                                        <th class="text-center">Saldo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(detal,index) in registro_pago.detalles">
                                        <td class="text-center" v-text="index+1"></td>
                                        <td class="text-center" v-text="detal.fecha_vencimiento"></td>
                                        <td class="text-center" v-text="detal.descripcion"></td>
                                        <td class="text-center" v-text="detal.monto_pagar"></td>
                                        <td class="text-center">
                                            <input type="text" v-model="detal.monto_pagado" @change="calcularSaldo(index)" />
                                            <small class="text-danger" :id="'error_detalle_'+(index)" ></small>
                                        </td>
                                        <td v-text="detal.saldo"></td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-xs" disabled>
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th class="text-right">TOTAL</th>
                                        <th class="font-weight-bold text-center" style="font-size: 1.5rem;">S/ {{ parseFloat(totalPagar).toFixed(2) }}</th>
                                    </tr>
                                </tfoot>
                            </table>
                            <small class="text-danger" v-for="error in registro_pago.errors.detalles" :key="error">{{error }}</small>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <button type="submit" class="btn btn-danger mr-3" @click.prevent="cancelar">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-success" @click.prevent="guardar">
                                <i class="fas fa-save"></i> Guardar
                                <!-- <span v-if="form.estado_crud=='nuevo'"><i class="fas fa-save"></i> Guardar</span> -->
                                <!-- <span v-else-if="form.estado_crud=='editar'"><i class="fas fa-sync-alt"></i> Actualizar</span> -->
                            </button>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>