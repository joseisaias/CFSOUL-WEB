<template>
  <div>
    <v-card >
      <div class="ml-2 mr-2">
        <v-card-title tag="div" style="padding-bottom: 50px;">
          Solicitud de crédito
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
          <v-col xs="5" sm="5" md="5" lg="5" xl="5" >
            <v-form ref="form">
              <v-row>
                <v-col offset="1" cols="10">
                  <v-text-field label="Monto" v-model.number="montoAux" @blur="validaMonto()" clearable>
                  </v-text-field>
                </v-col>
                <v-col offset="1" cols="10">
                  <v-slider label="Monto" v-model="monto" track-color="grey" always-dirty thumb-label="always" v-if="montoMaximo >= montoMinimo"
                    thumb-size="40" :min="montoMinimo" :step="stepMonto" :max="montoMaximo">
                  </v-slider>
                </v-col>
                <v-col offset="1" cols="10">
                  <div style="text-align: center; width: 100%; padding-bottom: 40px; font-size: 18px;">
                    <label>Plazo <span style="font-weight: bold;">{{ periodo }}</span> Quincenas</label>
                  </div>
                  <v-slider label="Periodicidad" v-model="periodo" track-color="grey" always-dirty thumb-label="always"
                    ticks :min="minPeriodo" :max="maxPeriodo"></v-slider>
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col offset="1" cols="4" style="font-weight: bold;"> Ingreso mensual </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px; font-weight: bold;">{{ salario | currencyredondeo }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> Préstamo </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ monto | currencyredondeo }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> Plazo </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ periodo }} Quincenas</span> </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> Interés </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ interes - (interes * .16)  | currency }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> IVA </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ (interes * .16) | currency }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> CAT </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;"> {{ montoCAT | formatoPorcentaje  }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> Comisión por disposición (2.5%)</v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;"> {{ comision | currency  }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> Monto recibido</v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;"> {{ (monto - comision)| currency  }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> <span style="font-weight: bold;">Pago Total:</span> </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px; font-weight: bold;">{{ (pagoTotal + comision) | currency }}</span> </v-col>              
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
          </v-col>
          <v-col xs="6" sm="6" md="6" lg="6" xl="6" style="margin-top: -110px;" v-if="tablaAmortizacionDialog">
            <div class="v-card__title" style="padding-bottom: 50px;">
              Tabla de amortización
            </div>
            <v-data-table height="105vh" fixed-header :headers="headerAmortizacion" :items-per-page="36"
              :server-items-length="36" :hide-default-footer="true" :items="tablaAmortizacion">
              <template v-slot:[`item.saldoInicial`]="{ item }">
                {{ item.saldoInicial | currency }}
              </template>
              <template v-slot:[`item.cuota`]="{ item }">
                {{ item.cuota | currency }}
              </template>
              <template v-slot:[`item.pagoInteres`]="{ item }">
                {{ item.pagoInteres | currency }}
              </template>
              <template v-slot:[`item.pagoCapital`]="{ item }">
                {{ item.pagoCapital | currency }}
              </template>
              <template v-slot:[`item.saldoFinal`]="{ item }">
                {{ item.saldoFinal | currency }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>

      </div>
      <v-card-actions style="padding: 30px;">
        <v-btn dark color="primary" @click="guardarSolicitud()"  v-if="montoMaximo >= montoMinimo">SOLICITAR CRÉDITO</v-btn>
        <v-btn dark color="primary" @click="tablaAmortizacionDialog = true"  v-if="montoMaximo >= montoMinimo">tabla de amortización</v-btn>
        <v-btn dark color="red" @click="limpiarCotizacion();">Limpiar</v-btn>
      </v-card-actions>
    </v-card>
    <span style="display: none;">{{ cambiaValorMonto }}</span>
  </div>
</template>
<script>
/* eslint-disable */
import CatGeneralService from '@/services/catGeneral.service'
import SolicitudService from '@/services/solicitud.service'
import { Finance } from 'financejs'
export default {
  components: {
  },
  props: {
    cliente: {}
  },
  data() {
    return {
      montoCAT: 0, // Nueva variable para almacenar el CAT
      costosAdicionales: 0, // para agregar algun costo adicional al CAT
      tablaAmortizacionDialog: false,
      idPersona: 0,
      periodo: 0,
      monto: 0,
      montoAux: 0,
      salario: 0,
      interesAnual: 0,
      interesDiario: 0,
      interesApicable: 0,
      valorAux: 0,
      comision:0,
      montoMaximo: 1000,
      montoMinimo: 100,
      stepMonto: 50,
      minPeriodo: 6,
      maxPeriodo: 24,
      calendario: [],
      idEstatusPorPagar: 0,
      idTipoPagoQuincenal: 0,
      idEstatusAdeudo: 0,
      headerAmortizacion: [{
        text: '# Pago',
        align: 'center',
        sortable: false,
        value: 'numPago'
      },
      {
        text: 'Saldo Inicial',
        align: 'center',
        sortable: false,
        value: 'saldoInicial'
      },
      {
        text: 'Cuota',
        align: 'center',
        sortable: false,
        value: 'cuota'
      },
      {
        text: 'Interés',
        align: 'center',
        sortable: false,
        value: 'pagoInteres'
      },
      /*{
        text: 'IVA',
        align: 'center',
        sortable: false,
        value: 'pagoInteres'
      },*/
      {
        text: 'Capital',
        align: 'center',
        sortable: false,
        value: 'pagoCapital'
      },
      {
        text: 'Saldo final',
        align: 'center',
        sortable: false,
        value: 'saldoFinal'
      }
      ]
    }
  },
  computed: {
    cambiaValorMonto() {
      this.montoAux = this.monto
      this.comision = (this.monto/100)*2.5
      return true
    },
    currentUser() {
      const user = this.$store.state.auth.user
      return user
    },
    montoRule() {
      const aux = [v => !!v || 'El campo es requerido.']
      return aux
    },
    interes() {
      let interes = 0
      this.tablaAmortizacion.forEach(element => {
        interes = interes + element.pagoInteres
      })
      return interes
    },
    pagoTotal() {
      let montoTotal = 0
      this.tablaAmortizacion.forEach(element => {
        montoTotal = montoTotal + element.cuota
      })
      return montoTotal
    },
    tablaAmortizacion() {
      const tbl = []
      const prestamo = this.monto-this.comision;
      const pagoCapital = prestamo / this.periodo
      let capitalRestante = prestamo
      for (let i = 0; i < this.periodo; i++) {
        const capitalRestanteFin = capitalRestante - pagoCapital
        const interes = Number((((this.interesDiario * capitalRestante) * this.calendario[i].totalDias) * this.valorAux / 1).toFixed(3))
        const obj = {
          numPago: i + 1,
          totalDias: this.calendario[i].totalDias,
          fechaPago: this.calendario[i].fecha,
          pagoCapital: pagoCapital,
          pagoInteres: interes,
          saldoFinal: capitalRestanteFin,
          saldoInicial: capitalRestante,
          idEstatusPago: this.idEstatusPorPagar
        }
        obj.cuota = obj.pagoCapital + obj.pagoInteres
        tbl.push(obj)
        capitalRestante = capitalRestanteFin
      }
      return tbl
    }
  },
  mounted() {

    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.cargaInicial()
    this.obtenerTablaCalendario()
    this.obtenerSalarioEmpleado()
    this.obtenMontoMaximo()
    this.calcularCAT()
  },
  methods: {
    calcularMontoMinimo(){
      const valor = this.currentUser.info.empleadoSelect.montominimoPrestamo
      if(this.currentUser.info.empleadoSelect.porcentajeMontoMinPrestamo) {
        this.montoMinimo = (valor / 100) * this.montoMaximo
      } else {
        this.montoMinimo = valor;
      }
      this.monto = this.montoMinimo
      this.montoAux = this.montoMinimo
    },
       
    calcularTIR() {
      const finance = new Finance();
      const prestamo = this.comision-this.monto;
      const cuota = [prestamo];
     this.tablaAmortizacion.forEach(element => {
        cuota.push(element.cuota);
      });
     //const cuotab = [-975,193.33,187.51,184.45,179.17,174.45,170.83];
     //console.log(cuota);
     //console.log(cuotab);
      //calculo TIR
      return finance.IRR(...cuota);
      },

    limpiarCotizacion() {
      this.$confirm(
        {
          message: '¿Está seguro de limpiar el formulario?',
          button: { no: 'No', yes: 'Sí' },
          callback: confirm => { if (confirm) { this.$refs.form.reset(); this.tablaAmortizacionDialog = false} }
        }
      )
    },
    cargaInicial() {

      /*CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MONTO_MIN).then(resp => {
        this.montoMinimo = resp.data.body[0].descripcion
        this.monto = this.montoMinimo
        this.montoAux = this.montoMinimo
      }).catch()*/

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_STEP_MONTO).then(resp => {
        this.stepMonto = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MIN_PERIODO).then(resp => {
        this.minPeriodo = resp.data.body[0].descripcion
        this.periodo = this.minPeriodov
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MAX_PERIODO).then(resp => {
        this.maxPeriodo = (resp.data.body[0].descripcion <= 24) ? resp.data.body[0].descripcion : 24;
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_TASA_INTERES_ANUAL).then(resp => {
        this.interesAnual = resp.data.body[0].descripcion
        this.interesDiario = this.interesAnual / 360 / 100
        // Number(( / 1).toFixed(3).replace(',', '.'))
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_TASA_INTERES_APLICABLE).then(resp => {
        this.interesApicable = resp.data.body[0].descripcion / 100
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_AUX).then(resp => {
        this.valorAux = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.ESTATUS_POR_PAGAR).then(resp => {
        this.idEstatusPorPagar = resp.data.body[0].idCatDetalle
      }).catch()
      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.ESTATUS_BIT_ADEUDO).then(resp => {
        this.idEstatusAdeudo = resp.data.body[0].idCatDetalle
      }).catch()
      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.TIPO_PAGO_QUINCENAL).then(resp => {
        this.idTipoPagoQuincenal = resp.data.body[0].idCatDetalle
      }).catch()
    },

    obtenMontoMaximo() {
      SolicitudService.obtenerMontoMaximo(this.currentUser.info.empleadoSelect.idEmpleado).then(resp => {
        this.montoMaximo= this.currentUser.info.empleadoSelect.montoMaximoPrestamo - resp.data.body
        //console.log(resp.data.body);
        this.calcularMontoMinimo()
      }).catch(
        error => {
          this.$toasts.push({ type: 'error', message: 'Ocurrio un error al obtener el monto máximo.' })
          console.log('Ocurrio un error al obtener el monto máximo', error)
        }
      );
    },
    obtenerSalarioEmpleado() {
      this.salario = this.currentUser.info.empleadoSelect.salario;
    },
    guardarSolicitud() {
      this.$confirm(
        {
          message: '¿Está seguro de solicitar el credito?',
          button: { no: 'No', yes: 'Sí' },
          callback: confirm => {
            if (confirm) {
              var solicitudRequest = {
                tablaAmortizacion: this.tablaAmortizacion,
                credito: {
                  idEmpleado: this.currentUser.info.empleadoSelect.idEmpleado,
                  idEstatusCredito: this.idEstatusAdeudo,
                  idTipoPago: this.idTipoPagoQuincenal,
                  numPagos: this.periodo,
                  montoSolicitado: this.monto,
                  intereses: this.interes,
                  pagoTotal: this.pagoTotal
                }
              }
              SolicitudService.guardarSolicitud(solicitudRequest).then(resp => {
                this.obtenMontoMaximo();
                this.$toasts.push({ type: 'info', message: 'Registro guardado.' })
              }).catch(
                error => {
                  this.$toasts.push({ type: 'error', message: 'Ocurrio un error.' })
                  console.log('Ocurrio un error al guardar la solicitud', error)
                }
              );
            } else {

            }
          }
        }
      )


    },
    obtenerTablaCalendario() {
      const fechaActual = new Date()
      let obtenerYear = fechaActual.getFullYear()
      let obtenerMes = fechaActual.getMonth() + 1
      const obtenerDia = fechaActual.getDate()
      for (let i = 0; i < 96; i++) {
        if (obtenerMes > 12) {
          obtenerYear = obtenerYear + 1
          obtenerMes = 1
        }
        const diasMes = this.diasEnUnMes(obtenerMes, obtenerYear)
        if ((i === 0 && obtenerDia < 15) || i > 0) {
          const obj = {
            totalDias: 15,
            fecha: '15/' + obtenerMes + '/' + obtenerYear
          }
          this.calendario.push(obj)
        }
        const obj2 = {
          totalDias: diasMes - 15,
          fecha: diasMes + '/' + obtenerMes + '/' + obtenerYear
        }
        this.calendario.push(obj2)
        obtenerMes++
      }
    },
    diasEnUnMes(mes, anio) {
      return new Date(anio, mes, 0).getDate()
    },
    validaMonto() {
      if (this.montoAux <= this.montoMinimo) {
        this.montoAux = this.montoMinimo
      }
      if (this.montoAux >= this.montoMaximo) {
        this.montoAux = this.montoMaximo
      }
      this.monto = this.montoAux
      this.calcularCAT() // Llama a calcularCAT cuando el montoAux cambia
    },
    
    calcularCAT() {
      setTimeout(() =>{
        const tir = this.calcularTIR();
        this.montoCAT = (Math.pow(1 + (tir/100), 24) - 1)*100; // Almacena el resultado en montoCAT
      },1000);
    },
  },
  watch: {
    montoAux: function (newMontoAux, oldMontoAux) {
      // Llama a la función de manejo cuando montoAux cambia
      this.validaMonto();
    },
    periodo: function (newPeriodo, oldPeriodo) {
      this.validaMonto();
    },
  },

}
</script>
