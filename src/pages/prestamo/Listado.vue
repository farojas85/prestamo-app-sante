<script setup>
import { ref, toRefs, onMounted } from 'vue';
import { usePrestamo } from '../../composables/prestamo/prestamos';
import { useDatosSession } from '../../composables/session';
import { useHelper } from '../../helpers';
import PrestamoFrom from './forms/PrestamoForm.vue';
import CuotasForm from './forms/CuotaForm.vue';

const { usuario, roles, puede} = useDatosSession();

const {Swal, Toast} = useHelper();


const cardTitle = ref('Nuevo Préstamo');

const { 
    prestamos, errors, form, dato, respuesta, prestamo,
    listar, buscar, isActived, pagesNumber, cambiarPagina, cambiarPaginacion,
    modificarEstadoPrestamo, eliminarPermanentePrestamo, obtenerPrestamo,
    imprimirContratoPrestamo
} = usePrestamo();

onMounted(() => {
    listar();
})

const cambiarCrud = (crud) => {
    if(crud == 'nuevo') {
        nuevo(crud);
    }
}

const limpiar = () => {
    form.value.id = null;
    form.value.cliente_id='';
    form.value.numero_documento="";
    form.value.nombres='';
    form.value.apellido_paterno='';
    form.value.apellido_materno='';
    form.value.telefono='';
    form.value.direccion='';
    form.value.fecha_prestamo='';
    form.value.user_id='';
    form.value.role='';
    form.value.frecuencia_pago_id='';
    form.value.capital_inicial=0;
    form.value.aplicacion_interes_id='';
    form.value.interes=0;
    form.value.numero_cuotas=1;
    form.value.aplicacion_mora_id='';
    form.value.interes_moratorio=2.5;
    form.value.dias_gracia=0;
    form.value.cuotas = [];
    // form.value.total=0;
    // form.value.valor_cuota=0;
    form.value.estado_crud='';
    form.value.errors = [];
    errors.value = [];
}


const nuevo = (crud) => {
    limpiar();
    form.value.estado_crud = crud
    form.value.user_id = usuario.value.id
    form.value.role = roles.value.slug
    cardTitle.value = 'Nuevo Préstamo'
}

const observarPrestamo = async(id) => {
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "OBSERVACIONES",
        inputPlaceholder: "Ingrese sus observaciones...",
        inputAttributes: {
            "aria-label": "Type your message here"
        },
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        confirmButtonText: "Guardar",
        cancelButtonText: "Cerrar"
    });
    if (text) {     
        let data = new FormData();
        let presta = prestamos.value.data.find(p => p.id === id);
        data.append('id',id);
        data.append('estado','Observado');
        data.append('observaciones',text);
        
        await modificarEstadoPrestamo(data)

        if(respuesta.value.ok==1)
        {
            Toast.fire({
                icon: 'success',
                title: respuesta.value.mensaje
            });
            listar();
        }
    }
}

const acepta = async (id) => {
    let data = new FormData();
    let presta = prestamos.value.data.find(p => p.id === id);
    data.append('id',id);
    data.append('estado','Pendiente');

    await modificarEstadoPrestamo(data);

    if(respuesta.value.ok==1)
    {
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        });
        listar();
    }
}

const rechaza = async(id) => {
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "DESCRIPCIÓN DE RECHAZO",
        inputPlaceholder: "Ingrese los motivos del rechazado de préstamo...",
        inputAttributes: {
            "aria-label": "Type your message here"
        },
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        confirmButtonText: "Guardar",
        cancelButtonText: "Cerrar"
    });
    if (text) {     
        let data = new FormData();
        let presta = prestamos.value.data.find(p => p.id === id);
        data.append('id',id);
        data.append('estado','Rechazado');
        data.append('observaciones',text);
        
        await modificarEstadoPrestamo(data)

        if(respuesta.value.ok==1)
        {
            Toast.fire({
                icon: 'success',
                title: respuesta.value.mensaje
            });
            listar();
        }
    }
}

const aceptarPrestamo = (id) => {
    let presta = prestamos.value.data.find(p => p.id === id)

    Swal.fire({
        text:'De: '+presta.cliente,
        title:'¿Está seguro de aceptar el Préstamo?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Aceptar",
        denyButtonText:'Observar',
        denyButtonColor:'#6610f2',
        showDenyButton: true,
        showCancelButton: true,
        cancelButtonText: "Cerrar",
        cancelButtonColor:'#6e7881'
    }).then((result) => {
        if (result.isConfirmed) {
            acepta(id)
        }   
        else if(result.isDenied) {
           observarPrestamo(id)
        }
    })
}

