<script setup>
import { onMounted, ref } from 'vue';
import {useHelper} from '../../helpers';
import { useConfiguracionEmpresa } from '../../composables/iniciales/configuracion-empresas'

const { Toast } = useHelper();

const {
    errors, respuesta, monedas, configuracionEmpresa,
    obtenerListaMonedas, obtenerConfiguracionEmpresa, guardarConfiguracionEmpresa
} = useConfiguracionEmpresa();

onMounted(() => {
    obtenerListaMonedas()
    obtenerConfiguracionEmpresa();
});

const guardar = async() => {

    await guardarConfiguracionEmpresa(configuracionEmpresa.value)


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
    <div class="tab-pane active" id="empresa">
        <form class="form-horizontal">
            <div class="form-group row">
                <label for="inputName" class="col-sm-2 col-form-label">Nombre Empresa</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputName" 
                        placeholder="Ingrese Nombre de empresa" v-model="configuracionEmpresa.nombre">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputEmail" class="col-sm-2 col-form-label">Teléfono</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputEmail" 
                        placeholder="Ingrese Teléfono" v-model="configuracionEmpresa.telefono">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputName2" class="col-sm-2 col-form-label">Dirección </label>
                <div class="col-sm-10">
                    <textarea class="form-control" id="inputExperience"
                        placeholder="Ingrese Dirección" v-model="configuracionEmpresa.direccion"></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputExperience" class="col-sm-2 col-form-label">Correo Electrónico</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputName2" 
                        placeholder="Ingrese Correo Electrónico" v-model="configuracionEmpresa.correo_corporativo">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputSkills" class="col-sm-2 col-form-label">Moneda</label>
                <div class="col-sm-2">
                    <select class="form-control" v-model="configuracionEmpresa.moneda_id">
                        <option value="">-Seleccionar-</option>
                        <option v-for="mo in monedas" :key="mo.id" :value="mo.id" >{{ mo.nombre }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="button" class="btn btn-success" @click="guardar">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
