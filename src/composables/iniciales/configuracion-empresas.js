import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../../api";
import { getConfigHeader, getdataParamsPagination, getConfigHeaderPost } from "../../helpers";

export const useConfiguracionEmpresa = () => {
    const errors = ref([]);
    const respuesta = ref([]);
    const config = getConfigHeader();
    const configPost = getConfigHeaderPost();
    const monedas = ref([]);
    const configuracionEmpresa = ref({});
    const aplicacionIntereses = ref([]);
    const aplicacionMoras = ref([]);

    const obtenerListaMonedas = async () => {
        let respond = await prestamoApi.get('/api/monedas/list',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            monedas.value = jwtDecode(respond.data).monedas
        }
    }

    const obtenerConfiguracionEmpresa = async () => {
        let respond = await prestamoApi.get('/api/configuracion-empresas/data',config)

        if(respond.status == 404)
        {
            errors.value = respond.data.error
        }

        if(respond.status == 200)
        {
            configuracionEmpresa.value = jwtDecode(respond.data).configuracion_empresa
        }
    }

    const guardarConfiguracionEmpresa = async(data) => {
        errors.value = [];
        respuesta.value = []
        try {
            let respond = await prestamoApi.post('/api/configuracion-empresas',data,configPost);

            respond = jwtDecode(respond.data)
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

    return {
        monedas, configuracionEmpresa, errors, respuesta,
        obtenerListaMonedas, obtenerConfiguracionEmpresa, guardarConfiguracionEmpresa
    }
}