<template>
  <div>
    <v-card height="80vh">
      <div class="ml-2 mr-2">
        <v-card-title tag="div" style="padding-bottom: 50px;">
          Solicitud de credito
          <v-spacer></v-spacer>
        </v-card-title>
        <v-form ref="form">
          <v-row>
            <v-col offset="1" cols="10">
              <v-slider label="Monto" v-model="monto" track-color="grey" always-dirty thumb-label="always" thumb-size="40"
                :min="montoMinimo" :step="stepMonto" :max="montoMaximo">
              </v-slider>
            </v-col>
            <v-col offset="1" cols="10">
              <div style="text-align: center; width: 100%; padding-bottom: 40px; font-size: 18px;">
                <label>Plazo <span style="font-weight: bold;">{{ periodo }}</span> Quincenas</label>
              </div>
              <v-slider label="Periodicidad" v-model="periodo" track-color="grey" always-dirty thumb-label="always" ticks
                :min="minPeriodo" :max="maxPeriodo"></v-slider>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col offset="1" cols="4"> Prestamo </v-col>
          <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ monto | currencyredondeo}}</span> </v-col>
          <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
        </v-row>
        <v-row>
          <v-col offset="1" cols="4"> Plazo </v-col>
          <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ periodo }} Quincenas</span> </v-col>
          <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
        </v-row>
        <v-row>
          <v-col offset="1" cols="4"> Interés </v-col>
          <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ interes| currencyredondeo }}</span> </v-col>
          <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
        </v-row>
        <v-row>
          <v-col offset="1" cols="4"> <span  style="font-weight: bold;">Pago mensual:</span> </v-col>
          <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ (pagoTotal / periodo) | currency }}</span> </v-col>
          <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
        </v-row>
        <v-row>
          <v-col offset="1" cols="4"> <span  style="font-weight: bold;">Pago Total:</span> </v-col>
          <v-col cols="6"> <span style="float: right; padding-right: 25px;">{{ pagoTotal | currency }}</span> </v-col>
          <v-col offset="1" cols="10"> <v-spacer class="lineTabla"></v-spacer> </v-col>
        </v-row>
      </div>
      <v-card-actions style="padding: 30px;">
            <v-btn dark color="green darken-2">Tabla de amortización</v-btn>
            <v-btn dark color="primary">SOLICITAR CRÉDITO</v-btn>
            <v-btn dark color="red" @click="limpiarCotizacion()">Limpiar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import CatGeneralService from '@/services/catGeneral.service'
export default {
  components: {
  },
  props: {
    cliente: {}
  },
  data () {
    return {
      idPersona: 0,
      periodo: 0,
      monto: 0,
      intereses: 0,
      montoMaximo: 25000,
      montoMinimo: 100,
      stepMonto: 50,
      minPeriodo: 6,
      maxPeriodo: 24
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
    interes () {
      return this.monto * this.intereses
    },
    pagoTotal () {
      return this.interes + this.monto
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.cargaInicial()
  },
  methods: {
    limpiarCotizacion () {
      alert(this.periodo)
      this.periodo = 100000
      this.$confirm(
        {
          message: '¿Está seguro de limpiar el formulario?' + this.periodo,
          button: { no: 'No', yes: 'Sí' },
          callback: confirm => { if (confirm) { this.$refs.form.reset() } }
        }
      )
    },
    cargaInicial () {
      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MONTO_MIN).then(resp => {
        this.montoMinimo = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_STEP_MONTO).then(resp => {
        this.stepMonto = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MIN_PERIODO).then(resp => {
        this.minPeriodo = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_MAX_PERIODO).then(resp => {
        this.maxPeriodo = resp.data.body[0].descripcion
      }).catch()

      CatGeneralService.getCatDetalleByClave(this.$CAT_DET.VAR_CREDITO_INTERESES).then(resp => {
        this.intereses = resp.data.body[0].descripcion
      }).catch()
    }
  }

}
</script>
