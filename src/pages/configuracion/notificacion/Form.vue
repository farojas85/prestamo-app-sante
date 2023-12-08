<script setup>
import { onMounted, toRefs } from 'vue';
import {useHelper} from '../../../helpers';
import { useNotificacion } from '../../../composables/configuracion/notificaciones';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['onListar']);

const { Toast } = useHelper();

const { form } = toRefs(props);

const {
    errors, respuesta,roles,
    agregarNotificacion, actualizarNotificacion, obtenerListaRoles
} = useNotificacion();

onMounted(() => {
    obtenerListaRoles();
})

const cargarImagen = async() => {
    var fileInput = document.getElementById('imagen_notificacion');

    if (fileInput.files && fileInput.files[0].name) 
    {
        form.value.imagen = fileInput.files[0]
        var filePath = fileInput.value;
        var allowedExtensions = /(.jpg|.jpeg|.png|.webp)$/i;
    
        if(!allowedExtensions.exec(filePath)){
            form.errors.imagen = [ 'Tipo archivo no permitido ( Adjunte sólo .jpeg/.jpg/.png/.webp)' ];
            //this.errores.file =
            document.getElementById('imagePreview').innerHTML = "";
            fileInput.value = '';
            return false;
        }else{
            delete form.value.errors.imagen;
            fileInput.src = URL.createObjectURL(fileInput.files[0]);
            document.getElementById('image-preview').innerHTML = '<img src="'+fileInput.src+'" class="img-fluid" height="200"/>';
            if(form.value.estado_crud == 'editar')
            {
                document.getElementById('image-preview-edit').innerHTML ="";
            }
        }

    }
}

const onClose = () => {
    document.getElementById('image-preview').innerHTML = "";
    document.getElementById('image-preview-edit').innerHTML ="";
}

const crud = {
    'nuevo': async() => {
        form.value.errors = [];
        await agregarNotificacion(form.value);

        if(errors.value){
            form.value.errors = errors.value;
        }

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-notificacion').modal('hide')
            emit('onListar')
        }
    },
    'editar': async() => {
        form.value.errors = [];
        await actualizarNotificacion(form.value);

        if(errors.value) {
            form.value.errors = errors.value
        };

        if(respuesta.value.ok==1)
        {
            form.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            $('#modal-notificacion').modal('hide')
            emit('onListar')
        }
    },
}

const guardar = () => {
    crud[form.value.estado_crud]()
}
</script>
<template>
    <form @submit.prevent="guardar">
        <div class="modal fade" id="modal-notificacion">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content modal-content-demo">
                    <div class="modal-header">
                        <h6 class="modal-title" id="modal-notificacion-title">Nueva Notificación</h6>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click="onClose">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group row">
                                    <label for="titulo" class="col-form-label col-form-label-sm col-md-3 mb-1">T&iacute;tulo:</label>
                                    <div class="col-md-9 mb-1">
                                        <input type="text" class="form-control form-control-sm" name="titulo"
                                            v-model="form.titulo" 
                                            :class="{ 'is-invalid' : form.errors.titulo}" placeholder="Título de Notificación"
                                            />
                                        <small class="text-danger" v-for="error in form.errors.titulo" :key="error">{{error }}</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="contenido" class="col-form-label col-form-label-sm col-md-3 mb-1">Contenido:</label>
                                    <div class="col-md-9 mb-1">
                                        <textarea class="form-control form-control-sm" name="contenido" maxlength="3"
                                            rows="3" v-model="form.contenido" 
                                            :class="{ 'is-invalid' : form.errors.contenido}" placeholder="Contenido o Detalle de Notificación"
                                        ></textarea>
                                        <small class="text-danger" v-for="error in form.errors.contenido" :key="error">{{error }}</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="fecha_inicio" class="col-form-label col-form-label-sm col-md-3 mb-1">Fecha Inicio:</label>
                                    <div class="col-md-9 mb-1">
                                        <input type="date" class="form-control form-control-sm" name="fecha_inicio" maxlength="3"
                                            v-model="form.fecha_inicio" 
                                            :class="{ 'is-invalid' : form.errors.fecha_inicio}" placeholder="Título de Notificación"
                                            />
                                        <small class="text-danger" v-for="error in form.errors.fecha_inicio" :key="error">{{error }}</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="fecha_fin" class="col-form-label col-form-label-sm col-md-3 mb-1">Fecha fin:</label>
                                    <div class="col-md-9 mb-1">
                                        <input type="date" class="form-control form-control-sm" name="fecha_fin" maxlength="3"
                                            v-model="form.fecha_fin" 
                                            :class="{ 'is-invalid' : form.errors.fecha_fin}" placeholder="Título de Notificación"
                                            />
                                        <small class="text-danger" v-for="error in form.errors.fecha_fin" :key="error">{{error }}</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="role_id" class="col-form-label col-form-label-sm col-md-3 mb-1">Rol:</label>
                                    <div class="col-md-9 mb-1">
                                        <select class="form-control form-control-sm" name="role_id"
                                            v-model="form.role_id" 
                                            :class="{ 'is-invalid' : form.errors.role_id}" placeholder="Rol"
                                        >
                                            <option value="">-Seleccionar-</option>
                                            <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.nombre }}</option>
                                        </select>
                                        <small class="text-danger" v-for="error in form.errors.role_id" :key="error">{{error }}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group row">
                                    <label for="imagen" class="col-form-l        // try {

// } catch (error) {
// }abel col-form-label-sm col-md-12 mb-1">Imagen:</label>
                                    <div class="col-md-12 mb-1">
                                        <input type="file" class="form-control form-control-sm" id="imagen_notificacion" name="imagen"
                                            :class="{ 'is-invalid' : form.errors.imagen}" placeholder="Título de Notificación"
                                            @change="cargarImagen"
                                            />
                                        <small class="text-danger" v-for="error in form.errors.imagen" :key="error">{{error }}</small>
                                    </div>
                                    <div class="col-md-12">
                                        <div id="image-preview"></div>
                                        <div id="image-preview-edit"
                                            v-if="form.estado_crud=='editar'">
                                            <img :src="form.imagen" class="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal"
                        @click="onClose">
                        <i class="fas fa-times fa-fw"></i>Cerrar
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save fa-fw"></i>
                        {{ form.estado_crud == 'nuevo'? 'Guardar' : 'Modificar' }}
                    </button>
                </div>
                </div>
            </div>
        </div>
    </form>
</template>