<script setup>
import { onMounted, ref } from 'vue';
import {useHelper} from '../../helpers';
import { useConfiguracionPrestamo } from '../../composables/iniciales/configuracion-prestamos'

const { Toast } = useHelper();

const {
    tipoConfiguraciones, frecuenciaPagos, aplicacionIntereses, aplicacionMoras, errors,
    respuesta,
    obtenerTipoConfiguraciones, obtenerFrecuenciaPagos, obtenerAplicacionIntereses,
    obtenerAplicacionMoras, guardarConfiguracionPrestamo
} = useConfiguracionPrestamo()

onMounted(() => {
    obtenerTipoConfiguraciones()
    obtenerFrecuenciaPagos()
    obtenerAplicacionIntereses()
    obtenerAplicacionMoras()
})


const guardar = async() => {

    await guardarConfiguracionPrestamo(tipoConfiguraciones.value)


    //if(errors.value) form.value.errors = errors.value;

    if(respuesta.value.ok==1)
    {
        Toast.fire({icon:'success', title:respuesta.value.mensaje})
    }

    if(respuesta.value.ok!=1)
    {
        Toast.fire({icon:'error', title:respuesta.value.mensaje})
    }
}
</script>
<template>
     <div class="tab-pane" id="prestamo">
        <div class="timeline timeline-inverse"  v-for="(tipoConf,indt) in tipoConfiguraciones">
            <div class="time-label">
                <span class="bg-warning" v-text="tipoConf.nombre"></span>
            </div>
            <div v-for="(conf,indc) in tipoConf.configuraciones">
                <i class="far fa-circle-check bg-info"></i>
                <div class="timeline-item">
                    <span class="time">
                    </span>
                    <h3 class="timeline-header"><a href="#">{{ conf.nombre }}</a></h3>
                    <div class="timeline-body">
                        <div class="row">
                            <div :class="{ 'col-md-6' :conf.descripcion}" >
                                <p v-text="conf.descripcion"></p>
                                <p v-text="conf.observacion"></p>
                            </div>
                            <div :class="{ 'col-md-6' :conf.descripcion, 'col-md-12' : !conf.descripcion}">
                                <template v-if="conf.nombre=='Frecuencia de Pago'">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="frec in frecuenciaPagos" :value="frec.id">{{ frec.nombre }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="conf.nombre=='Aplicación de Intereses'">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="apli in aplicacionIntereses" :value="apli.id">{{ apli.nombre }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="conf.nombre=='Día Cobro Semanal'">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado"
                                                :disabled="tipoConf.configuraciones.find(c => c.nombre=='Fijar días para el cobro' && c.configuracion_prestamo.estado == 0)">
                                                <option value="">-Seleccionar-</option>
                                                <option value="1">Lunes</option>
                                                <option value="2">Martes</option>
                                                <option value="3">Miércoles</option>
                                                <option value="4">Jueves</option>
                                                <option value="5">Viernes</option>
                                                <option value="6">Sábado</option>
                                                <option value="7">Domingo</option>
                                            </select>
                                        </div>
                                    </div>
                                </template>
                                <template 
                                    v-else-if="['Día Primera Quincena','Día Segunda Quincena','Día Cobro Mensual'].includes(conf.nombre)">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <input type="number" class="form-control" v-model="conf.configuracion_prestamo.valor" 
                                            :disabled="tipoConf.configuraciones.find(c => c.nombre=='Fijar días para el cobro' && c.configuracion_prestamo.estado == 0)" />
                                        </div>
                                    </div>
                                </template>
                                <template 
                                    v-else-if="[
                                        'Interés por defecto','Interés aplicado al importe de la cuota atrasada','Cantidad de días que pueda estar atrasado',
                                        'Cantidad de días al mes','Cantidad de días para quincenas'
                                    ].includes(conf.nombre)">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <input type="number" class="form-control" v-model="conf.configuracion_prestamo.valor" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="conf.nombre=='Aplicación de Mora'">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="aplim in aplicacionMoras" :value="aplim.id">{{ aplim.nombre }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="conf.nombre=='Días ignorados'">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <!-- <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado">
                                                <option value="">-Seleccionar-</option>
                                                <option v-for="aplim in aplicacionMoras" :value="aplim.id">{{ aplim.nombre }}</option>
                                            </select> -->
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <select class="form-control form-control-sm" v-model="conf.configuracion_prestamo.estado">
                                                <option value="">-Seleccionar-</option>
                                                <option value="1">Activo</option>
                                                <option value="0">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn btn-success" @click="guardar">
                    <i class="fas fa-save"></i> Guardar
                </button>
            </div>
        </div>
    </div>
</template>