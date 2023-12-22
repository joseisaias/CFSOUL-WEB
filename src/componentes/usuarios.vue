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
        <v-data-table :headers="headers" :items="desserts" :search="txtBuscar" :searchable="true">
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
                    |
          </template>
        </v-data-table>
      </v-card>

      <v-form ref="formusuario">
        <v-dialog v-model="editUsuario" max-width="1500" persistent scrollable transition="dialog-bottom-transition"
          min-width="400">
            <v-card-title tag="div">
              <v-toolbar color="rgb(26, 58, 103)" dark>
                Usuario
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon dark @click="closeUsuario()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <h2>Datos Personales</h2>
                <!-- Agrega un formulario con un campo de entrada de texto -->
                <v-form @submit.prevent="submitForm">
                  <v-col cols="12" sm="6" md="4" >
                    <v-text-field v-model="usuario.nombre" label="Nombre" :disabled="disabledCampos"></v-text-field>
                  </v-col>
                  <!-- Agrega más campos según sea necesario -->
                  
                  <!-- Botón para cerrar el formulario -->
                  <v-btn type="submit">Guardar</v-btn>
                </v-form>
            </v-card-text>
        </v-dialog>
      </v-form>

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
    })
  },
  data() {
    return {
      persona: {},
      disabledCampos: false,
      fechaInicioOp: false,
      fechaReg: false,
      txtBuscar: '',
       headers: [{
        text: 'Nombre completo',
        align: 'start',
        value: 'nombreCompleto'
      },
      {
        text: 'Correo',
        align: 'start',
        value: 'correo'
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
    }
  },
  methods: {
    closeUsuario() {
      // Lógica para cerrar la modal
      this.editUsuario = false;
    },
    editarUsuario () {
      this.usuario = {};
      this.editUsuario = true;
      this.editUsuario = true;
    },
  }
}
</script>