const rechazarPrestamo = (id) => {
    let presta = prestamos.value.data.find(p => p.id === id);
    Swal.fire({
        text:'De: '+presta.cliente,
        title:'¿Está seguro de rechazar el Préstamo?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Rechazar",
        cancelButtonText: "Cerrar",
        cancelButtonColor:'#6e7881',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            rechaza(id)
        }
    })
}

const anula = async(id) => {

    let data = new FormData();
    let presta = prestamos.value.data.find(p => p.id === id);
    data.append('id',id);
    data.append('estado','Anulado');
    
    await modificarEstadoPrestamo(data)

    if(respuesta.value.ok==1)
    {
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        });
        listar();
    }
}

const anularPrestamo = (id) => {
    let presta = prestamos.value.data.find(p => p.id === id);
    Swal.fire({
        text:'De: '+presta.cliente,
        title:'¿Está seguro de anular el Préstamo?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cerrar",
        cancelButtonColor:'#6e7881',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            anula(id)
        }
    })
}

const elimina = async(id) => {
    await eliminarPermanentePrestamo({id:id})

    if(respuesta.value.ok==1)
    {
        Toast.fire({
            icon: 'success',
            title: respuesta.value.mensaje
        });
        listar();
    }
}

const eliminarPrestamo = (id) => {
    let presta = prestamos.value.data.find(p => p.id === id);
    Swal.fire({
        text:'De: '+presta.cliente,
        title:'¿Está seguro de eliminar el Préstamo?',
        icon:'question',
        confirmButtonColor: "#28a745",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cerrar",
        cancelButtonColor:'#6e7881',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            elimina(id)
        }
    })
}

const editar = async (id) => {
    limpiar();
    await obtenerPrestamo(id);
    form.value.estado_crud = 'editar'
    cardTitle.value = 'Editar Préstamo';
    if(respuesta.value.ok==1)
    {
        form.value.id = prestamo.value.id;
        form.value.cliente_id= prestamo.value.cliente_id;
        form.value.nombres = prestamo.value.nombres;
        form.value.apellido_paterno = prestamo.value.apellido_paterno;
        form.value.apellido_materno = prestamo.value.apellido_materno;
        form.value.numero_documento = prestamo.value.numero_documento;
        form.value.telefono = prestamo.value.telefono;
        form.value.direccion = prestamo.value.direccion;
        form.value.fecha_prestamo= prestamo.value.fecha_prestamo;
        form.value.user_id= prestamo.value.user_id;
        // form.value.role= "";
        form.value.frecuencia_pago_id= prestamo.value.frecuencia_pago_id;
        form.value.capital_inicial= prestamo.value.capital_inicial;
        form.value.aplicacion_interes_id= prestamo.value.aplicacion_interes_id;
        form.value.interes= prestamo.value.interes;
        form.value.numero_cuotas= prestamo.value.numero_cuotas   ;
        form.value.aplicacion_mora_id= prestamo.value.aplicacion_mora_id;
        form.value.interes_moratorio= prestamo.value.interes_moratorio ;
        form.value.dias_gracia= prestamo.value.dias_gracia;
        //form.value.total= prestamo.value.total;
        // form.value.valor_cuota= "";
        form.value.es_activo= (prestamo.value.es_activo== 1) ? true : false ;
        
    }
}

const mostrar = async (id) => {
    limpiar();
    await obtenerPrestamo(id);
    form.value.estado_crud = 'mostrar'
    cardTitle.value = 'Mostrar Préstamo';
    if(respuesta.value.ok==1)
    {
        form.value.id = prestamo.value.id;
        form.value.cliente_id= prestamo.value.cliente_id;
        form.value.nombres = prestamo.value.nombres;
        form.value.apellido_paterno = prestamo.value.apellido_paterno;
        form.value.apellido_materno = prestamo.value.apellido_materno;
        form.value.numero_documento = prestamo.value.numero_documento;
        form.value.telefono = prestamo.value.telefono;
        form.value.direccion = prestamo.value.direccion;
        form.value.fecha_prestamo= prestamo.value.fecha_prestamo;
        form.value.user_id= prestamo.value.user_id;
        // form.value.role= "";
        form.value.frecuencia_pago_id= prestamo.value.frecuencia_pago_id;
        form.value.capital_inicial= prestamo.value.capital_inicial;
        form.value.aplicacion_interes_id= prestamo.value.aplicacion_interes_id;
        form.value.interes= prestamo.value.interes;
        form.value.numero_cuotas= prestamo.value.numero_cuotas   ;
        form.value.aplicacion_mora_id= prestamo.value.aplicacion_mora_id;
        form.value.interes_moratorio= prestamo.value.interes_moratorio ;
        form.value.dias_gracia= prestamo.value.dias_gracia;
        //form.value.total= prestamo.value.total;
        // form.value.valor_cuota= "";
        //form.value.es_activo= (prestamo.value.es_activo== 1) ? true : false ;
        
    }
}

