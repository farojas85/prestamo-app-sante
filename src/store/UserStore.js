import { defineStore } from "pinia";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../api";
import { getConfigHeader, getConfigHeaderPost } from "../helpers";

export const useUserStore = defineStore("usuario",{
    state: () => ({
        usuario: {},
        roles:[],
        menus:[],
        permisos:[],
        errors:[],
    }),
    actions:{
        async loginUser(credenciales) {
            try {

                const respond = await prestamoApi.post('/api/login',credenciales,getConfigHeaderPost())
                // const res = await fetch(import.meta.env.VITE_APP_API_URL+'/api/login', {
                //     method: "POST",
                //     headers: {
                //     "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify(credenciales.value),
                // });
                // const user = await res.json();
                
                if(respond.status == 422)
                {
                    this.errors = jwtDecode(error.response.data);

                }
                localStorage.setItem('token-api',  JSON.stringify(user))                



                //this.cargarDatosSession()

                window.location.href = '/dashboard';

            } catch (error) {
                if(error.response.status === 422)
                {
                    this.errors = jwtDecode(error.response.data);
                }
            }

        },
        async cargarDatosSession() {              
            this.usuario = jwtDecode(localStorage.getItem('token-api')||"").user ?? {};
            //this.usuario = jwtDecode(respond).usuario
            this.usuario.foto = import.meta.env.VITE_APP_API_URL+this.usuario.foto;
            this.roles = this.usuario.roles[0] ?? [];
            this.menus = this.usuario.menus ?? [];
            this.permisos = this.usuario.permisos ?? [];
        },
        puede(slug) {
            if(this.permisos)
            {
                const todo = this.permisos.find(p => p.slug == slug)
                if(todo)
                {
                    return true;
                }
            }
            return false;
        }
    }
});