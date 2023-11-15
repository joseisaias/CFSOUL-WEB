<template>
  <div>
    <v-card >
      <div class="ml-2 mr-2">
        <v-card-title>
          Cliente
          <v-spacer></v-spacer>
          <v-text-field v-model="txtBuscar" append-icon="mdi-magnify" label="Buscar" single-line
            hide-details></v-text-field>
        </v-card-title>
        <v-btn class="mb-5" color="rgb(27, 85, 158)" dark @click="editarCliente(null, false)">
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
            <v-btn icon color="rgb(27, 85, 158)" v-if="item.indStatusString == 'Activo'" @click="consultaEmpleados(item)">
              <v-icon dark> mdi mdi-account-multiple </v-icon>
            </v-btn>
            <v-btn icon color="rgb(27, 85, 158)" v-if="item.indStatusString == 'Activo'">
              <v-icon dark @click="editarCliente(item, false)"> mdi-file-edit-outline </v-icon>
            </v-btn>
            <v-btn icon color="rgb(27, 85, 158)">
              <v-icon dark @click="editarCliente(item, true)"> mdi-magnify </v-icon>
            </v-btn>
            <v-btn icon color="red" v-if="item.indStatusString == 'Activo'">
              <v-icon dark @click="borradoLogico(item)"> mdi-delete </v-icon>
            </v-btn>
            <v-btn icon color="light-green" v-if="item.indStatusString == 'Inactivo'">
              <v-icon dark @click="borradoLogico(item)" > mdi-check-bold </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>

    </v-card>
    <v-dialog v-model="editCliente" max-width="1500" persistent scrollable transition="dialog-bottom-transition" min-width="400">
      <v-card>
        <v-card-title tag="div">
          <v-toolbar color="rgb(26, 58, 103)" dark>
            Editar Cliente
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click="closeCliente()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height: 200px; max-height: 500px;" id="scrollDialog" class="scrollTop">
          <v-form ref="formCliente">
            <v-container>
              <h2>Datos Personales</h2>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="cliente.idTipoPersona" :items="catTipoPersona" item-value="idCat"
                    item-text="descripcion" label="Tipo persona" :disabled="disabledCampos" :rules="isRequeridoRule" @blur="cambioRazonSocial()"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="isPersonaFisica != null && !isPersonaFisica">
                  <v-text-field v-model="cliente.razonSocial" label="Razón Social"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="isPersonaFisica != null && isPersonaFisica">
                  <v-text-field v-model="cliente.nombre" label="Nombre" :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="isPersonaFisica != null && isPersonaFisica">
                  <v-text-field v-model="cliente.apellidoPaterno" label="Apellido paterno"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="isPersonaFisica != null && isPersonaFisica">
                  <v-text-field v-model="cliente.apellidoMaterno" label="Apellido materno"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="isPersonaFisica != null">
                  <v-text-field v-model="cliente.rfc" label="RFC" :disabled="disabledCampos"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="cliente.idTipoSociedad" :items="catTipoSociedad" item-value="idCat"
                    item-text="descripcion" label="Tipo sociedad" :disabled="disabledCampos"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu ref="fechaInicioOp" v-model="fechaInicioOp" :close-on-content-click="false"
                    :return-value.sync="cliente.fechaInicioOperacion" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="cliente.fechaInicioOperacion" label="Fecha inicio de operaciones"
                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                        :disabled="disabledCampos"></v-text-field>
                    </template>
                    <v-date-picker v-model="cliente.fechaInicioOperacion" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="fechaInicioOp = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.fechaInicioOp.save(cliente.fechaInicioOperacion)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu ref="fechaReg" v-model="fechaReg" :close-on-content-click="false"
                    :return-value.sync="cliente.fechaInicioRegistro" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="cliente.fechaInicioRegistro" label="Fecha inicio de registro"
                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                        :disabled="disabledCampos"></v-text-field>
                    </template>
                    <v-date-picker v-model="cliente.fechaInicioRegistro" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="fechaReg = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.fechaReg.save(cliente.fechaInicioRegistro)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="cliente.idActividad" :items="catActividad" item-value="idCat" item-text="descripcion"
                    label="Actividad" :disabled="disabledCampos" @change="selectCatActividad()"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="cliente.idGiro" :items="catGiro" item-value="idCat" item-text="descripcion"
                    label="Giro" :disabled="catGiro.length == 0 && disabledCampos" ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="cliente.idEstablecimiento" :items="catEstablecimiento" item-value="idCat"
                    item-text="descripcion" label="Establecimiento" :disabled="disabledCampos"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="cliente.paginaWeb" label="Página Web" :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="cliente.telefono" label="Teléfono" counter maxlength="10" :rules="telefonoRule"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="cliente.email" label="Email" :rules="correoRule"
                    :disabled="disabledCampos"></v-text-field>
                </v-col>
              </v-row>
              <br />
              <v-divider></v-divider>
              <br />
              <h2>Domicilio Fiscal</h2>
              <DomicilioApp ref="domicilioFiscalForm" :isActivo="editCliente" :deshabilitar="disabledCampos" :domicilio="domicilioFiscal"
                @recuperaDomicilio="domicilioFiscal = $event" :cp="domicilioFiscal.cp+''"></DomicilioApp>
              <v-divider></v-divider>
              <h2>Domicilio Comercial</h2>
              <DomicilioApp ref="domicilioComercialForm" :isActivo="editCliente" :deshabilitar="disabledCampos" :domicilio="domicilioComercial"
                @recuperaDomicilio="domicilioComercial = $event" :cp="domicilioComercial.cp+''"
                ></DomicilioApp>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
            <v-col lg="12">
              <v-btn class="btn ml-2" color="primary" style="float: right;" @click="guardarCliente()"
                v-if="!disabledCampos"> Guardar</v-btn>
              <v-btn class="btn ml-2" dark color="red" style="float: right;" @click="closeCliente()"> Cerrar</v-btn>
            </v-col>
          </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import DomicilioApp from '@/componentes/domicilio'

