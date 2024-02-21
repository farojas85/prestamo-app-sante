<script setup>
import { toRefs, onMounted, ref, computed } from 'vue';
import { useHelper } from '../../../../helpers';
import { usePrestamo } from '../../../../composables/prestamo/prestamos';

const props = defineProps({
    prePrestamo: Object
})
const { prePrestamo } = toRefs(props);

const { 
    aplicacionIntereses, frecuenciaPagos,
    obtenerListaAplicacionInrtereses, obtenerListaFrecuenciaPagos
} = usePrestamo();

onMounted(() => {
    obtenerListaAplicacionInrtereses();
    obtenerListaFrecuenciaPagos();
})

const valorInteres = () => {
    if(prePrestamo.value.frecuencia_pago_id!= "")
    {
        let frecuencia = frecuenciaPagos.value.find(f => f.id === prePrestamo.value.frecuencia_pago_id);
        prePrestamo.value.interes = parseFloat(frecuencia.valor_interes).toFixed(2);
    }
}



prePrestamo.value.total = computed(() => {
    if(prePrestamo.value.capital_inicial == 0)
    {
        return 0;
    }

    if(prePrestamo.value.aplicacion_interes_id == 2)
    {
        let interes_capital = prePrestamo.value.interes*prePrestamo.value.numero_cuotas;
        let capital = Math.round((prePrestamo.value.capital_inicial*(1 + interes_capital/100))*100/100).toFixed(2);
        return capital;
    }
    else {
        return (Math.round( (parseFloat(prePrestamo.value.capital_inicial)*( 1 + (parseFloat(prePrestamo.value.interes)/100)))*100 )/100).toFixed(2) ;

    }
});

prePrestamo.value.valor_cuota = computed(() => {
    if(prePrestamo.value.capital_inicial == 0)
    {
        return 0;
    }
    if(prePrestamo.value.numero_cuotas <= 0 )  {
        return Math.round(parseFloat(prePrestamo.value.total)).toFixed(2);
    }
    return (Math.round((parseFloat(prePrestamo.value.total) / parseFloat(prePrestamo.value.numero_cuotas))*100)/100).toFixed(2);
});

const cancelar = () => {
   //limpiar()
   //form.value.estado_crud = ""
}

const guardar = async() => {
    //crud[form.value.estado_crud]()
}

