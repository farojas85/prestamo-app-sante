import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { jsPDF } from 'jspdf';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost, getConfigHeaderUpload } from "../../helpers";

export const useDashboardInversionista = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const configUploadPost = getConfigHeaderUpload();
    const total_inversiones = ref(0);
    const total_ganancia = ref(0);

    const obtenerDataDashboard= async (user) => {
        let respond = await prestamoApi.get('/api/registro-inversiones/data-dashboard?user='+user,config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            let datos = jwtDecode(respond.data);
            total_inversiones.value = datos.total_inversiones;
            total_ganancia.value = datos.total_ganancia;
        }
    }

    return {
        errors, respuesta, total_inversiones, total_ganancia,
        obtenerDataDashboard
    }
}