const imprimirContrato = (id) => {
    imprimirContratoPrestamo(id);
}

const verCuotas = async(id) => {
    limpiar();
    await obtenerPrestamo(id);
    form.value.estado_crud = ''
    if(respuesta.value.ok==1)
    {
        form.value.id = prestamo.value.id;
        form.value.cliente_id= prestamo.value.cliente_id;
        form.value.nombres = prestamo.value.nombres;
        form.value.apellido_paterno = prestamo.value.apellido_paterno;
        form.value.apellido_materno = prestamo.value.apellido_materno;
        form.value.numero_documento = prestamo.value.numero_documento;
        form.value.telefono = prestamo.value.telefono;
        form.value.direccion = prestamo.value.direccion;
        form.value.fecha_prestamo= prestamo.value.fecha_prestamo;
        form.value.user_id= prestamo.value.user_id;
        // form.value.role= "";
        form.value.frecuencia_pago_id= prestamo.value.frecuencia_pago_id;
        form.value.capital_inicial= prestamo.value.capital_inicial;
        form.value.aplicacion_interes_id= prestamo.value.aplicacion_interes_id;
        form.value.interes= prestamo.value.interes;
        form.value.numero_cuotas= prestamo.value.numero_cuotas   ;
        form.value.aplicacion_mora_id= prestamo.value.aplicacion_mora_id;
        form.value.interes_moratorio= prestamo.value.interes_moratorio ;
        form.value.dias_gracia= prestamo.value.dias_gracia;
        //form.value.total= prestamo.value.total;
        form.value.cuotas = prestamo.value.cuotas;
        $('#modal-cuota-title').html('PRÉSTAMO - CUOTAS')
        $('#modal-cuota').modal('show')
    }
}


