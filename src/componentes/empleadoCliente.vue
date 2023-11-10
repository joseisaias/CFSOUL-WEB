<template>
  <div>
    <v-card>
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
        <v-row>
          <v-col lg="3">
            <v-file-input  v-model="selectedFile" @change="leerDocumento()"
              label="Cargar Empleados" accept=".xlsx"></v-file-input>
          </v-col>
          <v-col lg="2" style="padding-top: 20px;">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <a v-bind="attrs" v-on="on" href="./assets/cargaEmpleado.xlsx" download="Carga_Empleados"><v-icon x-large color="rgb(27, 85, 158)" dark>mdi mdi-file-excel</v-icon></a>
              </template>
              <span>Descarga Plantilla Empleados</span>
            </v-tooltip>
          </v-col>
        </v-row>
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
            <v-btn icon color="rgb(27, 85, 158)">
            <v-icon dark @click="verCreditos(item)"> mdi mdi-finance </v-icon>
            </v-btn>
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
                    maxlength="13" :rules="rfcRule"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.curp" label="CURP" :disabled="disabledCampos" counter
                    maxlength="18"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.correoElectronico" label="Correo electronico"
                    :disabled="disabledCampos" :rules="correoRule"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="persona.telefono" label="Telefono" :disabled="disabledCampos"  counter maxlength="10" :rules="telefonoRule"></v-text-field>
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
                  <VuetifyMoney v-model="empleado.montoMaximoPrestamo" label="Monto salario préstamo" v-bind:disabled="true"
                    v-bind:valueWhenIsEmpty="valueWhenIsEmpty" v-bind:options="options"
                    :rules="montoRule"></VuetifyMoney>
                </v-col>
              </v-row>
              <v-spacer class="line"></v-spacer>
              <h2>Cuenta bancaria</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="cuentaBancaria.clabeInterbancaria" label="Clabe interbancaria"
                    :disabled="disabledCampos" counter maxlength="18" :rules="clvIntRule"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="cuentaBancaria.numeroCuenta" label="Numero cuenta"
                    :disabled="disabledCampos" counter maxlength="10" :rules="numCueRule"></v-text-field>
                </v-col>
              </v-row>
              <v-spacer class="line" v-if="!editExcel"></v-spacer>
              <h2 v-if="!editExcel">Domicilio</h2>
              <DomicilioApp v-if="!editExcel" ref="domicilio" :isActivo="editEmpleado" :deshabilitar="disabledCampos" :domicilio="domicilio"
                @recuperaDomicilio="domicilio = $event" :cp="domicilio.cp"></DomicilioApp>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col lg="12">
                    <v-btn class="btn ml-2" color="primary" style="float: right;" @click="guardarEmpleado()"
                      v-if="!disabledCampos && !editExcel"> Guardar</v-btn>
                    <v-btn class="btn ml-2" color="primary" style="float: right;" @click="guardarExcel()"
                      v-if="editExcel"> Guardar Dato</v-btn>
                    <v-btn class="btn ml-2" dark color="red" style="float: right;" @click="closeEmpleado()">
                      Cerrar</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
      <v-dialog v-model="cargaExcelDialog" persistent>
        <v-card>
          <v-card-title tag="div">
              <v-toolbar color="rgb(26, 58, 103)" dark>
                Empleados Excel
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon dark @click="cargaExcelDialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
            </v-card-title>
          <v-card-text>
            <br/>
            <v-alert dense outlined type="error" v-if="numErroresExcel > 0">
              Se encontraron  <strong>{{ numErroresExcel }}</strong> errores en el documento
            </v-alert>
            <v-alert dense outlined type="error"  v-if="empleadosRegistrados">
              Los siguientes usuarios ya se encuentran registrados para otro cliente
            </v-alert>
            <br/>
            <v-data-table :headers="headersCliente" :items="listEmpleadosExcel">
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
          <template v-slot:[`item.persona.rfc`]="{ item }">
            <v-chip color="red" dark v-if="item.errores.rfc">
              {{ item.persona.rfc }}
            </v-chip>
            <span v-else>{{ item.persona.rfc }}</span>
          </template>
          <template v-slot:[`item.persona.curp`]="{ item }">
            <v-chip color="red" dark v-if="item.errores.curp">
              {{ item.persona.curp }}
            </v-chip>
            <span v-else>{{ item.persona.curp }}</span>
          </template>
          <template v-slot:[`item.persona.correoElectronico`]="{ item }">
            <v-chip color="red" dark v-if="item.errores.correoElectronico">
              {{ item.persona.correoElectronico }}
            </v-chip>
            <span v-else>{{ item.persona.correoElectronico }}</span>
          </template>
          <template v-slot:[`item.cuentaBancaria.clabeInterbancaria`]="{ item }">
            <v-chip color="red" dark v-if="item.errores.clabeInterbancaria">
              {{ item.cuentaBancaria.clabeInterbancaria }}
            </v-chip>
            <span v-else>{{ item.cuentaBancaria.clabeInterbancaria }}</span>
          </template>
          <template v-slot:[`item.cuentaBancaria.numeroCuenta`]="{ item }">
            <v-chip color="red" dark v-if="item.errores.numeroCuenta">
              {{ item.cuentaBancaria.numeroCuenta }}
            </v-chip>
            <span v-else>{{ item.cuentaBancaria.numeroCuenta }}</span>
          </template>
          <template v-slot:[`item.actions`]="{item}">
            {{ item.numError }}
            <v-btn icon color="rgb(27, 85, 158)">
              <v-icon dark @click="editarEmpleadoExcel(item)"> mdi-file-edit-outline </v-icon>
            </v-btn>
            <v-btn icon color="red">
              <v-icon dark @click="deleteItemExcel(item)"> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="numErroresExcel > 0" @click="guardarEmpleadosExcel()">Cargar Empleados</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="estadoCuenta">
        <EstadoCuenta :idEmpleadoProps="idEmpleado"/>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import DomicilioApp from '@/componentes/domicilio'
