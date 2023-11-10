<template>
  <div id="home">
    <div class="head row"  style="height: 100px; padding-left: 40px; padding-top: 5px;background: rgb(26 58 103)">
      <div class="col-2">
        <img src="https://portal.cfsoul.com/images/icono_amarillo.png" height="80px">
      </div>
      <div class="col-10" style="padding-top: 50px;">
        <center>
          <span style="color: white; font-size: 38px;"> CAPITAL & FINANCIAL SOUL </span>
        </center>
      </div>
    </div>
    <div class="row" :style="{ height: maxHeight - 100 + 'px' }">
      <menuUsuario :maxHeight="maxHeight" @selectMenu="selectMenu = $event; subSelect = ''"></menuUsuario>
      <div id="content" >
        <v-card>
      <v-card-title tag="div">
        <v-toolbar color="rgb(26, 58, 103)" dark>
          Datos Personales
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.nombre" label="Nombre"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.apellidoPaterno" label="Apellido paterno"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.apellidoMaterno" label="Apellido materno"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.rfc" label="RFC" :disabled="true" counter maxlength="13"
              :rules="rfcRule"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.curp" label="CURP" counter maxlength="18"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="persona.correoElectronico" label="Correo electronico" :disabled="true"
              :rules="correoRule"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model.number="persona.telefono" label="Telefono" counter maxlength="10"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-spacer class="line"></v-spacer>
      <v-card-title>
        <h2>Cuenta bancaria</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model.number="cuentaBancaria.clabeInterbancaria" label="Clabe interbancaria" counter
              maxlength="18" :rules="clvIntRule"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model.number="cuentaBancaria.numeroCuenta" label="Numero cuenta" counter maxlength="10"
              :rules="numCueRule"></v-text-field>
          </v-col>
        </v-row>
        <v-spacer class="line"></v-spacer>
        <h2>Domicilio</h2>
        <DomicilioApp ref="domicilio" :isActivo="true" :deshabilitar="false" :domicilio="domicilio"
          @recuperaDomicilio="domicilio = $event" :cp="domicilio.cp"></DomicilioApp>
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col lg="12">
              <v-btn class="btn ml-2" color="primary" style="float: right;" @click="saveUsuario()">Guardar Dato</v-btn>
              <v-btn class="btn ml-2" color="error" style="float: right;" @click="cancelar()">Cancelar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
    <v-form ref="form">
      <v-dialog v-model="cambiaContrasenia" persistent min-width="350px" max-width="600px">
        <v-card>
          <v-card-title>
            <v-toolbar color="rgb(26, 58, 103)" dark>
              Cambiar Contraseña
              <v-spacer></v-spacer>
            </v-toolbar>
            </v-card-title>
          <v-card-text>
            <v-alert type="success">Hola, por favor cambia tu password.</v-alert>
            <v-text-field v-model="usuario.password" :rules="validacionGeneral" label="Password"
              v-validate="'required|min:6|max:40'" type="password"></v-text-field>
            <v-text-field v-model="usuario.passwordValida" :rules="validacionPassword" label="Valida password"
              v-validate="'required|min:6|max:40'" type="password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="guardarUsuario">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
      </div>
    </div>
  </div>
</template>
<script>
import DomicilioApp from '@/componentes/domicilio'
import UserService from '@/services/user.service'
export default {
  components: {
    DomicilioApp
  },
  data () {
    return {
      usuario: {},
      cambiaContrasenia: false,
      domicilio: { cp: '' },
      persona: {},
      cuentaBancaria: {},
      clvIntRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && (v + '').length === 18) || 'El campo debe tener 18 digitos.'],
      numCueRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && (v + '').length === 10) || 'El campo debe tener 10 digitos.'],
      correoRule: [v => !!v || 'El campo es requerido.', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electronico'],
      rfcRule: [v => !!v || 'El campo es requerido.', v => /^([A-Za-zÑñ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Za-z\d]{2})([A\d])$/.test(v) || 'El RFC es invalido']
    }
  },
  computed: {
    currentUser () {
      const user = this.$store.state.auth.user
      return user
    },
    montoRule () {
      const aux = [v => !!v || 'El campo es requerido.']
      return aux
    },
    validacionPassword () {
      return [(v) => !!v || 'El campo es requerido', (v) => (v === this.usuario.password) || 'La contraseña no es igual']
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.user = this.currentUser
    this.usuario.idUsuario = this.user.id
    this.cargaInicial()
  },
  methods: {
    cargaInicial () {
      UserService.obtenerUsuario(this.user.id).then(resp => {
        this.empleado = resp.data.body.empleado
        this.persona = resp.data.body.persona
        this.domicilio = resp.data.body.domicilio
        this.cuentaBancaria = resp.data.body.cuentaBancaria
        if (this.user.claveEstatusUsuario === 'EST_US_NUEVO') {
          this.cambiaContrasenia = true
        }
      }).catch(error => {
        console.error(error)
      })
    },
    saveUsuario () {
      this.$refs.domicilio.recuperaDomicilio()
      const resp = {
        idUsuario: this.user.id,
        persona: this.persona,
        domicilio: this.domicilio,
        cuentaBancaria: this.cuentaBancaria
      }
      UserService.saveUsuario(resp).then(resp => {
      }).catch(error => {
        console.error(error)
      })
    },
    cancelar () {
      if (this.user.claveEstatusUsuario === 'EST_US_NUEVO') {
        this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      } else {
        this.$router.push('/profile')
      }
    },
    guardarUsuario () {
      if (this.$refs.form.validate()) {
        UserService.editaUsuarioClientePass(this.usuario)
          .then(response => {
            if (response.data) {
              this.cambiaContrasenia = true
              this.$store.dispatch('auth/registerUsuario', response.data)
              this.$toasts.push({
                type: 'success',
                message: 'La información se guardo exitosamente.'
              })
            } else {
              this.usuarioExisteSistema = true
              this.$toasts.push({
                type: 'error',
                message: 'El usuario ya se encuentra registrado.'
              })
            }
          }).catch(() => {
            this.$toasts.push({
              type: 'error',
              message: 'Ocurrio un error intente nuevamente.'
            })
          })
      }
    }
  }
}
</script>
