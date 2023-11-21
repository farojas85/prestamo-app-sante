import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { jsPDF } from 'jspdf';
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getdataParamsPaginationByUser, getConfigHeaderUpload } from "../../helpers";

export const usePrestamo = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configUploadPost = getConfigHeaderUpload();
    const prestamos = ref([]);
    const prestamo = ref({});
    const frecuenciaPagos = ref([]);
    const aplicacionIntereses = ref([]);
    const persona = ref({});

    // const { usuario } = useDatosSession();

    const showPrestamo = ref('habilitados');

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:''
    });

    const form = ref({
        id:null,
        cliente_id:'',
        numero_documento:'',
        nombres:'',
        apellido_paterno:'',
        apellido_materno:'',
        telefono:'',
        direccion:'',
        fecha_prestamo:'',
        user_id:'',
        role:'',
        frecuencia_pago_id:'',
        capital_inicial:0,
        aplicacion_interes_id:'',
        interes:0,
        numero_cuotas:1,
        aplicacion_mora_id:'',
        interes_moratorio:2.5,
        dias_gracia:0,
        total:0,
        valor_cuota:0,
        cuotas:[],
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const offest = ref(2);

    const obtenerPrestamos = async() => {
        let dataParam = getdataParamsPaginationByUser(dato.value);
        let respond = await prestamoApi.get('/api/prestamos'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            prestamos.value = jwtDecode(respond.data).prestamos;
        }
    }

    const obtenerPrestamosTodos = async() => {
        // let dataParam = getdataParamsPaginationByUser(dato.value);
        // let respond = await prestamoApi.get('/api/prestamos/all'+dataParam,config);

        // if(respond.status == 404)
        // {
        //     errors.value = respond.data.error
        // }

        // if(respond.status == 200)
        // {
        //     prestamos.value = jwtDecode(respond.data).prestamos;
        // }
    }

    const obtenerPrestamosEliminados = async() => {
        // let dataParam = getdataParamsPaginationByUser(dato.value);
        // let respond = await prestamoApi.get('/api/prestamos/deletes'+dataParam,config);

        // if(respond.status == 404)
        // {
        //     errors.value = respond.data.error
        // }

        // if(respond.status == 200)
        // {
        //     prestamos.value = jwtDecode(respond.data).prestamos;
        // }
    }



    const listar = async(page=1) => {

        dato.value.page = page

        await obtenerPrestamos();
    }


    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return prestamos.value.current_page;
    }

    const pagesNumber = () => {
        if(!prestamos.value.to){
            return []
        }

        let from = prestamos.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= prestamos.value.last_page){ to = prestamos.value.last_page; }

        let pagesArray = [];
        while(from <= to) {
            pagesArray.push(from)
            from ++
        }

        return pagesArray
    }

    const cambiarPaginacion = () => {
        listar()
    }

    const cambiarPagina = (pagina) =>{
        listar(pagina)
    }

    const obtenerListaFrecuenciaPagos = async () => {
        let respond = await prestamoApi.get('/api/frecuencia-pagos/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            frecuenciaPagos.value = jwtDecode(respond.data).frecuencia_pagos

            let frecuencia = frecuenciaPagos.value[0];
            form.value.frecuencia_pago_id = frecuencia.id;
            form.value.interes = frecuencia.valor_interes;
        }
    }

    const obtenerListaAplicacionInrtereses= async () => {
        let respond = await prestamoApi.get('/api/aplicacion-intereses/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionIntereses.value = jwtDecode(respond.data).aplicacion_intereses
        }
    }

    const buscarClienteExiste = async(data) => {
        try {
            
            let respond = await prestamoApi.get('/api/clientes/exist?numero_documento='+data, config)
           
            persona.value = jwtDecode(respond.data).cliente;
        }
        catch (error) {
            errors.value = [];
            if(error.response.status == 422) {
                errors.value = error.response.data.errors
            }
            if(error.response.status == 404)
            {
                errors.value = respond.data.error
            }
        }
    }

    const agregrarPrestamo = async(data) => {
        errors.value = [];
        respuesta.value = []
        
        
        let respond = await prestamoApi.post('/api/prestamos',data,configPost);

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

    const actualizarPrestamo= async(data) => {
        errors.value = []
        respuesta.value = []

        let responded = await prestamoApi.put('api/prestamos/'+data.id,data,configPost)

        if(responded.status == 422)
        {
            errors.value = responded.data.errors
        }
        
        if(responded.status = 200)
        {
            responded= jwtDecode(responded.data)
            if(responded.ok==1)
            {
                respuesta.value = responded
            }
        }
    }

    const obtenerValorInteres = () => {
        if(form.value.frecuencia_pago_id)
        {
            let frecuencia = frecuenciaPagos.value.find(f => f.id === form.value.frecuencia_pago_id)
            form.value.interes = frecuencia.valor_interes;

        }
    }

    const modificarEstadoPrestamo = async(data) => {
        errors.value = [];
        respuesta.value = []
        
        
        let respond = await prestamoApi.post('/api/prestamos/modify-estado',data,configPost);


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

    const eliminarPermanentePrestamo = async(data) => {
        errors.value = [];
        respuesta.value = []
        
        
        let respond = await prestamoApi.post('/api/prestamos/delete-record',data,configPost);


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

    const obtenerPrestamo = async(id) => {
        let respond = await prestamoApi.get('/api/prestamos/'+id+'/show',config);
        respuesta.value =  jwtDecode(respond.data);
        prestamo.value = jwtDecode(respond.data).data;
    }

    const imprimirContratoPrestamo = async(id) => {
        await obtenerPrestamo(id);

        const doc = new jsPDF({ orientation: "p", unit: "mm", format: "A4" });

        //let persona = prestamo.value.persona;
        let apellidos_nombres = (prestamo.value.apellido_paterno+' '+prestamo.value.apellido_materno+' '+prestamo.value.nombres) ?? "";
        let dni = prestamo.value.numero_documento ?? "";
        let direccion = prestamo.value.direccion ?? "";

        doc.addImage('/img/logos/logo-1.png','PNG',5,5,50,15);
        doc.text('CONTRATO DE PRÉSTAMO',70,30).setFontSize(16).setFont("times","bold");

        doc.setFontSize(11).setFont('times','normal').text("Conste el presente documento que se expide, el Contrato de prestamo, que",30,40)
        doc.setFontSize(11).setFont('times','normal').text("celebran de una parte",30,45)
        doc.setFontSize(11).setFont('times','bold').text("INVERSIONES SANTÉ",64,45)
        doc.setFontSize(11).setFont('times','normal').text(", con RUC",105,45)
        doc.setFontSize(11).setFont('times','bold').text("N° 20441805960",123,45)
        doc.setFontSize(11).setFont('times','normal').text("representado por",151,45)
        doc.setFontSize(11).setFont('times','normal').text("su apoderado",30,50)
        doc.setFontSize(11).setFont('times','bold').text("JORQUIERA DE LOS RIOS MARCO ANTONIO RAUL,",53,50)
        doc.setFontSize(11).setFont('times','normal').text("identificado con",152,50)
        doc.setFontSize(11).setFont('times','bold').text("DNI N° 00010001,",30,55)
        doc.setFontSize(11).setFont('times','normal').text("denominado en adelante,",62,55)
        doc.setFontSize(11).setFont('times','bold').text("EL PRESTAMISTA;",103,55)
        doc.setFontSize(11).setFont('times','normal').text("y de la otra parte don(ña)",138,55)
        doc.setLineDash([1, 0.5], 0).line(30, 61, 127, 61);
        doc.setFontSize(11).setFont('times','bold').text(apellidos_nombres,35,60)
        doc.setFontSize(11).setFont('times','normal').text(",  identificado con D.N.I Nro",129,60)
        doc.setLineDash([1, 0.5], 0).line(30, 66, 50, 66);
        doc.setFontSize(11).setFont('times','bold').text(dni,32,65)
        doc.setFontSize(11).setFont('times','normal').text(", domiciliado en ",52,65)
        doc.setLineDash([1, 0.5], 0).line(78, 66, 177, 66);
        doc.setFontSize(11).setFont('times','bold').text(direccion,80,65)
        doc.setFontSize(11).setFont('times','normal').text("en adelante se le denomirá ",30,70)
        doc.setFontSize(11).setFont('times','bold').text("EL ACREEDOR;",73,70)
        doc.setFontSize(11).setFont('times','normal').text("bajo los términos y condiciones siguientes:",108,70)

        doc.setFontSize(11).setFont('times','bold').text("PRIMERO:",30,80)
        doc.setLineDash([1, 0], 0).line(30, 81, 50, 81);
        doc.setFontSize(11).setFont('times','normal').text("EL PRESTAMISTA hará entrega en concepto de préstamo a EL ACREEDOR, que",52,80)
        // doc.setFontSize(11).setFont('times','normal','bold').text(role,131,80)
        doc.setFontSize(11).setFont('times','normal').text("reconoce ",30,85)
        doc.setFontSize(11).setFont('times','normal').text("y toda otra labor relacionada que le encarge EL PRESTAMISTA, teniendo bajo su responsabilidad",30,90)
        doc.setFontSize(11).setFont('times','normal').text("cada préstamo y pago que lo emita.",30,95)

        doc.setFontSize(11).setFont('times','bold').text("SEGUNDO:",30,105)
        doc.setLineDash([1, 0], 0).line(30, 106, 50, 106);
        doc.setFontSize(11).setFont('times','normal').text("La jornada de trabajo será: de lunes a viernes de mañana 08:00 am a 01:00 pm, ",52,105)
        doc.setFontSize(11).setFont('times','normal').text("tarde de 02:00 pm a 05:00 pm, y los sábados de 08:00 am a 01:00 pm. ",30,110)
        doc.setFontSize(11).setFont('times','normal').text("La jornada laboral será ininterrumpida por un descanso de 60 mintuos destinados a refrigerio",30,115)


        doc.addImage('/img/logos/firma.png','PNG',35,152,60,30);
        doc.setLineDash([1, 0], 0).line(40, 180, 90, 180);
        doc.setFontSize(11).setFont('times','bold').text("EL PRESTAMISTA",50,184)

        doc.setLineDash([1, 0], 0).line(115, 180, 180, 180);
        doc.setFontSize(11).setFont('times','bold').text(apellidos_nombres,118,184)
        doc.setFontSize(11).setFont('times','bold').text("DNI: "+dni,132,188)

        doc.save('CONTRATO_PRESTAMO.pdf');

    }

    const descargarCuotas = (cuota) => {
        
        let apellidos_nombres = (cuota.apellido_paterno+' '+cuota.apellido_materno+' '+cuota.nombres) ?? "";
        const doc = new jsPDF({ orientation: "p", unit: "mm", format: "A4" });
        
        doc.setFontSize(14).setFont("times",'normal')
        doc.text('PRÉSTAMOS - CUOTAS',105,30,'center');

        doc.setFontSize(18).setFont("times",'bold')
        doc.text(apellidos_nombres,105,40,'center')
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.setFillColor(0, 0, 255)
        // doc.rect(15,50,60,20,'D')
        //------------------------------------------------------------
        doc.setTextColor("#007bff")
        doc.setFontSize(12).setFont("times",'bold')
        doc.text('Monto Préstamo',45,58,'center');
        doc.setFontSize(18).setFont("times",'normal')
        doc.text('S/ '+ cuota.capital_inicial,45,65,'center');
        doc.line(75,50,75,70,'D')
        //-------------------------------------------------------------
        doc.setTextColor("#28a745")
        doc.setFontSize(12).setFont("times",'bold')
        doc.text('Tasa de Interés',105,58,'center');
        doc.setFontSize(18).setFont("times",'normal')
        doc.text(cuota.interes+' %',105,65,'center');
        doc.line(135,50,135,70,'D')
        //-------------------------------------------------------------
        doc.setTextColor("#007bff")
        doc.setFontSize(12).setFont("times",'bold')
        doc.text('Número de Cuotas',165,58,'center');
        doc.setFontSize(18).setFont("times",'normal')
        doc.text(cuota.numero_cuotas+' %',165,65,'center');
        //-------------------------------------------------------------

        doc.setFontSize(16).setFont("times",'bold')
        doc.text("CRONOGRAMA DE PAGOS",105,80,'center')

        //------------------------------------------------------------
        //Detalle Cuotas
        //------------------------------------------------------------
        doc.setLineWidth(0.2);
        doc.rect(30,90,20,10,'D')
        doc.rect(50,90,50,10,'D')
        doc.rect(100,90,50,10,'D')
        doc.rect(150,90,30,10,'D')

        doc.setTextColor(0,0,0)
        doc.setFontSize(12).setFont("times",'bold')
        doc.text("Nro.",40,96,'center')
        doc.text("Descripción",75,96,'center')
        doc.text("Vencimiento",125,96,'center')
        doc.text("Monto",165,96,'center')

        let y=100;
        doc.setFontSize(12).setFont("times",'normal')
        cuota.cuotas.forEach( c => {
            doc.rect(30,y,20,10,'D')
            doc.rect(50,y,50,10,'D')
            doc.rect(100,y,50,10,'D')
            doc.rect(150,y,30,10,'D')
            let yt = y+6;
            doc.text(c.numero_cuota.toString(),40,yt,'center')
            doc.text(c.descripcion.toString(),75,yt,'center')
            doc.text(c.fecha_vencimiento.toString(),125,yt,'center')
            doc.text(c.monto_cuota.toString(),165,yt,'center')
            y+=10;
        })

        doc.save('CUOTAS_PRESTAMO.pdf');
    }

    const subirContratoPrestamo = async(data) => {
        errors.value = []
        let responded = await prestamoApi.post('api/prestamos/subir-contrato',data,configUploadPost);

        if(responded.status === 422)
        {
            errors.value = jwtDecode(responded.data).errors
        }

        if(responded.status === 200)
        {
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }
        }
    }

    const verContratoPrestamo = async(prestamo) => {
        if(prestamo)
        {
            let contrato_prestamo = prestamo.contrato_pdf;
            let dni_empleado = prestamo.numero_documento;
            let url = import.meta.env.VITE_APP_API_URL+"/storage/clientes/"+dni_empleado+'/'+contrato_prestamo;
            window.open(url,'_blank')
        }
    }
    
    return {
        errors, respuesta, prestamos, dato, form, frecuenciaPagos, aplicacionIntereses, persona,
        prestamo,
        listar, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, obtenerValorInteres,
        obtenerListaFrecuenciaPagos, obtenerListaAplicacionInrtereses, buscarClienteExiste,
        agregrarPrestamo, modificarEstadoPrestamo, eliminarPermanentePrestamo, obtenerPrestamo,
        actualizarPrestamo, imprimirContratoPrestamo, descargarCuotas, subirContratoPrestamo,
        verContratoPrestamo
    }

}