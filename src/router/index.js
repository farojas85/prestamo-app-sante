import {createRouter, createWebHistory} from 'vue-router';
//LAYOUTS
import LoginLayout from '../layouts/LoginLayout.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

//PAGES
import Login from '../pages/auth/Login.vue';
import Dashboard from '../pages/dashboards/Inicio.vue';
import Sistema from '../pages/sistema/Inicio.vue';
import Configuracion from '../pages/configuracion/Inicio.vue';
import Empleado from '../pages/empleado/Inicio.vue';
import Prestamo from '../pages/prestamo/Inicio.vue';
import Configuraciones from '../pages/iniciales/Configuraciones.vue';
import RegistroPago from '../pages/registro-pago/Inicio.vue';
import Inversion from '../pages/inversion/Inicio.vue';

const routes = [
    {
        path: '/', name:'Login', component: Login,
        meta: {layout: LoginLayout}
    },
    {
        path: '/dashboard', name:'Dashboard', component: Dashboard,
        meta: {layout: DefaultLayout, icono:'fas fa-tachometer-alt fa-fw'}
    },
    {
        path: '/sistema', name:'Sistema', component: Sistema,
        meta: { layout: DefaultLayout, icono:'fab fa-windows fa-fw fa-fw'}
    },
    {
        path: '/configuracion', name:'Configuración', component: Configuracion,
        meta:{ layout: DefaultLayout, icono: 'fas fa-cogs fa-fw'}
    },
    {
        path: '/empleado', name:'Empleado', component: Empleado,
        meta:{ layout: DefaultLayout, icono: 'fas fa-users-line fa-fw'}
    },
    {
        path: '/prestamo', name:'Perfil', component: Prestamo ,
        meta:{layout: DefaultLayout}
    },
    {
        path: '/configuraciones', name:'Configuraciones', component: Configuraciones ,
        meta:{layout: DefaultLayout, icono: 'fas fa-gear fa-fw'}
    },
    {
        path: '/registro-pago', name:'Registro Pagos', component: RegistroPago ,
        meta:{layout: DefaultLayout, icono: 'fas fa-money-check-dollar fa-fw'}
    },
    {
        path: '/inversion', name:'Inversión', component: Inversion ,
        meta:{layout: DefaultLayout, icono: 'fas fa-money-bill-wheat fa-fw'}
    },
];

export default createRouter({
    history: createWebHistory(),
    routes
})