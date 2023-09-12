<template>
<div style="background: rgb(26, 58, 103); height: 100vh;">
    <div>
        <div class="row" style="background-image: url(https://portal.cfsoul.com/images/imagen_1.png) ;background-size: 40% 100vh; height: 100vh;">
            <div class="col-md-6">
            </div>
            <div class="col-md-6">
                <div class="card card-container" style="margin-top: 30%; margin-bottom: auto;">
                  <center>
                    <img src="https://portal.cfsoul.com/images/icono_amarillo.png" width="100px"><br/><br/>
                    <h1>INICIAR SESIÓN</h1>
                  </center>
                    <form name="form" @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label for="username"><strong>Username :</strong></label>
                            <input v-model="user.username" v-validate="'required'" type="text" class="form-control" name="username" />
                            <div v-if="errors.has('username')" class="alert alert-danger" role="alert">Se requiere un usuario!</div>
                        </div>
                        <div class="form-group">
                            <label for="password"><strong>Password</strong></label>
                            <input v-model="user.password" v-validate="'required'" type="password" class="form-control" name="password" />
                            <div v-if="errors.has('password')" class="alert alert-danger" role="alert">Se requiere password!</div>
                        </div>
                        <br />
                        <div class="form-group">
                            <button class="btn btn-primary btn-block" :disabled="loading">
                                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                                <span>Acceder</span>
                            </button>
                        </div>
                        <br />
                        <div class="form-group">
                            <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/* eslint-disable */

export default {
    name: 'Login',
    components: {
    },
    data() {
        return {
            user: {},
            loading: false,
            message: ''
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn
        }
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/profile')
        }
    },
    methods: {
        handleLogin() {
            this.loading = true
            this.$validator.validateAll().then(isValid => {
                if (!isValid) {
                    this.loading = false
                    return
                }

                if (this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        response => {
                            if (response.claveEstatusUsuario == 'EST_US_A') {
                                this.$router.push('/profile')
                            } else if (response.claveEstatusUsuario == 'EST_US_N') {
                                this.$router.push('/datosPersona')
                            }
                        },
                        () => {
                            // error.response.data;
                            this.loading = false
                            this.message = 'Usuario o contraseña invalida'
                        }
                    ).catch(() => this.loading = false)
                    this.loading = false
                }
            })
        }
    }
}
</script>

<style scoped>
label {
    display: block;
    margin-top: 10px;
}

.card-container.card {
    max-width: 450px !important;
    padding: 40px 40px;
}

.card {
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    margin-top: 50px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}
</style>
