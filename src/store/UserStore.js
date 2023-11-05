import { defineStore } from "pinia";
import { jwtDecode } from 'jwt-decode';
import { prestamoApi } from "../api";
import { getConfigHeader } from "../helpers";

export const useUserStore = defineStore("usuario",{
    state: () => ({
        usuario:{},
        roles:[],
        menus:[],
        permisos:[],
        errors:[],
    }),
    actions:{
        async loginUser(credenciales) {
            try {

                const res = await fetch(import.meta.env.VITE_APP_API_URL+'/api/login', {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credenciales.value),
                });
                const user = await res.json();
                
                localStorage.setItem('token-api',  JSON.stringify(user))                

                await this.cargarDatosSession()

                window.location.href = '/dashboard';

            } catch (error) {
                if(error.response.status === 422)
                {
                    let dato = jwtDecode(error.response.data);
                    this.errors = dato
                }
            }

        },
        async cargarDatosSession() {  
            
            
            this.usuario = jwtDecode(localStorage.getItem('token-api')).user;
            console.log(this.usuario)

            //this.usuario = jwtDecode(respond).usuario
            this.usuario.foto = import.meta.env.VITE_APP_API_URL+this.usuario.foto;
            this.roles = this.usuario.roles.map(role => role.slug) ?? [];
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