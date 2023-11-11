import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store';
import { onMounted } from 'vue';


export const useDatosSession = () => {
    // const user_id = localStorage.getItem('token-api') ?
    //     JSON.parse( JSON.stringify(jwtDecode(localStorage.getItem('token-api')||""))).user : null;

    const { usuario, menus, permisos, roles} = storeToRefs(useUserStore());
    const { puede, cargarDatosSession } = useUserStore();

    onMounted(() => {
        cargarDatosSession()
    })
    return {
        usuario, menus, permisos, roles,
        puede, 
    }
}