import EstadoCuenta from '@/componentes/estadoCuenta'
import EmpleadoService from '@/services/empleado.service'
import VuetifyMoney from '@/componentes/VuetifyMoney'

import * as XLSX from 'xlsx/xlsx.mjs'
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs'
/* load 'stream' for stream support */
import { Readable } from 'stream'

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs'
XLSX.set_fs(fs)

XLSX.stream.set_readable(Readable)

/* load the codepage support library for extended support with older formats  */

XLSX.set_cptable(cpexcel)

export default {
  components: {
    DomicilioApp,
    VuetifyMoney,
    EstadoCuenta
  },
  props: {
    cliente: {}
  },
  data () {
    return {
      idEmpleado: null,
      estadoCuenta: false,
      numErroresExcel: 0,
      readonly: false,
      empleadosRegistrados: false,
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
      headersCliente: [{
        text: 'Nombre',
        value: 'persona.nombre'
      },
      {
        text: 'Primer Apellido',
        value: 'persona.apellidoPaterno'
      },
      {
        text: 'Segundo Apellido',
        value: 'persona.apellidoMaterno'
      },
      {
        text: 'RFC',
        value: 'persona.rfc'
      },
      {
        text: 'CURP',
        value: 'persona.curp'
      },
      {
        text: 'Email',
        value: 'persona.correoElectronico'
      },
      {
        text: 'Tel',
        value: 'persona.telefono'
      },
      {
        text: 'Salario',
        value: 'empleado.salario'
      },
      {
        text: 'Puesto',
        value: 'empleado.puesto'
      },
      {
        text: 'Clave Interbancaria',
        value: 'cuentaBancaria.clabeInterbancaria'
      },
      {
        text: 'Número Cuenta',
        value: 'cuentaBancaria.numeroCuenta'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }],
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
        text: 'Máximo autorizado',
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
        text: 'Teléfono',
        value: 'telefono'
      },
      {
        text: 'Créditos activos',
        value: 'totalCredito'
      },
      {
        text: 'Monto créditos activos',
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
      itemExcel: {},
      empleado: {},
      domicilio: {},
      persona: {},
      cuentaBancaria: {},
      selectedFile: {},
      listEmpleadosExcel: [],
      cargaExcelDialog: false,
      editExcel: false,
      clvIntRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && (v+'').length == 18) || 'El campo debe tener 18 digitos.'],
      numCueRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && (v+'').length == 10) || 'El campo debe tener 10 digitos.'],
      correoRule: [v => !!v || 'El campo es requerido.', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electronico'],
      rfcRule: [v => !!v || 'El campo es requerido.', v => /^([A-Za-zÑñ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Za-z\d]{2})([A\d])$/.test(v) || 'El RFC es invalido'],
      telefonoRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && v.length == 10) || 'El campo debe tener 10 digitos.'],
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
    leerDocumento () {
      const v = this
      this.listEmpleadosExcel = []
      this.numErroresExcel = 0
      const fileReader = new FileReader ()
      fileReader.onload = function (event) {
        const data = event.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        workbook.SheetNames.forEach(sheet => {
          const rowObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          )
          v.llenarExcel(rowObject, v)
          v.cargaExcelDialog = true
          v.empleadosRegistrados = false
        })
      }
      fileReader.readAsBinaryString(this.selectedFile)
    },
    llenarExcel (list, v) {
      list.forEach(item => {
        const reg = {
          errores: {
            rfc: false,
            curp: false,
            correoElectronico: false,
            clabeInterbancaria: false,
            numeroCuenta: false
          },
          persona: {
            nombre: item.Nombre,
            apellidoPaterno: item.Primer_Apellido,
            apellidoMaterno: item.Segundo_Apellido,
            rfc: item.RFC!=undefined && item.RFC!= null ? item.RFC.toUpperCase() : item.RFC,
            curp: item.CURP!=undefined && item.CURP!= null ? item.CURP.toUpperCase() : item.CURP,
            correoElectronico: item.Email.toLowerCase(),
            telefono: item.Telefono
          },
          empleado: {
            idCliente: this.cliente.idCliente,
            puesto: item.Puesto,
            salario: item.Salario,
            montoMaximoPrestamo: item.Salario * 0.30
          },
          cuentaBancaria: {
            clabeInterbancaria: item.Cuenta_Bancaria,
            numeroCuenta: item.Numero_cuenta
          },
          domicilio: {
            cp: null,
            calle: null,
            numeroExterior: null,
            numeroInterior: null,
            colonia: null
          }
        }
        var numError = 0
        if (isNaN(Number(reg.cuentaBancaria.numeroCuenta)) || !( (reg.cuentaBancaria.numeroCuenta + '').length === 10)) {
          reg.errores.numeroCuenta = true
          this.numErroresExcel++
          numError++
        }
        if (isNaN(Number(reg.cuentaBancaria.clabeInterbancaria)) || !((reg.cuentaBancaria.clabeInterbancaria + '').length === 18)) {
          reg.errores.clabeInterbancaria = true
          this.numErroresExcel++
          numError++
        }
        if (!this.rfcValido(reg.persona.rfc)) {
          reg.errores.rfc = true
          this.numErroresExcel++
          numError++
        }
        if(!this.curpValida(reg.persona.curp)) {
          reg.errores.curp = true
          this.numErroresExcel++
        }
        if(!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(reg.persona.correoElectronico))){
          reg.errores.correoElectronico = true
          this.numErroresExcel++
          numError++
        }
        reg.numError = numError
        v.listEmpleadosExcel.push(reg)
      })
    },
    reduceErrores(item){
      if (item.errores.numeroCuenta) {
        item.errores.numeroCuenta = false
        this.numErroresExcel--
      }
      if (item.errores.clabeInterbancaria) {
        item.errores.clabeInterbancaria = false
        this.numErroresExcel--
      }
      if (item.errores.rfc) {
        item.errores.rfc = false
        this.numErroresExcel--
      }
      if(item.errores.curp) {
        item.errores.curp = false
        this.numErroresExcel--
      }
      if(item.errores.correoElectronico) {
        item.errores.correoElectronico = false
        this.numErroresExcel--
      }
      item.numError = 0
    },
    deleteItemExcel (item) {
      const editedIndex = this.listEmpleadosExcel.indexOf(item)
      this.reduceErrores(this.listEmpleadosExcel[editedIndex])
      this.listEmpleadosExcel.splice(editedIndex, 1)
    },
    editarEmpleadoExcel (i) {
      let item = {}
      if(this.listEmpleadosExcel.length > 1){
        let editedIndex = this.listEmpleadosExcel.indexOf(i);

        if(editedIndex == undefined || editedIndex == null )
          return;
        if(editedIndex === -1)
          item = this.listEmpleadosExcel.find((it) => it.persona.rfc === i.persona.rfc);
        else
          item = this.listEmpleadosExcel[editedIndex]
        if(item == undefined || item == null )
          return;
      } else {
        item = this.listEmpleadosExcel[0]
      }

      this.itemExcel = item

      this.empleado = item.empleado
      this.persona = item.persona
      this.domicilio = item.domicilio
      this.cuentaBancaria = item.cuentaBancaria

      this.editEmpleado = true
      this.editExcel = true
      this.$refs.formEmpleado.validate()
    },
    guardarExcel () {
      if(this.$refs.formEmpleado.validate()){
        this.reduceErrores(this.itemExcel)
        this.closeEmpleado()
      }
    },
    guardarEmpleadosExcel () {
      EmpleadoService.guardarEmpleadosExcel(this.listEmpleadosExcel).then(resp => {
        this.listEmpleadosExcel = [];
        if(resp.data.body.length > 0){
          this.listEmpleadosExcel = resp.data.body
          this.empleadosRegistrados = true
        } else {
          this.cargaInicial()
          this.closeEmpleado()
          this.cargaExcelDialog = false
        }
      }).catch(error => {
        console.error(error)
      })
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
    },

    verCreditos(item){
      this.idEmpleado = item.idEmpleado
      this.estadoCuenta = true
    },

    rfcValido(rfc, aceptarGenerico = true) {
      const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
      var validado = rfc.match(re);

      if (!validado)  //Coincide con el formato general del regex?
        return false;
      else
        return true
/*
      //Separar el dígito verificador del resto del RFC
      const digitoVerificador = validado.pop(),
        rfcSinDigito = validado.slice(1).join(''),
        len = rfcSinDigito.length,

        //Obtener el digito esperado
        diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
        indice = len + 1;
      var suma, digitoEsperado;

      if (len == 12) suma = 0
      else suma = 481; //Ajuste para persona moral

      for (var i = 0; i < len; i++)
        suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
      digitoEsperado = 11 - suma % 11;
      if (digitoEsperado == 11) digitoEsperado = 0;
      else if (digitoEsperado == 10) digitoEsperado = "A";

      //El dígito verificador coincide con el esperado?
      // o es un RFC Genérico (ventas a público general)?
      if ((digitoVerificador != digitoEsperado)
        && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
        return false;
      else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
        return false;
      return rfcSinDigito + digitoVerificador;*/
    },
    curpValida(curp) {
      var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
      var validado = curp.match(re);

      if (!validado)  //Coincide con el formato general?
        return false;
      else
        return true
      /*
      //Validar que coincida el dígito verificador
      function digitoVerificador(curp17) {
        var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
          lngSuma = 0.0,
          lngDigito = 0.0;
        for (var i = 0; i < 17; i++)
          lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - lngSuma % 10;
        if (lngDigito == 10) return 0;
        return lngDigito;
      }

      if (validado[2] != digitoVerificador(validado[1]))
        return false;

      return true; //Validado
      */
    },
    cargaInicial () {
      EmpleadoService.getEmpleadosByIdCliente(this.cliente.idCliente).then(resp => {
        this.desserts = resp.data.body
      }).catch()
    },
  },
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
  }
</style>
