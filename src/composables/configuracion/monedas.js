import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useMoneda = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const moneda = ref({});
    const monedas = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        codigo:'',  
        nombre:'',
        pais:'',
        simbolo:'',
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.codigo = '';
        form.value.nombre = "";
        form.value.pais = "";
        form.value.simbolo = "";
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerMonedas = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/monedas'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            monedas.value = jwtDecode(respond.data).monedas;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerMonedas();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return monedas.value.current_page;
    }

    const pagesNumber = () => {
        if(!monedas.value.to){
            return []
        }

        let from = monedas.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= monedas.value.last_page){ to = monedas.value.last_page; }

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

    const agregarMoneda = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/monedas',data,configPost);

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

    const obtenerMoneda = async(id) => {
        let respond = await prestamoApi.get('/api/monedas/'+id+'/show',config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            moneda.value = jwtDecode(respond.data).moneda
        }
    }

    const actualizarMoneda = async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/monedas/'+data.id,data,configPost)
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

    const eliminarMoneda = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/monedas-eliminar',{id:id},config)
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

    const inhabilitarMoneda = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/monedas/'+id+'/disable',null,configPost)
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

    const habilitarMoneda = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/monedas/'+id+'/enable',null,configPost)
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
        errors, respuesta, moneda, monedas, dato, form,
        listar, obtenerMonedas, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarMoneda, obtenerMoneda, actualizarMoneda , eliminarMoneda,
        inhabilitarMoneda, habilitarMoneda
    }
}