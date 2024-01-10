<template>
    <div>
      <v-card >
        <div class="ml-2 mr-2">
          <v-card-title>
            Usuarios
            <v-spacer></v-spacer>
           
          </v-card-title>
          <v-btn  class="mb-5" color="rgb(27, 85, 158)" dark   @click="editarUsuario()" >
            Agregar
          </v-btn>
        </div>
        <v-data-table  :headers="headers" :items="desserts" :search="txtBuscar" :searchable="true">
          <template v-slot:no-data>
            <v-alert :value="true">
              no se encontraron registros...
            </v-alert>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true">
              no se encontraron registros...
            </v-alert>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="rgb(27, 85, 158)" v-if="item.indStatusString == 'Activo'  && !showPROMO">
              <v-icon dark @click="editarUsuario(item, false)"> mdi-file-edit-outline </v-icon>
            </v-btn>
            <v-btn icon color="rgb(27, 85, 158)">
              <v-icon dark @click="editarUsuario(item, true)"> mdi-magnify </v-icon>
            </v-btn>

            <v-btn icon color="red" v-if="item.indStatusString == 'Activo' && !showPROMO">
              <v-icon dark @click="borradoLogico(item)"> mdi-delete </v-icon>
            </v-btn>
            <v-btn icon color="light-green" v-if="item.indStatusString == 'Inactivo' && !showPROMO">
              <v-icon dark @click="borradoLogico(item)" > mdi-check-bold </v-icon>
            </v-btn>

          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="editUsuario" max-width="1500" persistent scrollable transition="dialog-bottom-transition" min-width="400">
      <v-card>
        <v-card-title tag="div">
          <v-toolbar color="rgb(26, 58, 103)" dark>
            Editar Cliente
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click="closeUsuario()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height: 200px; max-height: 500px;" id="scrollDialog" class="scrollTop">
          <v-form ref="formUsuario">
            <v-container>
              <h2>Datos Personales</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="rol.idRol" :items="catTipoRol" item-value="idCat"
                    item-text="descripcion" label="Rol" :disabled="disabledCampos" :rules="isRequeridoRule"></v-select>
                </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.nombre" label="Nombre" :disabled="disabledCampos" :rules="isRequeridoRule"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.apellidoPaterno" label="Apellido Paterno" :disabled="disabledCampos" :rules="isRequeridoRule"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.apellidoMaterno" label="Apellido Materno" :disabled="disabledCampos" ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.telefono" label="Teléfono" counter maxlength="10" :rules="telefonoRule"
                      :disabled="disabledCampos"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.email" label="Email" :rules="correoRule"
                      :disabled="disabledCampos"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.rfc" label="RFC" :disabled="disabledCampos" :rules="isRequeridoRule"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="usuario.curp" label="CURP" :disabled="disabledCampos"></v-text-field>
                  </v-col>
<!-- 
                  <v-col cols="12" sm="6" md="4">
                    <v-menu ref="fechaNac" v-model="fechaNac" :close-on-content-click="false"
                      :return-value.sync="usuario.fechaNacimiento" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="usuario.fechaNacimiento" label="Fecha de nacimiento"
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          :disabled="disabledCampos"></v-text-field>
                      </template>
                      <v-date-picker v-model="usuario.fechaNacimiento" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="fechaNac = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.fechaNac.save(usuario.fechaNacimiento)">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-menu ref="fechaInicioOp" v-model="fechaInicioOp" :close-on-content-click="false"
                      :return-value.sync="usuario.fechaInicioOperacion" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="usuario.fechaInicioOperacion" label="Fecha inicio de operaciones"
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          :disabled="disabledCampos"></v-text-field>
                      </template>
                      <v-date-picker v-model="usuario.fechaInicioOperacion" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="fechaInicioOp = false">
                        Cancel
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.fechaInicioOp.save(usuario.fechaInicioOperacion)">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                  <v-menu ref="fechaReg" v-model="fechaReg" :close-on-content-click="false"
                    :return-value.sync="usuario.fechaInicioRegistro" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="usuario.fechaInicioRegistro" label="Fecha inicio de registro"
                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                        :disabled="disabledCampos"></v-text-field>
                    </template>
                    <v-date-picker v-model="usuario.fechaInicioRegistro" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="fechaReg = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.fechaReg.save(usuario.fechaInicioRegistro)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              -->
              </v-row>
              <br />
              <v-divider></v-divider>
              <br />
            
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
            <v-col lg="12">
              <v-btn class="btn ml-2" color="primary" style="float: right;" @click="guardarUsuario()"
                v-if="!disabledCampos"> Guardar</v-btn>
              <v-btn class="btn ml-2" dark color="red" style="float: right;" @click="closeUsuario()"> Cerrar</v-btn>
            </v-col>
          </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </div>
</template>

<script>
  const $ = require('jquery');
  import CatGeneralService from '@/services/catGeneral.service'
import UserService from '@/services/usuarios.service'

