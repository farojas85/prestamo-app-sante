import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getdataParamsPaginationByUser } from "../../helpers";

export const usePrestamo = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const prestamos = ref([]);
    const frecuenciaPagos = ref([]);
    const aplicacionIntereses = ref([]);
    const persona = ref({});

    // const { usuario } = useDatosSession();

    const showPrestamo = ref('habilitados');

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:''
    });

    const form = ref({
        id:null,
        cliente_id:'',
        fecha_prestamo:'',
        user_id:'',
        role:'',
        frecuencia_pago_id:'',
        capital_inicial:0,
        aplicacion_interes_id:2,
        interes:0,
        numero_cuotas:1,
        interes_moratorio:2.5,
        dias_gracia:0,
        total:0,
        valor_cuota:0,
        es_activo:1,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.estado_crud='';
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerPrestamos = async() => {
        let dataParam = getdataParamsPaginationByUser(dato.value);
        let respond = await prestamoApi.get('/api/prestamos'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            prestamos.value = jwtDecode(respond.data).prestamos;
        }
    }

    const obtenerPrestamosTodos = async() => {
        // let dataParam = getdataParamsPaginationByUser(dato.value);
        // let respond = await prestamoApi.get('/api/prestamos/all'+dataParam,config);

        // if(respond.status == 404)
        // {
        //     errors.value = respond.data.error
        // }

        // if(respond.status == 200)
        // {
        //     prestamos.value = jwtDecode(respond.data).prestamos;
        // }
    }

    const obtenerPrestamosEliminados = async() => {
        // let dataParam = getdataParamsPaginationByUser(dato.value);
        // let respond = await prestamoApi.get('/api/prestamos/deletes'+dataParam,config);

        // if(respond.status == 404)
        // {
        //     errors.value = respond.data.error
        // }

        // if(respond.status == 200)
        // {
        //     prestamos.value = jwtDecode(respond.data).prestamos;
        // }
    }



    const listar = async(page=1) => {

        dato.value.page = page

        await obtenerPrestamos();
    }


    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return prestamos.value.current_page;
    }

    const pagesNumber = () => {
        if(!prestamos.value.to){
            return []
        }

        let from = prestamos.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= prestamos.value.last_page){ to = prestamos.value.last_page; }

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

    const obtenerListaFrecuenciaPagos = async () => {
        let respond = await prestamoApi.get('/api/frecuencia-pagos/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            frecuenciaPagos.value = jwtDecode(respond.data).frecuencia_pagos

            let frecuencia = frecuenciaPagos.value[0];
            form.value.frecuencia_pago_id = frecuencia.id;
            form.value.interes = frecuencia.valor_interes;
        }
    }

    const obtenerListaAplicacionInrtereses= async () => {
        let respond = await prestamoApi.get('/api/aplicacion-intereses/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            aplicacionIntereses.value = jwtDecode(respond.data).aplicacion_intereses
        }
    }

    const buscarClienteExiste = async(data) => {
        try {
            
            let respond = await prestamoApi.get('/api/clientes/exist?numero_documento='+data, config)
           
            persona.value = jwtDecode(respond.data).cliente;
        }
        catch (error) {
            errors.value = [];
            if(error.response.status == 422) {
                errors.value = error.response.data.errors
            }
            if(error.response.status == 404)
            {
                errors.value = respond.data.error
            }
        }
    }

    const agregrarPrestamo = async(data) => {
        errors.value = [];
        respuesta.value = []
        
        
        let respond = await prestamoApi.post('/api/prestamos',data,configPost);

        if(respond.status == 422)
        {
            errors.value = respond.data.errors
        }
        
        if(respond.status = 200)
        {
            respond = jwtDecode(respond.data)
            if(respond.ok==1)
            {
                respuesta.value = respond

                console.log(respuesta.value)
            }
        }

    }

    const obtenerValorInteres = () => {
        if(form.value.frecuencia_pago_id)
        {
            let frecuencia = frecuenciaPagos.value.find(f => f.id === form.value.frecuencia_pago_id)
            form.value.interes = frecuencia.valor_interes;

        }
    }
    
    return {
        errors, respuesta, prestamos, dato, form, frecuenciaPagos, aplicacionIntereses, persona,
        listar, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion, limpiar,obtenerValorInteres,
        obtenerListaFrecuenciaPagos, obtenerListaAplicacionInrtereses, buscarClienteExiste,
        agregrarPrestamo
    }

}