<template>
  <div>
    <v-card height="80vh">
      <div class="ml-2 mr-2">
        <v-card-title>
          <v-btn icon color="rgb(27, 85, 158)">
            <v-icon x-large dark @click="$emit('subSelect', { subSelect: '' })"> mdi-keyboard-return </v-icon>
          </v-btn> Empleados de {{ cliente.nombreCompleto }}
          <v-spacer></v-spacer>
          <v-text-field v-model="txtBuscar" append-icon="mdi-magnify" label="Buscar" single-line
            hide-details></v-text-field>
        </v-card-title>
        <v-btn class="mb-5" color="rgb(27, 85, 158)" dark @click="editarEmpleado({idEmpleado:0})">
          Agregar
        </v-btn>
        <v-data-table :headers="headers" :items="desserts" :search="txtBuscar">
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
            <v-btn icon color="rgb(27, 85, 158)" v-if="item.indStatusString == 'Activo'">
              <v-icon dark @click="editarEmpleado(item)"> mdi-file-edit-outline </v-icon>
            </v-btn>
            <v-btn icon color="rgb(27, 85, 158)">
              <v-icon dark @click="verEmpleado(item)"> mdi-magnify </v-icon>
            </v-btn>
            <v-btn icon color="red" v-if="item.indStatusString == 'Activo'">
              <v-icon dark @click="activarInactivar(item)"> mdi-delete </v-icon>
            </v-btn>
            <v-btn icon color="light-green" v-if="item.indStatusString == 'Inactivo'">
              <v-icon dark @click="activarInactivar(item)"> mdi-check-bold </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
      <v-form ref="formEmpleado">
        <v-dialog v-model="editEmpleado" max-width="1500" persistent scrollable transition="dialog-bottom-transition"
          min-width="400">
          <v-card v-if="editEmpleado">
            <v-card-title tag="div">
              <v-toolbar color="rgb(26, 58, 103)" dark>
                Empleado
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon dark @click="closeEmpleado()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <h2>Datos Personales</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.nombre" label="Nombre" :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.apellidoPaterno" label="Apellido paterno"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.apellidoMaterno" label="Apellido materno"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.rfc" label="RFC" :disabled="disabledCampos" counter
                    maxlength="13"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.curp" label="CURP" :disabled="disabledCampos" counter
                    maxlength="18"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.correoElectronico" label="Correo electronico"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="persona.telefono" label="Telefono" :disabled="disabledCampos" counter
                    maxlength="10"></v-text-field>
                </v-col>
              </v-row>
              <v-spacer class="line"></v-spacer>
              <h2>Datos Empleado</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="empleado.puesto" label="Puesto" :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <VuetifyMoney v-model="empleado.salario" label="Salario" v-bind:disabled="disabledCampos"
                    v-bind:readonly="readonly" v-bind:outlined="outlined" v-bind:dense="dense"
                    v-bind:clearable="clearable" v-bind:valueWhenIsEmpty="valueWhenIsEmpty" v-bind:options="options"
                    :rules="montoRule"
                    @keyUpNumberTotal="calcularMontoSalarioPrestamo()" ></VuetifyMoney>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <VuetifyMoney v-model="empleado.montoMaximoPrestamo" label="Monto salario prestamo" v-bind:disabled="true"
                    v-bind:valueWhenIsEmpty="valueWhenIsEmpty" v-bind:options="options"
                    :rules="montoRule"></VuetifyMoney>
                </v-col>
              </v-row>
              <v-spacer class="line"></v-spacer>
              <h2>Cuenta bancaria</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="cuentaBancaria.clabeInterbancaria" label="Clabe interbancaria"
                    :disabled="disabledCampos" counter maxlength="18"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="cuentaBancaria.numeroCuenta" label="Numero cuenta"
                    :disabled="disabledCampos" counter maxlength="10"></v-text-field>
                </v-col>
              </v-row>
              <v-spacer class="line"></v-spacer>
              <h2>Domicilio</h2>
              <DomicilioApp ref="domicilio" :isActivo="editEmpleado" :deshabilitar="disabledCampos" :domicilio="domicilio"
                @recuperaDomicilio="domicilio = $event" :cp="domicilio.cp"></DomicilioApp>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col lg="12">
                    <v-btn class="btn ml-2" color="primary" style="float: right;" @click="guardarEmpleado()"
                      v-if="!disabledCampos"> Guardar</v-btn>
                    <v-btn class="btn ml-2" dark color="red" style="float: right;" @click="closeEmpleado()">
                      Cerrar</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import DomicilioApp from '@/componentes/domicilio'
