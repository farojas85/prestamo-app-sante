import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useMenu = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const menu = ref({});
    const menus = ref([]);
    const padres = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        nombre:'',
        slug:'',
        icono:'',
        padre_id:'',
        orden:0,
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.nombre = "";
        form.value.slug = "";
        form.value.icono = "";
        form.value.padre_id ="";
        form.value.orden = 0;
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }


    const offest = ref(2);

    const obtenerMenus = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/menus'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            menus.value = jwtDecode(respond.data).menus;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerMenus();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return menus.value.current_page;
    }

    const pagesNumber = () => {
        if(!menus.value.to){
            return []
        }

        let from = menus.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= menus.value.last_page){ to = menus.value.last_page; }

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

    const obtenerListaPadres = async () => {
        let respond = await prestamoApi.get('/api/menus/parents')

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            padres.value = jwtDecode(respond.data).padres
        }

    }

    const agregarMenu = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/menus',data,configPost);

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

    const obtenerMenu = async(id) => {
        let respond = await prestamoApi.get('/api/menus/'+id,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            menu.value = jwtDecode(respond.data).menu
        }
    }

    const actualizarMenu = async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/menus/'+data.id,data,configPost)
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

    const eliminarMenu = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/menus-eliminar',{id:id},config)
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

    const inhabilitarMenu = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/menus/'+id+'/disable',null,configPost)
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

    const habilitarMenu = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/menus/'+id+'/enable',null,configPost)
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
        errors, respuesta, menu, menus, dato, form, padres,
        listar, obtenerMenus, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarMenu, obtenerMenu, actualizarMenu , eliminarMenu,
        inhabilitarMenu, habilitarMenu, obtenerListaPadres
    }
}