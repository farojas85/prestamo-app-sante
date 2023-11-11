<script setup>
    import { ref } from 'vue';
    import { useAutenticacion } from '../../composables/autentication';

    const {
        errors, usuario,
        loginUsuario
    } = useAutenticacion();

    const autenticar = async () => {
        await loginUsuario(usuario.value)

        console.log(errors)
    }
</script>
<template>
    <div class="card p-2">
        <div class="app-brand justify-content-center mt-5">
            <a href="/" class="app-brand-link gap-2">
                <span class="app-brand-logo demo">
                    <span style="color: #666cff">
                        <img src="/materialize/logos/logo-100.webp">
                    </span>
                </span>
            </a>
        </div>
        <div class="card-body mt-2">
            <h4 class="mb-2">Bienvenido a Inversiones SANTE 👋</h4>
            <p class="mb-4">Inicie sesión para comenzar esta aventura</p>
            <form id="formAuthentication" class="mb-3 needs-validation"  @submit.prevent="autenticar">
                <div class="mb-3">
                    <div class="input-group input-group-merge">
                        <div class="form-floating form-floating-outline">
                            <input type="text" class="form-control" id="name" name="name"
                                placeholder="Ingrese su Nombre de usuario" autofocus
                                v-model="usuario.name" :class="{ 'is-invalid': errors.name}" />
                            <label for="name">Nombre de usuario</label>
                        </div>
                        <span class="input-group-text cursor-pointer" :class="{ 'text-danger': errors.name}" >
                            <i class="mdi mdi-account"></i>
                        </span>
                    </div>
                    <div class="text-danger" v-for="error in errors.name" :key="error">{{ error }}</div>
                </div>
                <div class="mb-3">
                    <div class="form-password-toggle">
                        <div class="input-group input-group-merge">
                            <div class="form-floating form-floating-outline">
                                <input type="password" id="password" class="form-control" name="password"
                                    placeholder="Ingrese su contrasña"
                                    aria-describedby="password"  v-model="usuario.password" 
                                    :class="{ 'is-invalid': errors.password}" />
                                <label for="password">Contraseña</label>
                            </div>
                            <span class="input-group-text cursor-pointer" :class="{ 'text-danger': errors.password}">
                                <i class="mdi mdi-eye-off-outline"></i>
                            </span>
                        </div>
                    </div>
                    <div class="text-danger" v-for="error in errors.password" :key="error">{{ error }}</div>
                </div>
                <div class="mb-3 d-flex justify-content-between">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember-me" />
                        <label class="form-check-label" for="remember-me"> Recordarme </label>
                    </div>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary d-grid w-100" type="submit">Acceder</button>
                </div>
            </form>
        </div>
    </div>
    <!-- <div class="login-logo">
        <img src="/img/logos/logo-100.webp">
    </div>
    <div class="card">
        <div class="card-body login-card-body">
            <p class="login-box-msg">Iniciar Sesi&oacute;n</p>

            <form @submit.prevent="autenticar">
                <div class="form-group row">
                    <div class="col-md-12 mb-3">
                        <div class="input-group" >
                            <input type="text" class="form-control" :class="{ 'is-invalid': errors.name }" placeholder="Nombre de Usuario"
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
                            <input type="password" class="form-control" :class="{ 'is-invalid': errors.password }"  placeholder="Contraseña"
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
        </div>
    </div> -->
</template>
