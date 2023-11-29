import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost,getConfigHeaderUpload } from "../../helpers";
import axios from "axios";

export const useCliente = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configUploadPost = getConfigHeaderUpload();
    const cliente = ref({});
    const clientes = ref([]);
    const tipoDocumentos = ref([]);
    const sexos = ref([]);
    const persona = ref({});
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
    const entidad_financieras = ref([]);
    const archivos = ref([]);
 
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
        persona_id:'',
        departamento_id:'',
        provincia_id:'',
        distrito_id:'',
        departamentos:[],
        provincias:[],
        distritos:[],
        cuentas_bancarias:[],
        es_activo:1,
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
        form.value.persona_id='';
        form.value.departamento_id='';
        form.value.provincia_id='';
        form.value.distrito_id='';
        form.value.departamentos=[];
        form.value.provincias=[];
        form.value.distritos=[];
        form.value.cuentas_bancarias=[];
        form.value.es_activo=1;
        form.value.estado_crud='';
        form.value.errors = [];
        errors.value = [];
    }

    const cuenta_bancaria = ref({
        id:'',
        cliente_id:'',
        entidad_financiera_id:'',
        banco:'',
        numero_cuenta:''
    })

    const offest = ref(2);

    const obtenerClientes = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/clientes'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            clientes.value = jwtDecode(respond.data).clientes;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerClientes();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return clientes.value.current_page;
    }

    const pagesNumber = () => {
        if(!clientes.value.to){
            return []
        }

        let from = clientes.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= clientes.value.last_page){ to = clientes.value.last_page; }

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

    const obtenerListaEntidadFinancieras = async () => {
        let respond = await prestamoApi.get('/api/entidad-financieras/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            entidad_financieras.value = jwtDecode(respond.data).entidad_financieras
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
            form.value.provincia_id = ""
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
            form.value.distrito_id =""
        }
    }

    const obtenerCliente = async(id) => {

        let respond = await prestamoApi.get('/api/clientes/show?id='+id,config);

        cliente.value = jwtDecode(respond.data).cliente
    }


    const agregarCliente = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/clientes',data,configPost);

            respond = jwtDecode(respond.data)
            errors.value = []
            if(respond.ok==1)
            {
                respuesta.value = respond
                persona.value = respond.data
            }

        } catch (error) {
            errors.value = [];
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const actualizarCliente= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/clientes/'+data.id,data,configPost)
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

    const subirAnversoDni = async(data) => {
        errors.value = []
        let responded = await prestamoApi.post('api/clientes/subir-dni-anverso',data,configUploadPost);

        if(responded.status === 422)
        {
            errors.value = jwtDecode(responded.data.errors);
        }

        if(responded.status === 200)
        {
            errors.value =[]
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }
            
        }
    }
    const subirReversoDni = async(data) => {
        errors.value = [];
        let responded = await prestamoApi.post('api/clientes/subir-dni-reverso',data,configUploadPost);

        if(responded.status === 422)
        {
            errors.value = jwtDecode(responded.data.errors)

        }

        if(responded.status === 200)
        {
            errors.value =[];
            responded = jwtDecode(responded.data)
            if(responded.ok==1){
                respuesta.value=responded
            }
        }
    }

    const verDocumentos = async(id) => {
        let respond = await prestamoApi.get('api/clientes/mostrar-documentos?id='+id,config);
        archivos.value = jwtDecode(respond.data);
    }

    
    return {
        errors, respuesta, cliente, clientes, dato, form, tipoDocumentos, sexos, persona,
        departamentos, provincias, distritos, entidad_financieras, cuenta_bancaria, archivos,
        listar, obtenerClientes, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar, obtenerListaTipoDocumentos, obtenerListaSexos,
        obteneListaDepartamentos, obteneListaProvincias, obteneListaDistritos, obtenerListaEntidadFinancieras,
        buscarDatosDni, agregarCliente, obtenerCliente, actualizarCliente, subirAnversoDni, subirReversoDni,
        verDocumentos
    }

}