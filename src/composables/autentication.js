import { ref,inject } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { getConfigHeader } from '../helpers'
import { prestamoApi } from '../api';

export const useAutenticacion = () => {
    const config = getConfigHeader();
    const errors = ref([]);
    const respuesta = ref([]);
    const usuario = ref({ name: '', password: '' });

    const loginUsuario = async() => {

        errors.value = [];
        try {
            let response = await prestamoApi.post('/api/login',usuario.value);
            localStorage.setItem('token-api',  JSON.stringify(response.data));

            window.location.href = '/dashboard';

        }
        catch (error) {
            if(error.response.status === 422)
            {
                let dato = jwtDecode(error.response.data);
                errors.value = dato
            }
        }
    }

    const logoutUsuario = async(user_id) => {

        let respond = await prestamoApi.post('/api/logout',{id:user_id}, config)

        if(respond.status == 200 && respond.data.ok==1)
        {
            localStorage.removeItem('token-api')
            window.location.href = '/'
        }
    }

    return {
        errors, usuario, respuesta,
        loginUsuario, logoutUsuario
    }
}