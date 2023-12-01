<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { usePrestamo } from '../../../composables/prestamo/prestamos'
import { useHelper } from '../../../helpers';

const { Toast,Swal } = useHelper();

const props = defineProps({
    desembolso: Object,
    cliente_cuentas:Array
});

const {
    respuesta, errors,
    agregarDesembolso 
} = usePrestamo();

const { desembolso } = toRefs(props);

const emit = defineEmits(['onListar']);

onMounted(() => { 

});

const fileValidation = (e)=> {
    desembolso.value.imagen_voucher = e.target.files[0]
    var fileInput = document.getElementById('imagen_voucher_desembolso');
    var filePath = fileInput.value;
    var allowedExtensions = /(.jpg|.jpeg|.png|.webp)$/i;
    if(!allowedExtensions.exec(filePath)){
        desembolso.errors.imagen_voucher = [ 'Tipo archivo no permitido ( Adjunte sólo .jpeg/.jpg/.png/.webp)' ];
        //this.errores.file =
        document.getElementById('imagePreview').innerHTML = "";
        fileInput.value = '';
        return false;
    }else{
        delete desembolso.value.errors.imagen_voucher
        //Image preview
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'" class="img-fluid" height="200"/>';
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}

const crud = {
    'nuevo': async() => {

        desembolso.value.errors = [];

        await agregarDesembolso(desembolso.value);


        if(errors.value){
            desembolso.value.errors = errors.value;
        } 
        if(respuesta.value.ok==1)
        {
            desembolso.value.errors = [];
            Toast.fire({icon:'success', title:respuesta.value.mensaje})
            desembolso.value.estado_crud =''
            emit('onListar')
        }
        if(respuesta.value.ok!=1)
        {
            Swal.fire({
                text:respuesta.value.mensaje,
                title:'Desembolsos',
                icon:'error',
            });
        }
    },
    'editar': async() => {
        // form.value.errors = [];
        // await actualizarPrestamo(form.value);

        // if(errors.value) form.value.errors = errors.value;

        // if(respuesta.value.ok==1)
        // {
        //     form.value.errors = [];
        //     Toast.fire({icon:'success', title:respuesta.value.mensaje})
        //     form.value.estado_crud =''
        //     emit('onListar')
        // }
    },
}

const guardar = async() => {
    crud[desembolso.value.estado_crud]()
}

const cerrarModal = () => {
    document.getElementById('imagePreview').innerHTML="";
    document.getElementById('imagen_voucher_desembolso').value ="";
    desembolso.value.imagen_voucher = "";
}
</script>
<template>
    <div class="modal fade" id="modal-desembolsar">
        <div class="modal-dialog modal-lg " role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <h6 class="modal-title" id="modal-desembolsar-title">Pr&eacute;stamo - Desembolso</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body" >
                    <div class="row">
                        <div class="col-md-7">
                            <div class="form-group row">
                                <label for="cliente_cuenta" class="col-form-label col-form-label-sm col-md-3 mb-1">Cuente Cliente:</label>
                                <div class="col-md-9 mb-1">
                                    <select class="form-control form-control-sm"
                                        v-model="desembolso.cliente_cuenta_id" id="cliente_cuenta"
                                        :class="{ 'is-invalid' : desembolso.errors.cliente_cuenta_id}">
                                        <option value="">-Seleccionar-</option>
                                        <option v-for="cuenta in cliente_cuentas" :value="cuenta.id">{{ cuenta.banco+' - '+cuenta.numero_cuenta }}</option>
                                    </select>
                                    <small class="text-danger" v-for="error in desembolso.errors.cliente_cuenta_id" :key="error">{{error }}</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="fecha_desembolso" class="col-form-label col-form-label-sm col-md-3">Fecha Desembolso</label>
                                <div class="col-md-9">
                                    <input type="date" class="form-control form-control-sm" v-model="desembolso.fecha_desembolso" title="Fecha Desembolso"
                                        :class="{ 'is-invalid': desembolso.errors.fecha_desembolso }"
                                        id="fecha_desembolso"
                                    />
                                    <small class="text-danger" v-for="error in desembolso.errors.fecha_desembolso" :key="error">{{error }}</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="numero_operacion" class="col-form-label col-form-label-sm col-md-3">Nro. Operación</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" v-model="desembolso.numero_operacion" 
                                        title="Número Operación" placeholder="Ingrese número operación"
                                        :class="{ 'is-invalid': desembolso.errors.numero_operacion }"
                                        id="numero_operacion"
                                    />
                                    <small class="text-danger" v-for="error in desembolso.errors.numero_operacion" :key="error">{{error }}</small>
                                </div>
                            </div>
                            <!-- <div class="form-group row">
                                <label for="fecha_deposito" class="col-form-label col-form-label-sm col-md-3">Fecha Depósito</label>
                                <div class="col-md-9">
                                    <input type="date" class="form-control form-control-sm" v-model="desembolso.fecha_deposito" title="Fecha Desembolso"
                                        :class="{ 'is-invalid': desembolso.errors.fecha_deposito }"
                                        id="fecha_deposito"
                                    />
                                    <small class="text-danger" v-for="error in desembolso.errors.fecha_deposito" :key="error">{{error }}</small>
                                </div>
                            </div> -->
                        </div>
                        <div class="col-md-5">
                            <div class="form-group row">
                                <div class="col-md-12">
                                    <input type="file" class="form-control form-control-sm" title="Imagen del Voucher"
                                        :class="{ 'is-invalid': desembolso.errors.imagen_voucher }"
                                        id="imagen_voucher_desembolso"
                                        @change="fileValidation"
                                    />
                                    <small class="text-danger" v-for="error in desembolso.errors.imagen_voucher" :key="error">{{error }}</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-md-12">
                                    <div id="imagePreview" class=""></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal" @click="cerrarModal">
                        <i class="fas fa-times fa-fw"></i>Cerrar
                    </button>
                    <button type="submit" class="btn btn-success" @click.prevent="guardar">
                        <i class="fas fa-save fa-fw"></i>
                        {{ desembolso.estado_crud == 'nuevo'? 'Guardar' : 'Modificar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>