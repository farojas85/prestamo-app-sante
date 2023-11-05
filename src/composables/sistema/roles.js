import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useRole = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const role = ref({});
    const roles = ref([]);
    const tipoAccesos = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        nombre:'',
        slug:'',
        tipo_acceso_id:'',
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.nombre = "";
        form.value.slug = "";
        form.value.tipo_acceso_id = "";
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerRoles = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/roles'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            roles.value = jwtDecode(respond.data).roles;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerRoles();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return roles.value.current_page;
    }

    const pagesNumber = () => {
        if(!roles.value.to){
            return []
        }

        let from = roles.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= roles.value.last_page){ to = roles.value.last_page; }

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

    const obtenerListaTipoAccesos = async () => {
        let respond = await prestamoApi.get('/api/tipo-accesos/list')

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            tipoAccesos.value = jwtDecode(respond.data).tipo_accesos
        }

    }
    const agregarRole = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/roles',data,configPost);

            respond = jwtDecode(respond.data)
            console.log(respond)
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

    const obtenerRole = async(id) => {
        let respond = await prestamoApi.get('/api/roles/'+id+'/show',config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            role.value = jwtDecode(respond.data).role
        }
    }

    const actualizarRole= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/roles/'+data.id,data,configPost)
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

    const eliminarRole = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/roles-eliminar',{id:id},config)
            errors.value =''
            if(responded.data.ok==1){
                respuesta.value=responded.data
            }

        } catch (error) {
            errors.value=""
            if(error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        }
    }

    const inhabilitarRole = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/roles/'+id+'/disable',null,configPost)
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

    const habilitarRole = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/roles/'+id+'/enable',null,configPost)
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


    return {
        errors, respuesta, role, roles, dato, form, tipoAccesos,
        listar, obtenerRoles, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarRole, obtenerRole, actualizarRole, eliminarRole,
        inhabilitarRole, habilitarRole, obtenerListaTipoAccesos
    }
}