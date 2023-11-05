import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useEmpleado = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const empleado = ref({});
    const empleados = ref([]);
    const tipoDocumentos = ref([]);
    const sexos = ref([]);
    const roles = ref([]);
    const persona = ref({});

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

    const buscarDatosDni = async(data) => {
        try {
            
            let respond = await prestamoApi.get('/api/personas/dni/'+data.numero_documento+'/?tipo_documento_id='+data.tipo_documento_id, config)
            if(respond.status == 200)
            {
                //persona.value = jwtDecode(respond.data).personaDni;
                persona.value = respond.data.personaDni;
            }
        } catch (error) {
            errors.value = [];
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
            if(error.response.status == 404)
            {
                errors.value = respond.data.error
            }
        }


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

    
    return {
        errors, respuesta, empleado, empleados, dato, form, tipoDocumentos, sexos,roles, persona,
        listar, obtenerEmpleados, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar, obtenerListaTipoDocumentos, obtenerListaSexos,
        obtenerListaRoles, buscarDatosDni, agregarEmpleado
    }

}