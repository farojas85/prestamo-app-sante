import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useRegistroPago = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const cliente = ref({});
    const clientes = ref([]);
    const prestamos = ref([]);
    const prestamo = ref({})
    const cuotas = ref([]);
    const cuota = ref({});
    const detalles = ref([]);
    const forma_pagos = ref([]);
    const medio_pagos = ref([]);
    
    
    const registro_pago = ref({
        id:'',
        fecha:'',
        prestamo_id:'',
        forma_pago:'',
        medio_pago:'',
        forma_pago_medio_pago_id:'',
        total:'',
        descuento:'',
        user_id:'',
        numero_operacion:'',
        fecha_deposito:'',
        imagen_voucher:'',
        estado_operacion:'',
        detalles:[],
        estado_crud:'',
        errors:[]
    });


    const limpiarRegistroPago = () => {
        registro_pago.value.id="";
        registro_pago.value.fecha="";
        registro_pago.value.prestamo_id="";
        registro_pago.value.forma_pago='';
        registro_pago.value.medio_pago="";
        registro_pago.value.forma_pago_medio_pago_id="";
        registro_pago.value.total=0.00;
        registro_pago.value.descuento=0.00;
        registro_pago.value.user_id="";
        registro_pago.value.numero_operacion="";
        registro_pago.value.fecha_deposito="";
        registro_pago.value.imagen_voucher="";
        registro_pago.value.estado_operacion="";
        registro_pago.value.detalles=[];
        registro_pago.value.estado_crud="";
        registro_pago.value.errors=[]
    }

    const buscarClientesPrestamo = async(data) => {

        let respond = await prestamoApi.get('/api/registro-pagos/buscar-clientes?buscar='+data,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            clientes.value = jwtDecode(respond.data).clientes;
        }
    }

    const seleccionarCliente =async(data) => {
        let respond = await prestamoApi.get('/api/registro-pagos/buscar-clientes?buscar='+data,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            clientes.value = jwtDecode(respond.data).clientes;
        }
    }

    const listarPrestamosCliente = async(id) => {
        let respond = await prestamoApi.get('/api/prestamos/list-by-cliente?cliente_id='+id,config)
        prestamos.value = jwtDecode(respond.data).prestamos
    }

    const listarCuotasPrestamo = async(id) => {
        let respond = await prestamoApi.get('/api/cuotas/list-by-prestamo?prestamo_id='+id,config)
        cuotas.value = jwtDecode(respond.data).cuotas
    }

    const obtenerListaFormaPagos = async() => {
        let respond = await prestamoApi.get('/api/forma-pagos/list',config)
        forma_pagos.value = jwtDecode(respond.data).forma_pagos
    }

    const obtenerListaMedioPagos = async(id) => {
        let respond = await prestamoApi.get('/api/medio-pagos/list-by-forma-pago?forma_pago='+id,config)
        medio_pagos.value = jwtDecode(respond.data).medio_pagos
    }

    return {
        errors, respuesta, clientes, prestamos, cliente, cuotas, prestamo, cuota,
        forma_pagos, detalles, registro_pago, medio_pagos,
        buscarClientesPrestamo, listarPrestamosCliente, listarCuotasPrestamo,
        obtenerListaFormaPagos, limpiarRegistroPago, obtenerListaMedioPagos
    }
}