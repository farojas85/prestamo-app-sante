import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useTipoAcceso = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const tipoAcceso = ref({});
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

    const obtenerTipoAccesos = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/tipo-accesos'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            tipoAccesos.value = jwtDecode(respond.data).tipo_accesos;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerTipoAccesos();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return tipoAccesos.value.current_page;
    }

    const pagesNumber = () => {
        if(!tipoAccesos.value.to){
            return []
        }

        let from = tipoAccesos.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= tipoAccesos.value.last_page){ to = tipoAccesos.value.last_page; }

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

    const agregarTipoAcceso = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/tipo-accesos',data,configPost);

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

    const obtenerTipoAcceso = async(id) => {
        let respond = await prestamoApi.get('/api/tipo-accesos/'+id,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            tipoAcceso.value = jwtDecode(respond.data).tipo_acceso
        }
    }

    const actualizarTipoAcceso= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/tipo-accesos/'+data.id,data,configPost)
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

    const eliminarTipoAcceso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/tipo-accesos-eliminar',{id:id},config)
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

    const inhabilitarTipoAcceso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/tipo-accesos/'+id+'/disable',null,configPost)
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

    const habilitarTipoAcceso = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/tipo-accesos/'+id+'/enable',null,configPost)
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
        errors, respuesta, tipoAcceso, tipoAccesos, dato, form,
        listar, obtenerTipoAccesos, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarTipoAcceso, obtenerTipoAcceso, actualizarTipoAcceso, eliminarTipoAcceso,
        inhabilitarTipoAcceso, habilitarTipoAcceso
    }
}