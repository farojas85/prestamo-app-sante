import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useAplicacionInteres = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const aplicacionInteres = ref({});
    const aplicacionIntereses = ref([]);

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

    const obtenerAplicacionIntereses = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/aplicacion-intereses'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionIntereses.value = jwtDecode(respond.data).aplicacion_intereses;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerAplicacionIntereses();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return aplicacionIntereses.value.current_page;
    }

    const pagesNumber = () => {
        if(!aplicacionIntereses.value.to){
            return []
        }

        let from = aplicacionIntereses.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= aplicacionIntereses.value.last_page){ to = aplicacionIntereses.value.last_page; }

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

    const agregarAplicacionIntereses = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/aplicacion-intereses',data,configPost);

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

    const obtenerAplicacionInteres = async(id) => {
        let respond = await prestamoApi.get('/api/aplicacion-intereses/'+id+'/show',config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionInteres.value = jwtDecode(respond.data).aplicacion_interes
        }
    }

    const actualizarAplicacionInteres= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-intereses/'+data.id,data,configPost)
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

    const eliminarAplicacionInteres = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/aplicacion-intereses-eliminar',{id:id},config)
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

    const inhabilitarAplicacionInteres = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-intereses/'+id+'/disable',null,configPost)
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

    const habilitarAplicacionInteres = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/aplicacion-intereses/'+id+'/enable',null,configPost)
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
        errors, respuesta, aplicacionInteres, aplicacionIntereses, dato, form,
        listar, obtenerAplicacionIntereses, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarAplicacionIntereses, obtenerAplicacionInteres, actualizarAplicacionInteres, eliminarAplicacionInteres,
        inhabilitarAplicacionInteres, habilitarAplicacionInteres
    }
}