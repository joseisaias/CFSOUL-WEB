<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="cp" label="Código Postal" counter maxlength="5" :disabled="deshabilitar"
        @blur="buscarDomicilio()" :rules="[cpRule]" required></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="entidadFederativa" label="Entidad Federativa" :disabled="true"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="municipio" label="Municipio/Alcaldía" :disabled="true"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="domicilio.colonia" label="Colonia" :disabled="deshabilitar"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="domicilio.calle" label="Calle" :disabled="deshabilitar"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="domicilio.numeroExterior" label="Número Exterior" :disabled="deshabilitar"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="domicilio.numeroInterior" label="Número Interior" :disabled="deshabilitar"></v-text-field>
      </v-col>
    </v-row>
    <span style="display: none;">{{ actualiza }}</span>
  </div>
</template>
<script>
import CatGeneralService from '@/services/catGeneral.service'

export default {
  /* eslint-disable */
  name: 'DomicilioApp',
  props: {
    domicilio:{},
    deshabilitar:Boolean,
    cp:String,
    isActivo:Boolean,
  },
  data() {
    return {
      municipio:'',
      entidadFederativa:'',
      isRequeridoRule: [v => !!v || 'El campo es requerido.'],
      cpRule: [v => !!v || 'El campo es requerido.', v => Number(v) > 0 || 'El campo es numérico', v => (v && v.length == 5) || 'El campo debe tener 5 digitos.'],
    }
  },
  computed: {
    actualiza() {
      var dom = this.isActivo;
      this.buscarDomicilio()
    }

  },
  mounted () {
  },
  methods: {
    buscarDomicilio() {
      this.entidadFederativa = ''
      this.municipio = ''
      let cp = this.cp + ''
      if(cp != undefined && cp!= null && cp.length > 4 ){
        CatGeneralService.getCatDomicilioByCp(cp).then(resp => {
          if(resp.data.body.length > 0) {
            this.entidadFederativa = resp.data.body[0].estado;
            this.municipio = resp.data.body[0].municipio;
            this.domicilio.idCatDomicilio = resp.data.body[0].idCatDomicilio;
            this.$forceUpdate();
          }
        }).catch(error => {
          this.$toasts.push({ type: 'error', message: 'No se encontro el Codigo Postal.' })
          console.error("Ocurrio un error al buscar el codigo postal", error)
        });
      }
    },
    recuperaDomicilio() {
      let d = this.domicilio;
      d.cp= this.cp;
      this.$emit('recuperaDomicilio', d);
    },
    resetForm() {
      this.domicilio = {}
      this.entidadFederativa = ''
      this.municipio = ''
    },
  }
}
</script>
