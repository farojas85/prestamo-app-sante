import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const usePermiso = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const permiso = ref({});
    const permisos = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        nombre:'',
        slug:'',
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.nombre = "";
        form.value.slug = "";
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerPermisos = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/permisos'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            permisos.value = jwtDecode(respond.data).permisos;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerPermisos();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return permisos.value.current_page;
    }

    const pagesNumber = () => {
        if(!permisos.value.to){
            return []
        }

        let from = permisos.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= permisos.value.last_page){ to = permisos.value.last_page; }

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

    const agregarPermiso = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/permisos',data,configPost);

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

    const obtenerPermiso = async(id) => {
        let respond = await prestamoApi.get('/api/permisos/'+id,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            permiso.value = jwtDecode(respond.data).permiso
        }
    }

    const actualizarPermiso= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/permisos/'+data.id,data,configPost)
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

    const eliminarPermiso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/permisos-eliminar',{id:id},config)
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

    const inhabilitarPermiso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/permisos/'+id+'/disable',null,configPost)
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

    const habilitarPermiso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/permisos/'+id+'/enable',null,configPost)
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
        errors, respuesta, permiso, permisos, dato, form,
        listar, obtenerPermisos, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarPermiso, obtenerPermiso, actualizarPermiso, eliminarPermiso,
        inhabilitarPermiso, habilitarPermiso
    }
}