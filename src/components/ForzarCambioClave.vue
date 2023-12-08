<script setup>
import { ref, onMounted } from 'vue';
import { useDatosSession } from '../composables/session';
import { useAutenticacion } from '../composables/autentication'

const { usuario, roles, menus } = useDatosSession();

const {
    respuesta,errors,dato,
    cambiarClaveForzado
} = useAutenticacion();

onMounted(() => {
    dato.value.user_id = usuario.value.id;
})

const modificarClave = async() => {
    await cambiarClaveForzado(dato.value);
}

</script>
<template>
    <div class="row justify-contente-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header bg-info">
                    <h5 class="card-title">Forzar Cambio Clave</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <p class="font-weight-bold">Para salvaguardar la seguridad de su acceso es obligatorio que cambie su contraseña para hacer uso de las funcionalidades de la aplicación web.</p>
                            <p>
                                <ul>
                                    <li>Debe ingresar mínimo 8 caracteres</li>
                                    <li>Debe ingresar al menos una letra mayúscula</li>
                                    <li>Debe ingresar al menos un caracter especial ( * & % $ # - _ @ ()[] )</li>
                                    <li>Debe ingresar caracteres alfanuméricos ( [a-z][0-9] )</li>
                                </ul>
                            </p>
                            <p ><i>Al presionar en modificar, el sistema cerrará su sesión activa, es importante que apunte su nueva contraseña para poder acceder.</i></p>
                        </div>
                    </div>
                    <div class="from-group row">
                        <label for="" class="col-form-label col-md-3 font-weight-bold mb-2">Contraseña</label>
                        <div class="col-md-6 mb-2">
                            <input type="password" class="form-control" v-model="dato.password" 
                                :class="{'is-invalid': errors.password}"/>
                            <small class="text-danger" v-for="error in errors.password">{{ error }}</small>
                        </div>
                    </div>
                    <div class="from-group row">
                        <label for="" class="col-form-label col-md-3 font-weight-bold">Repite Contraseña</label>
                        <div class="col-md-6">
                            <input type="password" class="form-control" v-model="dato.password_confirmation" 
                                :class="{'is-invalid': errors.password_confirmation}"/>
                            <small class="text-danger" v-for="error in errors.password_confirmation">{{ error }}</small>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-center">
                    <button type="button" class="btn btn-success" @click="modificarClave">
                        <i class="fas fa-save fa-fw"></i> Modificar
                     </button>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="modal fade" id="modal-cambio-clave">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-cambio-clave-title">Forzar Cambio Clave</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                </div>
            </div>
        </div>
    </div> -->
</template>