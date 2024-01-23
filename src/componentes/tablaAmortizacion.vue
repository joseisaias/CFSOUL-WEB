<template>
  <div>
    <v-card>
      <br/>
      <v-card-text>
        <v-data-table fixed-header :headers="headerAmortizacion" :items-per-page="36" :server-items-length="36"
          :hide-default-footer="true" :items="tablaAmortizacion">
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
      </v-card-text>
    </v-card>
    <span style="display: none;">{{ actualiza }}</span>
  </div>
</template>
<script>
/* eslint-disable */
import EmpleadoService from '@/services/empleado.service'

export default {
  props: {
    idCredito: Number
  },
  data () {
    return {
      tablaAmortizacion: [],
      headerAmortizacion: [
        {
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
    actualiza () {
      var dom = this.idCredito;
      this.cargaTabla()
    }

  },
  mounted () {
    this.cargaTabla()
  },
  methods: {
    cargaTabla () {
      EmpleadoService.getTablaAmortizacion(this.idCredito).then(resp => {
        this.tablaAmortizacion = resp.data.body
      }).catch()
    }
  }
}
</script>
