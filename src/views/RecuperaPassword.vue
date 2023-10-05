<template>
  <div class="banner" style="height: 100vh;">
    <video src="https://cfsoul.com/wp-content/themes/shopic-child/assets/vid/buildings.mp4" autoplay="" loop="" playsinline="" muted="" poster="https://cfsoul.com/wp-content/themes/shopic-child/assets/img/inicio/fondo_1.png"></video>
      <div class="row" style=" height: 100vh">
        <div class="col-md-12 ">
          <v-lazy v-model="formulario" min-height="0" :options="{ threshold: .01 }" transition="scale-transition" class="card">
            <div class="card-container">
              <center>
                <router-link to="/">
                  <img src="https://portal.cfsoul.com/images/icono_amarillo.png" width="100px">
                </router-link><br /><br />
                <h1>Recuperar contraseña</h1>
              </center>
              <v-form ref="form" autocomplete="off" v-if="banderaCambioPassword">
                <div class="form-group">
                  <label for="pwd" style="padding: 12px;"><strong>Contraseña*:</strong></label>
                  <v-text-field prepend-icon="mdi mdi-key" v-model="user.password" required name="pwd" outlined dense
                    autocomplete="off" :rules="pwdRules" :type="show1 ? 'text' : 'password'"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1"></v-text-field>
                </div>
                <div class="form-group">
                  <label for="pwd" style="padding: 12px;"><strong>Confirma Contraseña*:</strong></label>
                  <v-text-field prepend-icon="mdi mdi-key" v-model="password" required name="pwd" outlined dense
                    autocomplete="off" :rules="validacionPassword" :type="'password'"
                    @click:append="show1 = !show1"></v-text-field>
                </div>
                <div style="margin-top: -25px;">
                  <br /><br />
                  <v-btn class="btn btn-primary" color="rgb(26, 58, 103)" dark style="float: right;" @click.prevent="handleLogin()">
                    <span>Cambiar contraseña</span>
                  </v-btn>
                  <br/><br/>
                  <router-link to="/" style="float: right;">
                    <span>Login</span>
                  </router-link>
                </div>
                <br />
              </v-form>
              <div v-else>
                <br/><br/><br/><br/>
                <center>
                  <h2>{{ contador }}</h2>
                  <br/><br/>
                  <span>La contraseña se modifico con éxito redirigir a <router-link to="/" style="font-weight: bold;" > <span>login</span> </router-link>.</span>
                </center>
              </div>
            </div>
          </v-lazy>
        </div>
      </div>
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
      banderaCambioPassword : true,
      show1: false,
      user: {},
      contador: 10,
      timeoutContador:0,
      password: '',
      pwdRules: [
        v => !!v || 'Se requiere una contraseña', v => v.length > 7 || 'La contraseña debe contener minimo 8 caracteres'
      ],
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
    validacionPassword() {

      return [
        v => !!v || 'El campo es requerido.',
        v => (v === this.user.password) || 'La contraseña no es igual',
      ];


    },
  },
  created() {

  },
  mounted() {
    if(this.$route.params.idUsuarioB != undefined && this.$route.params.tokenPassword != undefined) {
      this.user.idUsuario = atob(this.$route.params.idUsuarioB);
      this.user.tokenPassword = this.$route.params.tokenPassword;
    }else {
      this.$router.push('/')
    }
  },
  methods: {
    handleLogin() {
      let validacion = this.$refs.form.validate() ;
        if (validacion) {

          UserService.actualizaContrasenia(this.user).then(resp => {
            if(resp.data.status.success){
              this.$toasts.push({
                type: 'info',
                message: 'Contraseña modificada.'
              })
              this.banderaCambioPassword = false;
              setInterval(() => {
                this.contador = this.contador - 1;
                if (this.contador < 0) {
                  this.$router.push('/')
                }
              }, 1000);
            }else{
              this.$toasts.push({
                type: 'error',
                message: resp.data.body
              })
            }
          }).catch((error) => {
            console.error(error);
          })
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
}</style>
