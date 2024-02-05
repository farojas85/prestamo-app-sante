import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";
import { useDatosSession } from '../../composables/session';

export const useHistorialInversion = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configPostUpload = getConfigHeaderUpload();
    const inversiones = ref([]);    
    const tasa_interes = ref(0);

    const {
        usuario, roles
    } = useDatosSession();
    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
        user:'',
        role:''
    });

    const form = ref({
        id:null,
        monto:'',
        tasa_interes:'',
        user_id:"",
        role:"",
        estado_crud:'',
        errors:[]
    });


    const limpiar = () => {
        form.value.id = null;
        form.value.monto = "";
        form.value.tasa_interes = "";
        form.value.user_id=usuario.value.id;
        form.value.role =roles.value.slug;
        form.value.estado_crud ="";
        form.value.errors = [];
        errors.value = [];
    }

    const offest = ref(2);

    const obtenerHistorialInversiones = async(data) =>{
        let datos = "page="+data.page+"&paginacion="+data.paginacion+
                    "&user="+data.user+'&role='+data.role;

        let respond = await prestamoApi.get('/api/registro-inversiones?'+datos, config)

        inversiones.value = jwtDecode(respond.data).registro_inversiones
        console.log(inversiones.value)
    }

    const listar = async(page=1) => {
        dato.value.page = page
        await obtenerHistorialInversiones(dato.value);
    }

    const buscar = async() => {
        await listar();
    }

    const isActived = () => {
        return inversiones.value.current_page;
    }

    const pagesNumber = () => {
        if(!inversiones.value.to){
            return []
        }

        let from = inversiones.value.current_page - offest.value;

        if(from < 1){ from = 1; }

        let to = from + ( offest.value*2 );

        if( to >= inversiones.value.last_page){ to = inversiones.value.last_page; }

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

    const obtenerTasaInteresInversion = async(id) => {  
        let respond = await prestamoApi.get('/api/configuracion-prestamos/by-tipo-configuracion?tipo_configuracion='+id,config)

        let datos =  jwtDecode(respond.data).configuracion_prestamo;

        tasa_interes.value = datos;
    }

    const agregrarRegistroInversion = async( data ) =>{
        errors.value = [];

        try {
            
            let respond = await prestamoApi.post('/api/registro-inversiones',data,configPost);

            if(respond.status === 200)
            {
                respond = jwtDecode(respond.data)
                if(respond.ok==1)
                {
                   respuesta.value = respond
                }
            } 
        } catch (error) {
    
            errors.value = [];
            if(error.response.status) 
            {
                if(error.response.status === 422)
                {
                    errors.value = error.response.data.errors
                }
            }
        }

    }

    return {
        errors, respuesta, inversiones, dato, form, tasa_interes,
        listar, buscar, isActived, pagesNumber, cambiarPagina, cambiarPaginacion, limpiar,
        obtenerTasaInteresInversion, agregrarRegistroInversion
    }
}