import EmpleadoService from '@/services/empleado.service'
import VuetifyMoney from '@/componentes/VuetifyMoney'
export default {
  components: {
    DomicilioApp,
    VuetifyMoney
  },
  props: {
    cliente: {}
  },
  data () {
    return {
      readonly: false,
      outlined: false,
      dense: false,
      clearable: false,
      valueWhenIsEmpty: '0',
      options: {
        locale: 'es-MX',
        prefix: '$',
        suffix: '',
        length: 18,
        precision: 0
      },

      editEmpleado: false,
      disabledCampos: false,
      txtBuscar: '',
      headers: [{
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'nombreCompleto'
      },
      {
        text: 'RFC',
        align: 'start',
        sortable: false,
        value: 'rfc'
      },
      {
        text: 'Maximo autorizado',
        value: 'montoMaximoPrestamo'
      },
      {
        text: 'Puesto',
        value: 'puesto'
      },
      {
        text: 'Email',
        value: 'email'
      },
      {
        text: 'Telefono',
        value: 'telefono'
      },
      {
        text: 'Creditos activos',
        value: 'totalCredito'
      },
      {
        text: 'Monto creditos activos',
        value: 'montoTotalPrestamo'
      },
      {
        text: 'Estatus',
        value: 'indStatusString'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
      ],
      desserts: [],
      empleado: {},
      domicilio: {},
      persona: {},
      cuentaBancaria: {}
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
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.user = this.currentUser
    this.cargaInicial()
  },
  methods: {
    cargaInicial () {
      EmpleadoService.getEmpleadosByIdCliente(this.cliente.idCliente).then(resp => {
        this.desserts = resp.data.body
      }).catch()
    },
    editarEmpleado (item) {
      EmpleadoService.getEmpleadoById(item.idEmpleado).then(resp => {
        this.empleado = resp.data.body.empleado
        this.persona = resp.data.body.persona
        this.domicilio = resp.data.body.domicilio
        this.cuentaBancaria = resp.data.body.cuentaBancaria
        this.editEmpleado = true
      }).catch(error => {
        console.error(error)
      })
    },
    verEmpleado (item) {
      EmpleadoService.getEmpleadoById(item.idEmpleado).then(resp => {
        this.empleado = resp.data.body.empleado
        this.persona = resp.data.body.persona
        this.domicilio = resp.data.body.domicilio
        this.cuentaBancaria = resp.data.body.cuentaBancaria
        this.editEmpleado = true
        this.disabledCampos = true
      }).catch(error => {
        console.error(error)
      })
    },
    guardarEmpleado () {
      this.$refs.domicilio.recuperaDomicilio()
      this.empleado.idCliente = this.cliente.idCliente
      const resp = {
        empleado: this.empleado,
        persona: this.persona,
        domicilio: this.domicilio,
        cuentaBancaria: this.cuentaBancaria
      }
      EmpleadoService.saveEmpleado(resp).then(resp => {
        this.cargaInicial()
        this.closeEmpleado()
      }).catch(error => {
        console.error(error)
      })
    },

    activarInactivar (item) {
      EmpleadoService.activaInactivaEmpleado(item.idEmpleado).then(resp => {
        this.cargaInicial()
      }).catch(error => {
        console.error(error)
      })
    },
    closeEmpleado () {
      this.empleado = {}
      this.persona = {}
      this.domicilio = {}
      this.cuentaBancaria = {}
      this.editEmpleado = false
      this.editEmpleado = false
      this.disabledCampos = false
      this.$refs.formEmpleado.reset()
    },
    calcularMontoSalarioPrestamo () {
      this.empleado.montoMaximoPrestamo = this.empleado.salario * 0.30
    }
  }

}
</script>
<style scoped>
.v-dialog>.v-card>.v-card__title {
  background: rgb(26, 58, 103) !important;
  padding: 0 !important;
}
</style>
<style>
.theme--light.v-data-table.v-data-table--fixed-header thead th{
  background: rgb(26, 58, 103) !important;
}</style>
