import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useFrecuenciaPago = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const frecuenciaPago = ref({});
    const frecuenciaPagos = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        nombre:'',
        dias:'',
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.nombre = "";
        form.value.dias = 1;
        form.value.es_activo=1;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerFrecuenciaPagos = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/frecuencia-pagos'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            frecuenciaPagos.value = jwtDecode(respond.data).frecuencia_pagos;
        }
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerFrecuenciaPagos();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return frecuenciaPagos.value.current_page;
    }

    const pagesNumber = () => {
        if(!frecuenciaPagos.value.to){
            return []
        }

        let from = frecuenciaPagos.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= frecuenciaPagos.value.last_page){ to = frecuenciaPagos.value.last_page; }

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

    const agregarFrecuenciaPago = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/frecuencia-pagos',data,configPost);

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

    const obtenerFrecuenciaPago = async(id) => {
        let respond = await prestamoApi.get('/api/frecuencia-pagos/'+id+'/show',config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            frecuenciaPago.value = jwtDecode(respond.data).frecuencia_pago
        }
    }

    const actualizarFrecuenciaPago= async(data) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/frecuencia-pagos/'+data.id,data,configPost)
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

    const eliminarFrecuenciaPago = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.post('api/frecuencia-pagos-eliminar',{id:id},config)
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

    const inhabilitarFrecuenciaPago = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/frecuencia-pagos/'+id+'/disable',null,configPost)
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

    const habilitarFrecuenciaPago = async(id) => {
        errors.value = ''
        try {
            let responded = await prestamoApi.put('api/frecuencia-pagos/'+id+'/enable',null,configPost)
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
        errors, respuesta, frecuenciaPago, frecuenciaPagos, dato, form,
        listar, obtenerFrecuenciaPagos, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,
        agregarFrecuenciaPago, obtenerFrecuenciaPago, actualizarFrecuenciaPago, eliminarFrecuenciaPago,
        inhabilitarFrecuenciaPago, habilitarFrecuenciaPago
    }
}