import CatGeneralService from '@/services/catGeneral.service'
import ClienteService from '@/services/cliente.service'
const $ = require('jquery');
export default {
  name: 'clientesApi',
  components: {
    DomicilioApp
  },
  data() {
    return {
      editCliente: false,
      disabledCampos: false,
      fechaInicioOp: false,
      fechaReg: false,
      txtBuscar: '',
      headers: [{
        text: 'Razón social',
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
        text: 'Tipo de sociedad',
        value: 'tipoSociedad'
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
      catTipoSociedad: [],
      catTipoPersona: [],
      catActividad: [],
      catEstablecimiento: [],
      catGiro: [],
      cliente: {},
      domicilioFiscal: {},
      domicilioComercial: {},
      catTipoDomCom: {},
      catTipoDomFis: {},
      correoRule: [v => !!v || 'El campo es requerido.', v => /.+@.+\..+/.test(v) || 'El campo no corresponde a un correo electronico'],
      isRequeridoRule: [v => !!v || 'El campo es requerido.'],
      telefonoRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && v.length == 10) || 'El campo debe tener 10 digitos.'],
    }
  },
  computed: {
    isPersonaFisica() {
      let id = this.cliente.idTipoPersona;
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
  mounted() {
    ClienteService.getClientes().then(resp => {
      this.desserts = resp.data.body
    }).catch(error => {
      console.error(error);
    })

    CatGeneralService.getCatSelect(this.$CAT_MAES.TIP_PER).then(resp => {
      this.catTipoPersona = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo persona', error)
    });
    CatGeneralService.getCatSelect(this.$CAT_MAES.TIP_SOC).then(resp => {
      this.catTipoSociedad = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo sociedad', error)
    });
    CatGeneralService.getCatSelect(this.$CAT_MAES.TIP_ACT).then(resp => {
      this.catActividad = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo actividad', error)
    });
    CatGeneralService.getCatSelect(this.$CAT_MAES.TIP_ESTAB).then(resp => {
      this.catEstablecimiento = resp.data.body;
    }).catch(error => {
      console.error('Error al obtener tipo establecimiento', error)
    });


    CatGeneralService.getCatDetalleByClave(this.$CAT_DET.TIP_DOM_COM).then(resp => {
      this.catTipoDomCom = resp.data.body[0]
    }).catch(err => {
      console.error(err)
    });
    CatGeneralService.getCatDetalleByClave(this.$CAT_DET.TIP_DOM_FIS).then(resp => {
      this.catTipoDomFis = resp.data.body[0]
    }).catch(err => {
      console.error(err)
    });


  },
  methods: {
    selectCatActividad(){
      this.cliente.idGiro = 0;
      CatGeneralService.getCatSelectIdCatPadre(this.$CAT_MAES.TIP_GIRO, this.cliente.idActividad).then(resp => {
        this.catGiro = resp.data.body;
      }).catch(error => {
        console.error('Error al obtener tipo giro', error)
      });

    },
    editarCliente(item, disabled) {
      this.cliente = {};
      this.domicilioFiscal = {};
      this.domicilioComercial = {};
      this.disabledCampos = disabled;
      if (item != undefined && item != null) {
        ClienteService.getClienteById(item).then(resp => {
          let data = resp.data.body;
          this.cliente = data.cliente;
          this.domicilioFiscal = data.domicilioFiscal;
          this.domicilioComercial = data.domicilioComercial;
          this.domicilioComercial.idTipoDomicilio = this.catTipoDomCom.idCatDetalle;
          this.domicilioFiscal.idTipoDomicilio = this.catTipoDomFis.idCatDetalle;

          this.editCliente = true;
        }).catch(error => {
          console.error(error);
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error al obtener el registro.'
          })
        })
      } else {
        this.editCliente = true;
        this.domicilioFiscal = {idDomicilio:null, idCatDomicilio:null, cp:'', entidadFederativa:'', municipio:'', colonia:'', calle:'', numeroExterior:'', numeroInterior:''}
        this.domicilioComercial = {idDomicilio:null, idCatDomicilio:null, cp:'', entidadFederativa:'', municipio:'', colonia:'', calle:'', numeroExterior:'', numeroInterior:''}
      }
    },
    borradoLogico(item){
      ClienteService.borradoLogico(item).then(resp => {
        this.desserts = resp.data.body
        }).catch(error => {
          console.error(error);
          this.$toasts.push({
            type: 'error',
            message: 'Ocurrio un error al borrar el registro.'
          })
        })
    },
    guardarCliente() {
      this.$refs.domicilioFiscalForm.recuperaDomicilio();
      this.$refs.domicilioComercialForm.recuperaDomicilio();
      this.domicilioComercial.idTipoDomicilio = this.catTipoDomCom.idCatDetalle;
      this.domicilioFiscal.idTipoDomicilio = this.catTipoDomFis.idCatDetalle;
        let usuarioRequest = {
          domicilioFiscal: this.domicilioFiscal,
          domicilioComercial: this.domicilioComercial,
          cliente: this.cliente
        }
        let validacion = this.$refs.formCliente.validate();
        if(validacion){
          ClienteService.saveClient(usuarioRequest).then(resp => {
            var success = resp.data.status.success
            if (success) {
              this.$toasts.push({
                type: 'info',
                message: 'Registro guardado exitosamente.'
              });
              this.closeCliente();
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
    closeCliente() {
      this.$refs.domicilioFiscalForm.resetForm();
      this.$refs.domicilioComercialForm.resetForm();
      this.$refs.formCliente.reset();
      this.cliente = {};
      document.getElementById("scrollDialog").scrollTop = 0;
      this.editCliente = false;
    },
    consultaEmpleados(item){
      this.$emit('subSelect', { subSelect:'empleado', cliente: item })
    },
    cambioRazonSocial() {
      this.cliente.razonSocial = null;
      this.cliente.nombre = null;
      this.cliente.apellidoMaterno = null;
      this.cliente.apellidoPaterno = null;
    }
  }
}
</script>
<style scoped>
.v-dialog>.v-card>.v-card__title{
  background: rgb(26, 58, 103) !important;
  padding: 0 !important;
}
</style>
