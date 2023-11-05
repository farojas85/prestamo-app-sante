import { jwtDecode } from 'jwt-decode';

export default class Auth {
    constructor() {        
        this.user = null;
        if(localStorage.getItem('token-api')){
            this.user = JSON.parse( JSON.stringify(jwtDecode(localStorage.getItem('token-api')||""))).user
            this.user.foto = import.meta.env.VITE_APP_API_URL + this.user.foto
        }
    }

    roles() {
        return this.user.roles.map(role => role.slug);
    }

    permisos() {
        return this.user.permisos.map(permiso=>permiso.slug);
    }

    menus() {
        return this.user.menus
    }

    puede($directrizPermiso) {
        return this.permisos().includes($directrizPermiso);
    }

    hasRole($role) {
        return this.roles().includes($role);
    }
}
