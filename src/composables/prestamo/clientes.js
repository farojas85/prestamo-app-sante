import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useCliente = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const cliente = ref({});
    const clientes = ref([]);
    const tipoDocumentos = ref([]);
    const sexos = ref([]);
    const persona = ref({});
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
 
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
        form.value.es_activo=1;
        form.value.estado_crud='';
        form.value.errors = [];
        errors.value = [];
    }

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

    const buscarDatosDni = async(data) => {
        try {
            
            let respond = await prestamoApi.get('/api/personas/dni?numero_documento='+data.numero_documento+'&tipo_documento_id='+data.tipo_documento_id, config)
           
            persona.value = JSON.parse(jwtDecode(respond.data).personaDni);
        }
        catch (error) {
            errors.value = [];
            // if(error.response.status == 422) {
            //     errors.value = error.response.data.errors
            // }
            // if(error.response.status == 404)
            // {
            //     errors.value = respond.data.error
            // }
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


    
    return {
        errors, respuesta, cliente, clientes, dato, form, tipoDocumentos, sexos, persona,
        departamentos, provincias, distritos,
        listar, obtenerClientes, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar, obtenerListaTipoDocumentos, obtenerListaSexos,
        obteneListaDepartamentos, obteneListaProvincias, obteneListaDistritos,
        buscarDatosDni, agregarCliente
    }

}