export default {
  name: 'usuarios',
  components: {
    
  },
  mounted() {
    UserService.getListUsuarios().then(resp => {
      this.desserts = resp.data.body
    }).catch(error => {
      console.error(error);
    }),
    CatGeneralService.getCatRol(this.$CAT_MAES.TIP_ROL).then(resp => {
      this.catTipoRol = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo persona', error)
    });
    CatGeneralService.getCatSelect(this.$CAT_MAES.TIP_SOC).then(resp => {
      this.catTipoSociedad = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo sociedad', error)
    });

  },
  data() {
    return {
      persona: {},
      editUsuario: false,
      disabledCampos: false,
      fechaInicioOp: false,
      fechaReg: false,
      fechaNac: false,
      catTipoSociedad: [],
      catTipoPersona: [],
      catTipoRol: [],
      catActividad: [],
      usuario: {},
      rol: {},
      txtBuscar: '',
       headers: [{
        text: 'Nombre completo',
        align: 'start',
        value: 'nombreCompleto'
      },
      {
        text: 'Correo',
        align: 'start',
        value: 'email'
      },
      {
        text: 'RFC',
        align: 'start',
        value: 'rfc'
      },
      {
        text: 'CURP',
        value: 'curp'
      },
      {
        text: 'Estatus',
        value: 'indStatusString'
      },
      {
        text: 'Acciones',
        value: "actions",
        sortable: false,
        class: ""
      },
      ],
      desserts: [],
      correoRule: [v => !!v || 'El campo es requerido.', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electronico'],
      isRequeridoRule: [v => !!v || 'El campo es requerido.'],
      telefonoRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && v.length == 10) || 'El campo debe tener 10 digitos.'],
    }
  },
  methods: {
    selectCatActividad(){
      this.usuario.idGiro = 0;
      CatGeneralService.getCatSelectIdCatPadre(this.$CAT_MAES.TIP_GIRO, this.usuario.idActividad).then(resp => {
        this.catGiro = resp.data.body;
      }).catch(error => {
        console.error('Error al obtener tipo giro', error)
      });

    },

    guardarUsuario() {
        let usuarioRequest = {
          cliente: this.usuario,
          rol: this.rol
        }
        let validacion = this.$refs.formUsuario.validate();
        //console.log(validacion); return false;
        if(validacion){
          UserService.nuevoUsuario(usuarioRequest).then(resp => {
            console.log('respuesta', resp);
            var success = resp.data.status.success
            if (success) {
              this.$toasts.push({
                type: 'info',
                message: 'Registro guardado exitosamente.'
              });
              this.closeUsuario();
             // console.log(resp.data.body);
              this.desserts = resp.data.body
            } else {
              this.$toasts.push({
                type: 'error',
                message: 'Ocurrio un error al guardar el registro.'
              })
            }
          }).catch(error => {
            console.error("usuario", error);
          })
        }
    },

    closeUsuario() {
      // Lógica para cerrar la modal
      this.$refs.formUsuario.reset();
      document.getElementById("scrollDialog").scrollTop = 0;
      this.usuario = {};
      this.rol = {};
      this.editUsuario = false;
    },
    editarUsuario (item, disabled) {
      this.usuario = {};
      this.disabledCampos = disabled;
      if (item) {
        let usuarioRequest = {
          cliente: item,
        }
        UserService.getUsuarioById(usuarioRequest).then(resp => {
          let data = resp.data.body;
          console.log(data[0]);
          this.usuario = data[0];
          this.rol = { idRol: data[0].idRol};

          this.editUsuario = true;
        }).catch(error => {
          console.error(error);
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error al obtener el registro.'
          })
        })
      }else{
        this.editUsuario = true;
      }
    },
    borradoLogico(item){
       let usuarioRequest = {
          cliente: item,
        }
      UserService.borradoLogico(usuarioRequest).then(resp => {
        this.desserts = resp.data.body;
        
        this.$forceUpdate(); // Forzar la actualización de la tabla
        
         this.$toasts.push({
            type: 'success',
            message: 'se ha actualizado el registro.'
          })
        }).catch(error => {
          console.error(error);
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error al borrar el registro.'
          })
        })
    },
    cambioRazonSocial() {
      this.usuario.razonSocial = null;
      this.usuario.nombre = null;
      this.usuario.apellidoMaterno = null;
      this.usuario.apellidoPaterno = null;
    }
  },
  computed: {  
    currentUser() {
        const user = this.$store.state.auth.user
        return user
    },
    showPROMO() {
      var rolSelect = this.currentUser.info.rolSelect;
      var rol = this.$ROL.ROL_PROM;
      return rolSelect.claveRol.includes(rol);
    },

    isPersonaFisica() {
      let id = this.usuario.idTipoPersona;
      if (id != undefined && id != null) {
        let clave = '';
        this.catTipoPersona.forEach((numero, index) => {
          if (numero.idCat == id) {
            clave = numero.clave
          }
        });

        return clave == 'TIP_PER_FSC'
      }
      return null;
    }
  },
}
</script>