<template>
<v-card>
    <div class="text-center">
        <v-dialog v-model="dialogCargando" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Cargando...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
    <v-form ref="formulario">
        <v-card-title>Agregar Usuario</v-card-title>
        <v-card-text>
            <v-container>
                <div class="row">
                    <div class="form-group col-lg-4">
                        <v-text-field v-model="persona.nombre" label="Nombre" :rules="proyectoRule" hide-details="auto" ></v-text-field>
                    </div>
                    <div class="form-group col-lg-4">
                        <v-text-field v-model="persona.primerApellido" label="Primer apellido" :rules="proyectoRule" hide-details="auto" ></v-text-field>
                    </div>
                    <div class="form-group col-lg-4">
                        <v-text-field v-model="persona.segundoApellido" label="Segundo apellido" :rules="proyectoRule" hide-details="auto" ></v-text-field>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-4">
                        <v-text-field v-model="usuarioDto.usuario" :rules="correo" label="Usuario" hide-details="auto"  :disabled="idUsuario != null"></v-text-field>
                    </div>
                    <div class="form-group col-lg-4">
                        <v-select v-model="usuarioDto.idRol" :rules="validacionGeneral" label="Rol"  item-value="idOpcion" item-text="descripcion" :items="catRoles" item- />
                    </div>
                    <div class="form-group col-lg-4">
                        <v-select v-model="usuarioDto.idEstatus" :rules="validacionGeneral" label="Estatus"  item-value="idOpcion" item-text="descripcion" :items="catEstatusUsuario" item- />
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4">
                        <v-text-field label="Correo" hide-details="auto" :rules="correo" v-model="persona.correo"  disabled></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="Telefono" hide-details="auto" :rules="validacionGeneral" v-model="persona.telefono" ></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="RFC" hide-details="auto" :rules="rfc" v-model="persona.rfc"  class="upperCase"></v-text-field>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <strong>Domicilio</strong>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <v-text-field label="Calle" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.calle" ></v-text-field>
                    </div>
                    <div class="col-lg-2">
                        <v-text-field label="Número exterior" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.numeroExterior" ></v-text-field>
                    </div>
                    <div class="col-lg-2">
                        <v-text-field label="Número interior" hide-details="auto" v-model="domicilio.numeroInterior" ></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="Colonia" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.colonia" ></v-text-field>
                    </div>
                    <div class="col-lg-1">
                        <v-text-field label="C.P." hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.cp" ></v-text-field>
                    </div>
                    <div class="col-lg-3">
                        <v-text-field label="Ciudad" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.ciudad" ></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="Municipio" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.municipio" ></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="Estado" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.estado" ></v-text-field>
                    </div>
                    <div class="col-lg-4">
                        <v-text-field label="País" hide-details="auto" required :rules="validacionGeneral" v-model="domicilio.pais" ></v-text-field>
                    </div>
                </div>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelAddUsuario()" color="error">Cancelar</v-btn>
            <v-btn @click="guardarAltaUsuario()" type="submit" color="primary" dark>Guardar</v-btn>
        </v-card-actions>
    </v-form>
</v-card>
</template>

<script>
/* eslint-disable */
import userService from '../services/user.service'

export default {
  name: 'Register',
  data () {
    return {
      dialogCargando: false,
      idUsuario: null,
      usuarioDto: {},
      domicilio: {},
      persona: {},
      catRoles: [],
      catEstatusUsuario: [],

      submitted: false,
      successful: false,
      message: '',

      validacionGeneral: [value => !!value || 'El campo es requerido.'],
      rfc: [v => !!v || 'El campo es requerido.', v => /^([A-Za-zÑñ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Za-z\d]{2})([A\d])$/.test(v) || 'El RFC es invalido'],
      userRules: [v => !!v || 'Usuario es requerido', v => /.+@.+\..+/.test(v) || 'el usuario no corresponde a un correo electronico'],

      correo: [v => !!v || 'El campo es requerido.', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electronico'],
      cpRule: [v => !!v || 'El campo es requerido.', v => Number(v) || 'El campo es numérico', v => (v && v.length === 5) || 'El campo debe tener 5 digitos.'],
      telefonoRule: [v => !!v || 'El campo es requerido.', v => Number(v) || 'El campo es numérico', v => (v && v.length === 10) || 'El campo debe tener 10 digitos.'],
      numExtRule: [v => !!v || 'El campo es requerido.', v => (v && v.length <= 25) || 'El campo de tener como máximo 25 caracteres.']

    }
  },
  computed: {
    currentUser () {
      const user = this.$store.state.auth.user
      return user
    }
  },
  mounted () {
    this.dialogCargando = true
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    if (this.$route.params.id !== undefined) {
      this.idUsuario = atob(this.$route.params.id)
      userService.obtenerUsuario(this.idUsuario)
        .then(
          response => {
            this.usuarioDto = response.data.usuarioDto
            this.domicilio = response.data.domicilio
            this.persona = response.data
            this.dialogCargando = false
          }
        ).catch(err => {
          setTimeout(() => (this.dialogCargando = false), 500)
          if (err) {
            this.$toasts.push({
              type: 'error',
              message: 'Ocurrio un error en el servidor.'
            })
          }
        })
    } else {
      this.dialogCargando = false
    }

    userService.obtenerRoles()
      .then(response => {
        this.catRoles = response.data
      }).catch(err => {
        setTimeout(() => (this.dialogCargando = false), 500)
        if (err) {
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error en el servidor.'
          })
        }
      })
    userService.obtenerEstatusUsuario()
      .then(response => {
        this.catEstatusUsuario = response.data
      })
      .catch(err => {
        setTimeout(() => (this.dialogCargando = false), 500)
        if (err) {
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error en el servidor.'
          })
        }
      })
  },
  methods: {
    guardarAltaUsuario () {
      if (this.$refs.formulario.validate()) {
        this.dialogCargando = true
        this.persona.usuarioDto = this.usuarioDto
        this.persona.domicilio = this.domicilio
        userService.guardarUsuario(this.persona)
          .then(() => {
            this.$toasts.push({
              type: 'susses',
              message: 'Se guardo registro.'
            })
            this.dialogCargando = false
          })
          .catch(err => {
            setTimeout(() => (this.dialogCargando = false), 500)
            if (err) {
              this.$toasts.push({
                type: 'error',
                message: 'Ocurrio un error en el servidor.'
              })
            }
          })
      }
    }
  }
}
</script>
