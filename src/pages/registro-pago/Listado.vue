<script setup>
import { ref } from 'vue';
import { useRegistroPago } from '../../composables/registro-pago/registro-pago';

const {
    respuesta, errors, clientes,
    buscarClientesPrestamo
} = useRegistroPago();

const frase = ref("");

const clienteEncontrado = ref(0);

const busquedaCliente = async() =>{

    clienteEncontrado.value =0;    
    await buscarClientesPrestamo(frase.value);
    if(clientes.value.length > 0 )
    {
        clienteEncontrado.value= 1;
    }
}

const seleccionaCliente= () => {
    
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
        <div class="col-md-10 table-responsive" v-if="clienteEncontrado==0">
            <div class="callout callout-danger">
                <h5 class="text-secondary">Ingrese nombres, apellidos o número de documento del cliente y presine ENTER o TAB</h5>
                <p class="text-indigo">Se mostrará un Listado con los datos que coincidan con la búsqueda</p>
            </div>
        </div>
        <div class="col-md-10 table-responsive" v-if="clienteEncontrado!==0">
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
                            <button type="button" class="btn btn-xs btn-success">
                                <i class="fas fa-check"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>