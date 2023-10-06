<template>
  <div>
    <v-card height="80vh" v-if="!tablaAmortizacionDialog">
      <div class="ml-2 mr-2">
        <v-card-title tag="div" style="padding-bottom: 50px;">
          Solicitud de crédito
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
          <v-col xs="5" sm="5" md="5" lg="4" xl="5">
            <v-form ref="form">
              <v-row>
                <v-col offset="1" cols="10">
                  <v-text-field label="Monto" v-model.number="montoAux" @blur="validaMonto()" clearable>
                  </v-text-field>
                </v-col>
                <v-col offset="1" cols="10">
                  <v-slider label="Monto" v-model="monto" track-color="grey" always-dirty thumb-label="always"
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
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ interes | currency }}</span>
              </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
            <v-row>
              <v-col offset="1" cols="4"> <span style="font-weight: bold;">Pago Total:</span> </v-col>
              <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ pagoTotal | currency }}</span> </v-col>
              <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
            </v-row>
          </v-col>
          <v-col xs="6" sm="6" md="6" lg="4" xl="6" style="margin-top: -110px;">
            <div class="v-card__title" style="padding-bottom: 50px;">
              Tabla de amortización
            </div>
            <v-data-table height="60vh" fixed-header :headers="headerAmortizacion" :items-per-page="36"
              :server-items-length="36" :hide-default-footer="true" :items="tablaAmortizacion">
              <template v-slot:[`item.saldoInicial`]="{ item }">
                {{ item.saldoInicial | currency }}
              </template>
              <template v-slot:[`item.pagoTotal`]="{ item }">
                {{ item.pagoTotal | currency }}
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
        <v-btn dark color="primary">SOLICITAR CRÉDITO</v-btn>
        <v-btn dark color="red" @click="limpiarCotizacion()">Limpiar</v-btn>
      </v-card-actions>
    </v-card>
    <span style="display: none;">{{ cambiaValorMonto }}</span>
    <!--div>
      <v-row>
        <v-col lg="2"> Pago Capital</v-col>
        <v-col lg="2">Pago Interes</v-col>
        <v-col lg="2">Capital Restante</v-col>
      </v-row>
      <v-row v-for="(item, id) in calendario" :key="id">
        <v-col lg="2"> {{ item.totalDias }}</v-col>
        <v-col lg="2">{{ item.fecha }}</v-col>
      </v-row>
    </div-->
  </div>
</template>
<script>
/* eslint-disable */
import CatGeneralService from '@/services/catGeneral.service'
export default {
  components: {
  },
  props: {
    cliente: {}
  },
  data () {
    return {
      tablaAmortizacionDialog: false,
      idPersona: 0,
      periodo: 0,
      monto: 0,
      montoAux: 0,
      interesAnual: 0,
      interesDiario: 0,
      interesApicable: 0,
      valorAux: 0,
      montoMaximo: 25000,
      montoMinimo: 100,
      stepMonto: 50,
      minPeriodo: 6,
      maxPeriodo: 24,
      calendario: [],
      headerAmortizacion: [{
        text: '# Pago',
        align: 'start',
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
        value: 'pagoTotal'
      },
      {
        text: 'Interés',
        align: 'center',
        sortable: false,
        value: 'pagoInteres'
      },
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
    cambiaValorMonto () {
      this.montoAux = this.monto
      return true
    },
    currentUser () {
      const user = this.$store.state.auth.user
      return user
    },
    montoRule () {
      const aux = [v => !!v || 'El campo es requerido.']
      return aux
    },
    interes () {
      let interes = 0
      this.tablaAmortizacion.forEach(element => {
        interes = interes + element.pagoInteres
      })
      return interes
    },
    pagoTotal () {
      let montoTotal = 0
      this.tablaAmortizacion.forEach(element => {
        montoTotal = montoTotal + element.pagoTotal
      })
      return montoTotal
    },
    tablaAmortizacion () {
      const tbl = []
      const pagoCapital = this.monto / this.periodo
      let capitalRestante = this.monto
      for (let i = 0; i < this.periodo; i++) {
        const capitalRestanteFin = capitalRestante - pagoCapital
        const interes = Number((((this.interesDiario * capitalRestante) * this.calendario[i].totalDias) * this.valorAux / 1).toFixed(3))
        const obj = {
          numPago: i + 1,
          totalDias: this.calendario[i].totalDias,
          fechaPago: this.calendario[i].fechaPago,
          pagoCapital: pagoCapital,
          pagoInteres: interes,
          saldoFinal: capitalRestanteFin,
          saldoInicial: capitalRestante
        }
        obj.pagoTotal = obj.pagoCapital + obj.pagoInteres
        tbl.push(obj)
        capitalRestante = capitalRestanteFin
      }
      return tbl
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.cargaInicial()
    this.obtenerTablaCalendario()
  },
  methods: {
    limpiarCotizacion () {
      this.$confirm(
        {
          message: '¿Está seguro de limpiar el formulario?',
          button: { no: 'No', yes: 'Sí' },
          callback: confirm => { if (confirm) { this.$refs.form.reset() } }
        }
      )
    },
    cargaInicial () {
      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MONTO_MIN).then(resp => {
        this.montoMinimo = resp.data.body[0].descripcion
        this.monto = this.montoMinimo
        this.montoAux = this.montoMinimo
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_STEP_MONTO).then(resp => {
        this.stepMonto = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MIN_PERIODO).then(resp => {
        this.minPeriodo = resp.data.body[0].descripcion
        this.periodo = this.minPeriodov
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MAX_PERIODO).then(resp => {
        this.maxPeriodo = resp.data.body[0].descripcion
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
    },
    obtenerTablaCalendario () {
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
            fecha: '1/' + obtenerMes + '/' + obtenerYear
          }
          this.calendario.push(obj)
        }
        const obj2 = {
          totalDias: diasMes - 15,
          fecha: '15/' + obtenerMes + '/' + obtenerYear
        }
        this.calendario.push(obj2)
        obtenerMes++
      }
    },
    diasEnUnMes (mes, año) {
      return new Date(año, mes, 0).getDate()
    },
    validaMonto () {
      if (this.montoAux <= this.montoMinimo) {
        this.montoAux = this.montoMinimo
      }
      if (this.montoAux >= this.montoMaximo) {
        this.montoAux = this.montoMaximo
      }
      this.monto = this.montoAux
    }
  }

}
</script>