</script>
<template>
    <div class="row" v-if="form.estado_crud==''">
        <div class="col-md-12">
            <div class="card mt-3 card-outline card-primary">
                <div class="card-header">
                    <h5 class="card-title">
                        Listado Préstamos
                        <button type="button" class="btn bg-maroon btn-sm btn-rounded" @click="cambiarCrud('nuevo')" >
                            <i class="fas fa-plus"></i> Nuevo
                        </button>                        
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row mt-2">
                        <div class="col-md-12">
                            <div class="input-group input-group-sm">
                                <div class="input-group-append">
                                    <label class="col-form-label col-form-label-sm">Mostrar&nbsp;</label>
                                    <select class="custom-select custom-select-sm form-control form-control-sm"
                                            @change="cambiarPaginacion">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>&nbsp;
                                <button type="button" class="btn bg-purple btn-sm dropdown-toggle"
                                        data-toggle="dropdown">
                                    Filtros
                                </button>
                                <div class="dropdown-menu ">
                                    <a class="dropdown-item" href="#" @click="todos">Todos</a>
                                    <a class="dropdown-item" href="#" @click="habilitados">Habilitados</a>
                                    <a class="dropdown-item" href="#" @click="eliminados">Eliminados</a>
                                </div>
                                &nbsp;
                                <input type="text" name="table-search" id="table-search"
                                    class="form-control"  placeholder="Buscar..." v-model="dato.buscar"
                                    @change="buscar">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-info">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped table-bordered table-hover text-nowrap">
                                    <thead class="bg-navy">
                                        <tr>
                                            
                                            <th class="text-center">#</th>
                                            <th>Fecha/Hora</th>
                                            <th>Cliente</th>
                                            <!-- <th v-if="$auth.hasRole('administrador') || $auth.hasRole('super-usuario')">Cobrador</th> -->
                                            <th>Capital Inicial</th>
                                            <th>Interes (%)</th>
                                            <th>Monto Final</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="prestamos.total == 0">
                                            <td class="text-center text-danger table-danger" colspan="9">--Datos No registrados--</td>
    
                                        </tr>
                                        <tr v-else v-for="(presta, indice) in prestamos.data">
                                            <td v-text="indice+prestamos.from"></td>
                                            <td v-text="presta.fecha_prestamo"></td>
                                            <td v-text="presta.cliente"></td>
                                            <td v-text="presta.capital_inicial"></td>
                                            <td v-text="presta.interes"></td>
                                            <td v-text="presta.total"></td>
                                            <td class="text-center">
                                                <span class="badge badge-info" v-if="presta.nombre_operacion=='Generado'">Generado</span>
                                                <span class="badge badge-warning" v-else-if="presta.nombre_operacion=='Pendiente'">Pendiente</span>
                                                <span class="badge badge-success" v-else-if="presta.nombre_operacion=='Pagado'">Pagado</span>
                                                <span class="badge badge-secondary" v-else-if="presta.nombre_operacion=='Anulado'">Anulado</span>
                                                <span class="badge badge-danger" v-else-if="presta.nombre_operacion=='Eliminado'">Eliminado</span>
                                                <span class="badge bg-indigo" v-else-if="presta.nombre_operacion=='Observado'">Observado</span>
                                                <span class="badge bg-maroon" v-else-if="presta.nombre_operacion=='Rechazado'">Rechazado</span>

                                            </td>
                                            <td>
                                                <button class="btn btn-success btn-sm mr-1"
                                                    title="Aceptar Pŕestamo"
                                                    @click.prevent="aceptarPrestamo(presta.id)"
                                                    v-if="presta.nombre_operacion=='Generado' && puede('prestamos.aceptar')">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm mr-1"
                                                    title="Editar Préstamo"
                                                    @click.prevent="editar(presta.id)"
                                                    v-if="puede('prestamos.editar')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn bg-purple btn-sm mr-1"
                                                    title="Ver Cuotas"
                                                    @click.prevent="verCuotas(presta.id)"
                                                    v-if="!['Generado','Observado','Rechazado'].includes(presta.nombre_operacion) && puede('prestamos.ver-cuotas')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <!-- <button class="btn btn-info btn-sm mr-1"
                                                    title="Mostrar Préstamo"
                                                    @click.prevent="mostrar(presta.id)"
                                                    v-if="puede('prestamos.mostrar')">
                                                    <i class="fas fa-eye"></i>
                                                </button> -->
                                                <button class="btn bg-orange btn-sm mr-1"
                                                    title="Mostrar Observaciones Préstamo"
                                                    @click.prevent=""
                                                    v-if="['Observado','Rechazado'].includes(presta.nombre_operacion) && puede('prestamos.observaciones')">
                                                    <i class="fas fa-arrows-to-eye"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm mr-1"
                                                    title="Imprimir Contrado"
                                                    v-if="!['Generado','Observado','Rechazado'].includes(presta.nombre_operacion) && puede('prestamos.imprimir-contrato')"
                                                    @click.prevent="imprimirContrato(presta.id)"
                                                    >
                                                    <i class="fas fa-file-lines"></i>
                                                </button>
                                                
                                                <button class="btn btn-success btn-sm mr-1"
                                                    title="Enviar Notificaciones Préstamo"
                                                    @click.prevent=""
                                                    v-if="!['Generado','Observado','Rechazado'].includes(presta.nombre_operacion) && puede('prestamos.enviar-notificaciones')">
                                                    <i class="fab fa-whatsapp"></i>
                                                </button>
                                                <button class="btn bg-indigo btn-sm mr-1"
                                                    title="Rechazar Préstamo"
                                                    v-if="presta.nombre_operacion=='Generado'  && puede('prestamos.rechazar')"
                                                    @click.prevent="rechazarPrestamo(presta.id)"
                                                    >
                                                    <i class="fas fa-ban"></i>
                                                </button>
                                                <button class="btn bg-pink btn-sm mr-1"
                                                    title="Anular Pŕestamo"
                                                    @click.prevent="anularPrestamo(presta.id)"
                                                    v-if="['Generado','Observado','Rechazado'].includes(presta.nombre_operacion) && puede('prestamos.anular')">
                                                    <i class="fas fa-delete-left"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm mr-1"
                                                    title="Eliminar Pŕestamo"
                                                    @click.prevent="eliminarPrestamo(presta.id)"
                                                    v-if="puede('prestamos.eliminar')">
                                                    <i class="fas fa-trash-alt"></i>
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
    <div class="row" v-if="['nuevo','editar','mostrar'].includes(form.estado_crud)">
        <div class="col-md-12">
            <PrestamoFrom :form="form" :cardTitle="cardTitle" @onListar="listar"></PrestamoFrom>
        </div>
    </div>
    <CuotasForm :form="form"></CuotasForm>
</template>