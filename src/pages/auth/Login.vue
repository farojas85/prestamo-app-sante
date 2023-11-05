<script setup>
import { ref } from 'vue';
// import { useUserStore } from '../../store';

// const {
//     errors, loginUser
// } = useUserStore();
import { useAutenticacion } from '../../composables/autentication';

const { errors, usuario, loginUsuario } = useAutenticacion();

const autenticar = async() => {
    await loginUsuario(usuario.value)
}

</script>
<template>
    <div class="login-logo">
        <img src="/img/logos/logo-100.webp">
    </div>
    <div class="card">
        <div class="card-body login-card-body">
            <p class="login-box-msg">Iniciar Sesi&oacute;n</p>

            <form @submit.prevent="autenticar">
                <div class="form-group row">
                    <div class="col-md-12 mb-3">
                        <div class="input-group" >
                            <input type="text" class="form-control" :class="{ 'is-invalid': errors.name}" placeholder="Nombre de Usuario" 
                                v-model="usuario.name"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-user"></span>
                                </div>
                            </div>
                        </div>
                        <small class="text-danger" v-for="error in errors.name"
                            :key="error">{{ error }}</small>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-md-12 mb-3">
                        <div class="input-group">
                            <input type="password" class="form-control" :class="{ 'is-invalid': errors.password}"  placeholder="Contraseña"
                                v-model="usuario.password" />
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <small class="text-danger" v-for="error in errors.password"
                            :key="error">{{ error }}</small>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <div class="icheck-primary">
                            <input type="checkbox" id="remember" />
                            <label for="remember"> Recordarme </label>
                        </div>
                    </div>
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary btn-block">
                            Login
                        </button>
                    </div>
                </div>
            </form>

            <!-- <div class="social-auth-links text-center mb-3">
                <p>- OR -</p>
                <a href="#" class="btn btn-block btn-primary">
                    <i class="fab fa-facebook mr-2"></i> Sign in using Facebook
                </a>
                <a href="#" class="btn btn-block btn-danger">
                    <i class="fab fa-google-plus mr-2"></i> Sign in using Google+
                </a>
            </div>
            <p class="mb-1">
                <a href="forgot-password.html">I forgot my password</a>
            </p>
            <p class="mb-0">
                <a href="register.html" class="text-center">Register a new membership</a>
            </p> -->
        </div>
    </div>
</template>