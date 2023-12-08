import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";

export const useNotificacion = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configPostUpload = getConfigHeaderUpload();
    const notificacion = ref({});
    const notificaciones = ref([]);
    const roles = ref([]);

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
    });

    const form = ref({
        id:null,
        titulo:'',  
        contenido:'',
        imagen:'',
        fecha_inicio:'',
        fecha_fin:'',
        role_id:'',
        es_activo:true,
        estado_crud:'',
        errors:[]
    });

    const limpiar = () => {
        form.value.id = null;
        form.value.titulo= '';
        form.value.contenido = "";
        form.value.imagen = "";
        form.value.fecha_inicio = "";
        form.value.fecha_fin ="";
        form.value.role_id='';
        form.value.es_activo = true;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerNotificaciones = async() => {
        let dataParam = getdataParamsPagination(dato.value);
        let respond = await prestamoApi.get('/api/notificaciones'+dataParam,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            notificaciones.value = jwtDecode(respond.data).notificaciones;
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

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerNotificaciones();
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return notificaciones.value.current_page;
    }

    const pagesNumber = () => {
        if(!notificaciones.value.to){
            return []
        }

        let from = notificaciones.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= notificaciones.value.last_page){ to = notificaciones.value.last_page; }

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

    const agregarNotificacion = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let datos = new FormData();
            datos.append('titulo',data.titulo);
            datos.append('contenido',data.contenido);
            datos.append('fecha_inicio',data.fecha_inicio);
            datos.append('fecha_fin',data.fecha_fin);
            datos.append('role_id',data.role_id);
            datos.append('imagen',data.imagen);

            let respond = await prestamoApi.post('/api/notificaciones',datos,configPostUpload);

            respond = jwtDecode(respond.data)
            console.log(respond)
            errors.value = []
            if(respond.ok==1)
            {
                respuesta.value = respond
            }

        } catch (error) {
            if(error) {
                console.log(error);
            }
            else if(error.response.status) 
            {
                errors.value = [];
                if(error.response.status === 422)
                {
                    errors.value = error.response.data
                }
            }
        }
    }

    const obtenerNotificacion = async(id) => {
        let respond = await prestamoApi.get('/api/notificaciones/show?id='+id,config);

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            notificacion.value = jwtDecode(respond.data).notificacion
        }
    }

    const actualizarNotificacion = async(data) => {
        errors.value = []
        let datos = new FormData();
        datos.append('id',data.id);
        datos.append('titulo',data.titulo);
        datos.append('contenido',data.contenido);
        datos.append('fecha_inicio',data.fecha_inicio);
        datos.append('fecha_fin',data.fecha_fin);
        datos.append('role_id',data.role_id);
        datos.append('imagen',data.imagen);

        let responded = await prestamoApi.post('api/notificaciones/update',datos,configPostUpload)

        if(responded.status == 422)
        {
            errors.value = responded.data.errors
        }

        if(responded.status == 200)
        {
            responded = jwtDecode(responded.data)
            errors.value =[];
            if(responded.ok==1){
                respuesta.value=responded
            }

        }
    }

    const eliminarNotificacion = async(id) => {
        errors.value = [];
        let responded = await prestamoApi.post('api/notificaciones/destroy',{id:id},configPost)
        
        if(responded.status == 422)
        {
            errors.value = responded.data.errors
        }

        if(responded.status == 200) {
            responded = jwtDecode(responded.data)
            errors.value =[];
            if(responded.ok==1){
                respuesta.value=responded
            }
        }
    }


    return {
        errors, respuesta, form, notificacion, notificaciones, dato, roles,
        limpiar, obtenerNotificaciones, listar, buscar, isActived, pagesNumber,
        cambiarPagina, cambiarPaginacion,
        agregarNotificacion, obtenerNotificacion, actualizarNotificacion, eliminarNotificacion,
        obtenerListaRoles
    }
}