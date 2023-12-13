import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";
import { jsPDF } from "jspdf";

export const useRegistroPago = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configPostUpload = getConfigHeaderUpload();
    const cliente = ref({});
    const clientes = ref([]);
    const prestamos = ref([]);
    const prestamo = ref({})
    const cuotas = ref([]);
    const cuota = ref({});
    const detalles = ref([]);
    const forma_pagos = ref([]);
    const medio_pagos = ref([]);
    const registro_pagos = ref([]);
    const vouchers = ref([]);
    
    
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

    const agregrarRegistroPago = async( data ) =>{
        errors.value = [];

        try {
            let datos = new FormData();

            datos.append('prestamo_id',data.prestamo_id)
            datos.append('forma_pago',data.forma_pago);
            datos.append('medio_pago',data.medio_pago);
            datos.append('numero_operacion',data.numero_operacion);
            datos.append('fecha_deposito',data.fecha_deposito);
            datos.append('imagen_voucher',data.imagen_voucher);
            datos.append('total',data.total)
            datos.append('user_id',data.user_id);
            datos.append('detalles',JSON.stringify(data.detalles))

            let respond = await prestamoApi.post('/api/registro-pagos',datos,configPostUpload);

            if(respond.status === 200)
            {
                respond = jwtDecode(respond.data)
                if(respond.ok==1)
                {
                   respuesta.value = respond
                }
            }

        } catch (error) {
    
            errors.value = [];
            if(error.response.status) 
            {
                if(error.response.status === 422)
                {
                    errors.value = error.response.data
                }
            }
        }

    }

    const obtenerHistorialPagos = async(data) =>{
        let datos = "page="+data.pagina+"&paginacion="+data.paginacion+
                    "&user="+data.user+'&role='+data.role;

        let respond = await prestamoApi.get('/api/registro-pagos/all-pagination?'+datos, config)

        registro_pagos.value = jwtDecode(respond.data).registro_pagos
    }

    const obtenerDataRegistroPago = async(id) => {  
        let respond = await prestamoApi.get('/api/registro-pagos/data?id='+id,config)

        let datos =  jwtDecode(respond.data);

        registro_pago.value = datos.registro_pago;
        vouchers.value = datos.vouchers;
    }

    const obtenerDataRegistroPagoDetalle = async(id) => {  
        let respond = await prestamoApi.get('/api/registro-pagos/details?id='+id,config)

        let datos =  jwtDecode(respond.data);

        registro_pago.value = datos.registro_pago;
        vouchers.value = datos.vouchers;
    }

    const aceptarRegistroPago = async(data) =>{
        errors.value = [];
        respuesta.value = []       
        
        let respond = await prestamoApi.post('/api/registro-pagos/aceptar-pago',data,configPost);


        if(respond.status == 422)
        {
            errors.value = respond.data.errors
        }
        
        if(respond.status = 200)
        {
            respond = jwtDecode(respond.data)
            if(respond.ok==1)
            {
                respuesta.value = respond
            }
        }

    }

    const imprimirReciboPago = (pago) => {
        const doc = new jsPDF({ orientation: "p", unit: "mm",  format: [200, 80] });
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.addFont('/fonts/arial-black-normal.ttf','Arial Black','normal')


        doc.addImage('/img/logos/logo-1.png','PNG',10,5,50,15);

        doc.setLineDash([1, 0.8], 0).line(5, 22, 75, 22);

        //RECIBO DE PAGO
        doc.setFontSize(12).setFont("times",'normal')
        doc.text('Recibo de Pago de cuotas',40,26,'center');

        doc.setFontSize(16).setFont("Arial Black",'normal')
        doc.text(''+pago.serie_numero,40,32,'center');

        doc.setFontSize(12).setFont("Arial Black",'normal')
        doc.text(''+pago.fecha,40,37,'center');

        doc.setLineDash([1, 0.8], 0).line(5, 40, 75, 40);
        //--------------------------------------------------------

        //CLIENTE
        doc.setFontSize(9).setFont("times",'normal')
        doc.text('Cliente: ',6,44,'left');
        doc.setFontSize(9).setFont("times",'normal')
        doc.text(pago.cliente.substring(0,33),16,44,'left');

        doc.setFontSize(9).setFont("times",'normal')
        doc.text('Lider: ',6,48,'left');
        doc.setFontSize(9).setFont("times",'normal')
        doc.text(pago.lider.substring(0,33),16,48,'left');

        doc.setLineDash([1, 0.8], 0).line(5, 50, 75, 50 );
        //--------------------------------------------------------

        //DETALLE DE PAGOS
        doc.setFontSize(9).setFont("times",'bold')
        doc.text('Detalle',6,55,'left');
        doc.setFontSize(9).setFont("times",'bold')
        doc.text('Monto',55,55,'left');

        doc.setFontSize(9).setFont("times",'normal')
        doc.text(''+pago.cuota,6,59,'left');

        doc.setFontSize(9).setFont("times",'normal')
        doc.text(''+parseFloat(pago.total).toFixed(2),55,59,'left');
        
        doc.setLineDash([1, 0.8], 0).line(5, 61, 75, 61 );
        //-------------------------------------------------------------
        //TOTAL PAGO
        doc.setFontSize(9).setFont("times",'bold')
        doc.text('TOTAL:',6,65,'left');

        doc.setFontSize(9).setFont("times",'bold')
        doc.text('S/ '+parseFloat(pago.total).toFixed(2),51.5,65,'left');

        doc.setLineDash([1, 0.8], 0).line(5, 67, 75, 67 );

        doc.setFontSize(9).setFont("times",'bold')
        doc.text('Cuota:',55,71,'left');
        doc.setFontSize(9).setFont("times",'normal')
        doc.text(''+pago.numero_cuota+" / "+pago.numero_cuotas,64.5,71,'left');

        doc.save('recibo-pago.pdf');
    }

    return {
        errors, respuesta, clientes, prestamos, cliente, cuotas, prestamo, cuota,
        forma_pagos, detalles, registro_pago, medio_pagos,registro_pagos, vouchers,
        buscarClientesPrestamo, listarPrestamosCliente, listarCuotasPrestamo,
        obtenerListaFormaPagos, limpiarRegistroPago, obtenerListaMedioPagos,
        agregrarRegistroPago,obtenerHistorialPagos, obtenerDataRegistroPago,
        aceptarRegistroPago, imprimirReciboPago, obtenerDataRegistroPagoDetalle
    }
}