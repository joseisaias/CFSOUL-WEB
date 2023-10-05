<template>
  <div class="banner" style="background: rgb(26, 58, 103); height: 100vh;">
    <video src="https://cfsoul.com/wp-content/themes/shopic-child/assets/vid/buildings.mp4" autoplay="" loop=""
      playsinline="" muted=""
      poster="https://cfsoul.com/wp-content/themes/shopic-child/assets/img/inicio/fondo_1.png"></video>
    <div>
      <div class="row"
        style="background-image: url(https://portal.cfsoul.com/images/imagen_1.png) ;background-size: 100% 100vh; height: 100vh">
        <div class="col-md-12 ">
          <v-lazy v-model="formulario" min-height="0" :options="{ threshold: .01 }" transition="scale-transition"
            class="card">
            <div class="card-container">
              <center>
                <img src="https://portal.cfsoul.com/images/icono_amarillo.png" width="100px"><br /><br />
                <h1>INICIAR SESIÓN</h1>
              </center>
              <v-form ref="form" autocomplete="off">
                <div class="form-group">
                  <label for="us" style="padding: 12px;"><strong>Correo Electrónico*:</strong></label>
                  <v-text-field prepend-icon="mdi mdi-account" v-model="user.username" type="text" required name="us"
                    outlined dense :rules="userRules"></v-text-field>
                </div>
                <div class="form-group">
                  <label for="pwd" style="padding: 12px;"><strong>Contraseña*:</strong></label>
                  <v-text-field prepend-icon="mdi mdi-key" v-model="user.password" required name="pwd" outlined dense
                    autocomplete="off" :rules="pwdRules" :type="show1 ? 'text' : 'password'"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1"></v-text-field>
                </div>
                <div style="margin-top: -25px;">
                  <p><a @click.prevent="modalRecuperarContrasenia()" style="float: right;">¿Olvidaste tu contraseña?</a>
                  </p>
                  <br /><br />
                  <v-btn class="btn btn-primary" color="rgb(26, 58, 103)" dark :disabled="loading" :loading="loading"
                    style="float: right;" @click.prevent="handleLogin()">
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon color="red" light>mdi-cached</v-icon>
                      </span>
                    </template>
                    <span>Acceder</span>
                  </v-btn>
                </div>
                <br />
              </v-form>
            </div>
          </v-lazy>
        </div>
      </div>
    </div>
    <v-dialog v-model="modalRecupera" transition="dialog-bottom-transition" max-width="600">
      <v-card>
        <v-form ref="formRecupera">
          <v-toolbar color="rgb(26, 58, 103)" dark>
            Recuperar contraseña
          </v-toolbar>
          <v-card-text>
            <div class=" pa-12">
              <div>
                <label for="mail" style="padding: 12px;"><strong>Ingresa tu correo electrónico asociado a tu
                    cuenta</strong></label>
                <v-text-field prepend-icon="mdi mdi-email-outline" v-model="mail" required :rules="correoRules"
                  name="mail" outlined label="Correo electrónico" dense></v-text-field>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="recuperarContrasenia()">Recuperar</v-btn>
            <v-btn text @click="modalRecupera = false">Cerrar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import UserService from '@/services/user.service'
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      show1: false,
      user: {},
      loading: false,
      message: '',
      modalRecupera: false,
      formulario: false,
      count: 0,
      mail: '',
      userRules: [
        v => !!v || 'Se requiere un usuario', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electrónico'
      ],
      pwdRules: [
        v => !!v || 'Se requiere una contraseña',
      ],
      correoRules: [v => !!v || 'Se requiere un correo', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electrónico'],
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created() {
    if (this.loggedIn) {
      //this.$router.push('/profile')
    }
  },
  mounted() {

  },
  methods: {
    handleLogin() {
      let validacion = this.$refs.form.validate();
      if (validacion) {
        this.loading = true;
        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            response => {
              if (response.claveEstatusUsuario == 'EST_US_ACTIVO') {
                this.$router.push('/profile')
              } else if (response.claveEstatusUsuario == 'EST_US_NUEVO') {
                this.$router.push('/datosPersona')
              } else if (response.claveEstatusUsuario == 'EST_US_BLOQUEADO') {
                this.loading = false;
                this.$toasts.push({
                  type: 'error',
                  message: 'Usuario bloqueado.'
                })
              } else {
                this.loading = false;
                this.$toasts.push({
                  type: 'error',
                  message: 'Usuario o contraseña invalida.'
                })
              }
            },
            (error) => {
              console.error(error);
              this.loading = false;
              this.$toasts.push({
                type: 'error',
                message: 'Usuario o contraseña invalida.'
              })
            }
          ).catch((error) => {
            console.error(error);
            this.loading = false
          })
        }
      }
    },
    modalRecuperarContrasenia() {
      this.mail = '';
      this.modalRecupera = true;
      this.$refs.formRecupera.resetValidation();
    },
    recuperarContrasenia() {
      let mailDto = {
        destinatario: this.mail,
        tituloCorreo: 'Restablecimiento de contraseña',
        urlApp: window.location.origin + '#',
        body: '',
      }
      let validacion = this.$refs.formRecupera.validate() ;
      if (validacion) {
        UserService.recuperacontrasenia(mailDto).then(resp => {
          if (resp.data.status.success) {
            this.$toasts.push({
              type: 'info',
              message: 'Correo enviado.'
            })
            this.modalRecupera = false;
            this.mail = '';
          } else {
            this.$toasts.push({
              type: 'error',
              message: resp.data.body
            })
          }

        }).catch(error => {
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error.'
          })
        });
      }
    }
  }
}
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container {
  height: 580px !important;
}

.card {
  min-width: 500px !important;
  max-width: 600px !important;
  top: 50%;
  margin-top: -320px;
  padding: 20px 25px 0px;
  margin-left: auto;
  margin-right: auto;
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

.btn.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background: rgb(26 58 103) !important;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.banner video {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100vh;
  background: center;
  z-index: 0;
  top: 0px;
  left: 0px;
}
</style>
