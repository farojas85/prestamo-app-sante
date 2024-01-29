import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";
import { jsPDF } from "jspdf";

export const useHistorialInversion = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configPostUpload = getConfigHeaderUpload();
    const inversiones = ref([]);    

    const dato = ref({
        page: 1,
        paginacion: 10,
        buscar:'',
        user:'',
        role:''
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

    const obtenerHistorialInversiones = async(data) =>{
        let datos = "page="+data.pagina+"&paginacion="+data.paginacion+
                    "&user="+data.user+'&role='+data.role;

        let respond = await prestamoApi.get('/api/inversiones?'+datos, config)

        inversiones.value = jwtDecode(respond.data).inversiones
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

    return {
        errors, respuesta, inversiones, dato, form,
        listar, buscar, isActived, pagesNumber, cambiarPagina, cambiarPaginacion, limpiar
    }
}