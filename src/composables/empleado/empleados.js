import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { jsPDF } from 'jspdf';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";

export const useEmpleado = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configUploadPost = getConfigHeaderUpload();
    const empleado = ref({});
    const empleados = ref([]);
    const tipoDocumentos = ref([]);
    const sexos = ref([]);
    const roles = ref([]);
    const persona = ref({});
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
    const superiores = ref([]);


    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        tipo_documento_id:'',
        numero_documento:'',
        nombres:'',
        apellido_paterno:'',
        apellido_materno:'',
        sexo_id:'',
        telefono:'',
        direccion:'',
        name:'',
        foto:'',
        email:'',
        password:'',
        role_id:'',
        persona_id:'',
        user_id:'',
        es_activo:1,
        departamento_id:"",
        provincia_id:'',
        distrito_id:'',
        superior_id:'',
        departamentos:[],
        provincias:[],
        distritos:[],
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.tipo_documento_id='';
        form.value.numero_documento='';
        form.value.sexo_id='';
        form.value.nombres='';
        form.value.apellido_paterno='';
        form.value.apellido_materno='';
        form.value.telefono='';
        form.value.direccion='';
        form.value.name='';
        form.value.email='';
        form.value.foto='';
        form.value.password='';
        form.value.role_id='';
        form.value.persona_id='';
        form.value.user_id='';
        form.value.es_activo=1;
        form.value.departamento_id="";
        form.value.provincia_id="";
        form.value.distrito_id="";
        form.value.superior_id="";  
        form.value.distritos = [];
        form.value.provincias = [];
        form.value.departamentos = [];
        form.value.estado_crud='';
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerEmpleados = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/empleados'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            empleados.value = jwtDecode(respond.data).empleados;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerEmpleados();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return empleados.value.current_page;
    }

    const pagesNumber = () => {
        if(!empleados.value.to){
            return []
        }

        let from = empleados.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= empleados.value.last_page){ to = empleados.value.last_page; }

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

    const obtenerListaTipoDocumentos = async () => {
        let respond = await prestamoApi.get('/api/tipo-documentos/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            tipoDocumentos.value = jwtDecode(respond.data).tipo_documentos
        }
    }

    const obtenerListaSexos = async () => {
        let respond = await prestamoApi.get('/api/sexos/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            sexos.value = jwtDecode(respond.data).sexos
        }
    }

    const obtenerListaRoles = async () => {
        let respond = await prestamoApi.get('/api/roles/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            roles.value = jwtDecode(respond.data).roles
        }
    }

    const obteneListaDepartamentos = async() => {
        let respond = await prestamoApi.get('/api/departamentos/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            departamentos.value = jwtDecode(respond.data).departamentos
        }
    }

    const obteneListaProvincias = async(data) => {
        let respond = await prestamoApi.get('/api/provincias/por-departamento?departamento_id='+data,config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            provincias.value = jwtDecode(respond.data).provincias
        }
    }

    const obteneListaDistritos = async(data) => {
        let respond = await prestamoApi.get('/api/distritos/por-provincia?provincia_id='+data,config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            distritos.value = jwtDecode(respond.data).distritos
        }
    }

    const obtenerListaSuperioresPorRole = async(data) => {
        let respond = await prestamoApi.get('/api/empleados/superiores-por-role?role='+data,config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            superiores.value = jwtDecode(respond.data).superiores
        }
    }

    const buscarDatosDni = async(data) => {
        let respond = await prestamoApi.get('/api/personas/dni?numero_documento='+data.numero_documento+'&tipo_documento_id='+data.tipo_documento_id, config)
       
        if(respond.status === 422)
        {
            errors.value = respond.data;
        }

        if(respond.status === 200)
        {
            let dato = jwtDecode(respond.data);

            persona.value = dato.personaDni.data;
            if(dato.personaDni.tipo == 2){
                persona.value = JSON.parse(dato.personaDni.data);
            }
        }
    }

    const obtenerEmpleado = async(id) => {

        let respond = await prestamoApi.get('/api/empleados/show?id='+id,config);

        empleado.value = jwtDecode(respond.data).empleado
    }

    const generarUsuario = async() => {

    }

    const agregarEmpleado = async(data) => {
        errors.value = [];
        respuesta.value = [];
        try {
            let respond = await prestamoApi.post('/api/empleados',data,configPost);

            respond = jwtDecode(respond.data)
            errors.value = []
            if(respond.ok==1)
            {
                respuesta.value = respond
            }

        } catch (error) {
            errors.value = [];
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const actualizarEmpleado= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/empleados/update',data,configPost)
            responded = jwtDecode(responded.data)
            errors.value =''
            if(responded.ok==1){
                respuesta.value=responded
            }

        } catch (error) {
            errors.value=""
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const inhabilitarEmpleado = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/empleados/'+id+'/disable',null,configPost)
            errors.value =''
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }

        } catch (error) {
            errors.value=""
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const habilitarEmpleado = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/empleados/'+id+'/enable',null,configPost)
            errors.value =''
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }

        } catch (error) {
            errors.value=""
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const imprimirContratoEmpleado = async( id) => {
        await obtenerEmpleado(id);

        let persona = empleado.value.persona;
        let apellidos_nombres = (persona.apellido_paterno+' '+persona.apellido_materno+' '+persona.nombres) ?? "";
        let dni = persona.numero_documento ?? "";
        let direccion = persona.direccion ?? "";
        let role = (empleado.value.role).nombre ?? "";

        const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
        
        doc.addImage('/img/logos/logo-1.png','PNG',5,5,50,15);
        doc.setFontSize(16).setFont("arial","normal","bold").text('CONTRATO DE TRABAJO',70,30)

        doc.setFontSize(11).setFont('arial','normal','').text("Conste el presente documento que se expide, el Contrato de Trabajo a Plazo Determinado, que",30,40)
        doc.setFontSize(11).setFont('arial','normal','').text("celebran de una parte",30,45)
        doc.setFontSize(11).setFont('arial','normal','bold').text("INVERSIONES SANTÉ",64,45)
        doc.setFontSize(11).setFont('arial','normal','').text(", con RUC",105,45)
        doc.setFontSize(11).setFont('arial','normal','bold').text("N° 20441805960",123,45)
        doc.setFontSize(11).setFont('arial','normal','').text("representado por",151,45)
        doc.setFontSize(11).setFont('arial','normal','').text("su apoderado",30,50)
        doc.setFontSize(11).setFont('arial','normal','bold').text("JORQUIERA DE LOS RIOS MARCO ANTONIO RAUL,",53,50)
        doc.setFontSize(11).setFont('arial','normal','').text("identificado con",152,50)
        doc.setFontSize(11).setFont('arial','normal','bold').text("DNI N° 00010001,",30,55)
        doc.setFontSize(11).setFont('arial','normal','').text("denominado en adelante,",62,55)
        doc.setFontSize(11).setFont('arial','normal','bold').text("EL EMPLEADOR;",103,55)
        doc.setFontSize(11).setFont('arial','normal','').text("y de la otra parte don(ña)",138,55)
        doc.setLineDash([1, 0.5], 0).line(30, 61, 127, 61);
        doc.setFontSize(11).setFont('arial','normal','bold').text(apellidos_nombres,35,60)
        doc.setFontSize(11).setFont('arial','normal','').text(",  identificado con D.N.I Nro",129,60)
        doc.setLineDash([1, 0.5], 0).line(30, 66, 50, 66);
        doc.setFontSize(11).setFont('arial','normal','bold').text(dni,32,65)
        doc.setFontSize(11).setFont('arial','normal','').text(", domiciliado en ",52,65)
        doc.setLineDash([1, 0.5], 0).line(78, 66, 177, 66);
        doc.setFontSize(11).setFont('arial','normal','bold').text(direccion,80,65)
        doc.setFontSize(11).setFont('arial','normal','').text("en adelante se le denomirá ",30,70)
        doc.setFontSize(11).setFont('arial','normal','bold').text("EL TRABAJADOR;",73,70)
        doc.setFontSize(11).setFont('arial','normal','').text("bajo los términos y condiciones siguientes:",108,70)

        doc.setFontSize(11).setFont('arial','normal','bold').text("PRIMERO:",30,80)
        doc.setLineDash([1, 0], 0).line(30, 81, 50, 81);
        doc.setFontSize(11).setFont('arial','normal','').text("El trabajador se compromete a asumir el cargo de",52,80)
        doc.setLineDash([1, 0.5], 0).line(130, 81, 156, 81);
        doc.setFontSize(11).setFont('arial','normal','bold').text(role,131,80)
        doc.setFontSize(11).setFont('arial','normal','').text("de la empresa,",157,80)
        doc.setFontSize(11).setFont('arial','normal','').text("asumiendo las funciones de gestión de clientes, realizar préstamos, emisión y revisión de pagos,",30,85)
        doc.setFontSize(11).setFont('arial','normal','').text("y toda otra labor relacionada que le encarge EL EMPLEADOR, teniendo bajo su responsabilidad",30,90)
        doc.setFontSize(11).setFont('arial','normal','').text("cada préstamo y pago que lo emita.",30,95)

        doc.setFontSize(11).setFont('arial','normal','bold').text("SEGUNDO:",30,105)
        doc.setLineDash([1, 0], 0).line(30, 106, 50, 106);
        doc.setFontSize(11).setFont('arial','normal','').text("La jornada de trabajo será: de lunes a viernes de mañana 08:00 am a 01:00 pm, ",52,105)
        doc.setFontSize(11).setFont('arial','normal','').text("tarde de 02:00 pm a 05:00 pm, y los sábados de 08:00 am a 01:00 pm. ",30,110)
        doc.setFontSize(11).setFont('arial','normal','').text("La jornada laboral será ininterrumpida por un descanso de 60 mintuos destinados a refrigerio",30,115)


        doc.addImage('/img/logos/firma.png','PNG',35,152,60,30);
        doc.setLineDash([1, 0], 0).line(40, 180, 90, 180);
        doc.setFontSize(11).setFont('arial','normal','bold').text("EL EMPLEADOR",50,184)

        doc.setLineDash([1, 0], 0).line(115, 180, 180, 180);
        doc.setFontSize(11).setFont('arial','normal','bold').text(apellidos_nombres,118,184)
        doc.setFontSize(11).setFont('arial','normal','bold').text("DNI: "+dni,132,188)
        
        doc.save('contrato.pdf');

    }

    const subirContratoEmpleado = async(data) => {
        errors.value = []
        try {
            let responded = await prestamoApi.post('api/empleados/subir-contrato',data,configUploadPost);

            errors.value =''
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }
            
        } catch (error) {
            errors.value=""
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const verContratoEmpleado = async(id) => {
        let emple = empleados.value.data.find(e => e.id === id);
        if(emple)
        {
            let contrato_empleado = emple.contrato_pdf;
            let dni_empleado = emple.numero_documento;
            let url = import.meta.env.VITE_APP_API_URL+"/storage/empleados/"+dni_empleado+'/'+contrato_empleado;
            window.open(url,'_blank')
        }
    }
    
    return {
        errors, respuesta, empleado, empleados, dato, form, tipoDocumentos, sexos,roles, persona,
        departamentos, provincias, distritos, superiores,
        listar, obtenerEmpleados, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar, obtenerListaTipoDocumentos, obtenerListaSexos,
        obteneListaDepartamentos, obteneListaProvincias, obteneListaDistritos, obtenerListaSuperioresPorRole,
        obtenerEmpleado,obtenerListaRoles, buscarDatosDni, agregarEmpleado, actualizarEmpleado,
        habilitarEmpleado, inhabilitarEmpleado, imprimirContratoEmpleado,subirContratoEmpleado,
        verContratoEmpleado
    }

}