import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useAplicacionMora = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const aplicacionMora = ref({});
    const aplicacionMoras = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        nombre:'',
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.nombre = "";
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerAplicacionMoras = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/aplicacion-moras'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionMoras.value = { jwtDecode }(respond.data).aplicacion_moras;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerAplicacionMoras();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return aplicacionMoras.value.current_page;
    }

    const pagesNumber = () => {
        if(!aplicacionMoras.value.to){
            return []
        }

        let from = aplicacionMoras.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= aplicacionMoras.value.last_page){ to = aplicacionMoras.value.last_page; }

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

    const agregarAplicacionMora = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/aplicacion-moras',data,configPost);

            respond = { jwtDecode }(respond.data)
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

    const obtenerAplicacionMora = async(id) => {
        let respond = await prestamoApi.get('/api/aplicacion-moras/'+id+'/show',config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionMora.value = { jwtDecode }(respond.data).aplicacion_mora
        }
    }

    const actualizarAplicacionMora= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-moras/'+data.id,data,configPost)
            responded = { jwtDecode }(responded.data)
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

    const eliminarAplicacionMora = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/aplicacion-moras-eliminar',{id:id},config)
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

    const inhabilitarAplicacionMora = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-moras/'+id+'/disable',null,configPost)
            errors.value =''
            responded = { jwtDecode }(responded.data)
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

    const habilitarAplicacionMora = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-moras/'+id+'/enable',null,configPost)
            errors.value =''
            responded = { jwtDecode }(responded.data)
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
        errors, respuesta, aplicacionMora, aplicacionMoras, dato, form,
        listar, obtenerAplicacionMoras, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarAplicacionMora, obtenerAplicacionMora, actualizarAplicacionMora, eliminarAplicacionMora,
        inhabilitarAplicacionMora, habilitarAplicacionMora
    }
}