</script>
<template>
     <div class="modal fade" id="modal-nuevo-prestamo">
        <div class="modal-dialog modal-xl " role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-nuevo-prestamo-title">Nuevo Pre-Prestamo</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body" id="datos-descargar">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-primary">
                                    <h4 class="card-title">Datos Cliente</h4>
                                </div>
                                <div class="card-body">
                                    <div class="form-group row">
                                        <label for="numero_documento_pre" class="col-form-label col-form-label-sm col-md-3 mb-1"> Nro. Documento:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="numero_documento_pre"
                                                maxlength="15" :value="prePrestamo.numero_documento"
                                                placeholder="Nro. documento de Identidad"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="nombres_pre" class="col-form-label col-form-label-sm col-md-3 mb-1">Nombres:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="nombres_pre"
                                                maxlength="15" :value="prePrestamo.nombres"
                                                placeholder="Nombres del Cliente"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apellidos_pre" class="col-form-label col-form-label-sm col-md-3 mb-1">Apellidos:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="apellidos_pre"
                                                maxlength="15" :value="prePrestamo.apellido_paterno+' '+prePrestamo.apellido_materno"
                                                placeholder="Apellidos del cliente"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="atelefono_pre" class="col-form-label col-form-label-sm col-md-3 mb-1">Telefono:</label>
                                        <div class="col-md-9 mb-1">
                                            <input type="text" class="form-control form-control-sm" id="atelefono_pre"
                                                maxlength="15" :value="prePrestamo.telefono"
                                                placeholder="Teléfono del Cliente"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="direccion_pre" class="col-form-label col-form-label-sm col-md-12 mb-1">Direccion:</label>
                                        <div class="col-md-12 mb-1">
                                            <textarea class="form-control form-control-sm" id="direccion_pre"
                                                rows="2" style="resize: none;"
                                                :value="prePrestamo.direccion"
                                                placeholder="Direccion del Cliente"
                                                readonly
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-danger">
                                    <h4 class="card-title">Datos Préstamo</h4>
                                </div>
                                <div class="card-body">
                                    <div class="form-group row">                                    
                                        <label for="fecha_prestamo_pre" class="col-form-label col-form-label-sm col-md-3">Fecha</label>
                                        <div class="col-md-6">
                                            <input type="date" class="form-control form-control-sm" v-model="prePrestamo.fecha_prestamo" title="Fecha Préstamo"
                                                id="fecha_prestamo_pre"
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">                                        
                                        <label for="aplicar_interes_a_pre" class="col-form-label col-form-label-sm col-md-3">Aplicar Interés a</label>
                                        <div class="col-md-6">
                                            <select class="form-control form-control-sm" v-model="prePrestamo.aplicacion_interes_id"
                                                id="aplicar_interes_a_pre">
                                                <option value="">-SELECCIONAR-</option>
                                                <option v-for="aplica in aplicacionIntereses" :key="aplica.id" :value="aplica.id"
                                                        v-text="aplica.nombre"></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="frecuencia_pago_id" class="col-form-label col-form-label-sm col-md-3">Frecuencia Pago</label>
                                        <div class="col-md-8">
                                            <select class="form-control form-control-sm" v-model="prePrestamo.frecuencia_pago_id"
                                                :class="{ 'is-invalid': prePrestamo.errors.frecuencia_pago_id }"
                                                @change="valorInteres"
                                            >
                                                <option value="">-SELECCIONAR-</option>
                                                <option v-for="frec in frecuenciaPagos" :key="frec.id" :value="frec.id"
                                                        v-text="frec.nombre"></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="capital_inicial_pre" class="col-form-label col-form-label-sm col-md-3">Capital Inicial</label>
                                        <div class="col-md-8">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.capital_inicial" 
                                                id="capital_inicial_pre" title="Capital Inicial"
                                                :class="{ 'is-invalid': prePrestamo.errors.capital_inicial }" placeholder="0.00" 
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="interes_pre" class="col-form-label col-form-label-sm col-md-3">Inter&eacute;s</label>
                                        <div class="col-md-8">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.interes" 
                                                id="interes_pre" title="Interés"
                                                :class="{ 'is-invalid': prePrestamo.errors.interes }" placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="numero_cuotas_pre" class="col-form-label col-form-label-sm col-md-3">Número cuotas</label>
                                        <div class="col-md-8">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.numero_cuotas" 
                                                id="numero_cuotas_pre" title="Número de Cuotas"
                                                :class="{ 'is-invalid': prePrestamo.errors.numero_cuotas }" placeholder="0.00" 
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="interes_moratorio_pre" class="col-form-label col-form-label-sm col-md-3">Interés Mora</label>
                                        <div class="col-md-8">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.interes_moratorio" 
                                                id="interes_moratorio_pre" title="Interés Moratorio"
                                                :class="{ 'is-invalid': prePrestamo.errors.interes_moratorio }" placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="dias_gracia_pre" class="col-form-label col-form-label-sm col-md-3">Días de gracia</label>
                                        <div class="col-md-9">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.dias_gracia" 
                                                id="dias_gracia_pre" title="Días de gracia"
                                                :class="{ 'is-invalid': prePrestamo.errors.dias_gracia }" placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="total_pre" class="col-form-label col-form-label-sm col-md-3">TOTAL</label>
                                        <div class="col-md-8">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.total" 
                                                id="total_pre" title="Interés Moratorio"
                                                readonly />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label for="valor_cuota_pre" class="col-form-label col-form-label-sm col-md-3">Valor de Cuota</label>
                                        <div class="col-md-9">
                                            <input type="text" class="form-control form-control-sm" v-model="prePrestamo.valor_cuota" 
                                                id="valor_cuota_pre" title="Valor de la Cuota"
                                                readonly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">  
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <button type="submit" class="btn btn-danger mr-3" data-dismiss="modal"
                                @click.prevent="cancelar">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-success" @click.prevent="guardar">
                                <span v-if="prePrestamo.estado_crud=='nuevo'"><i class="fas fa-save"></i> Guardar</span>
                                <span v-else-if="prePrestamo.estado_crud=='editar'"><i class="fas fa-sync-alt"></i> Actualizar</span>
                            </button>
                            <!-- <span v-if="prePrestamo.estado_crud!='mostrar'">
                            </span> -->
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>