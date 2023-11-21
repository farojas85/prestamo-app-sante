
import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
// import './bootstrap';
import './style.css';
import App from './App.vue';
import router from './router';
import SweetAlert2 from  'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp({render: () => h(App)});
app.use(router)
app.use(createPinia());
app.provide('Swal',SweetAlert2);
app.provide('Auth', null);
app.mount('#app');
