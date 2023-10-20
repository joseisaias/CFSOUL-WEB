<template>
  <div>
    <v-card>
      <div class="ml-2 mr-2">
        <v-card-title>
          Seguimiento
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
          <v-col lg="3" offset="2">
            <span style="font-weight: bold;">Fecha Próximo Pago</span><br/>
            <span><v-icon>mdi mdi-calendar</v-icon>{{ proximaFecha }}</span>
          </v-col>
          <v-col lg="3">
            <span style="font-weight: bold;">Monto Total a Pagar</span><br/>
            <span>{{ montoDeudaTotal | currency }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="6" offset-lg="6">
            <v-text-field v-model="txtBuscar" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="12">
            <v-data-table :headers="headers" :items="empleados" :search="txtBuscar">
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
                  <v-icon dark @click="verTablaAmortizacion(item)"> mdi mdi-clipboard-list-outline </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-dialog v-model="tablaAmortizacionBandera" scrollable>
      <v-card>
        <v-card-title tag="div">
          <v-toolbar color="rgb(26, 58, 103)" dark>
            Tabla de amortización
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click="tablaAmortizacionBandera = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <TablaAmortizacion :idCredito="idCredito"/>
      </v-card>

    </v-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import EmpleadoService from '@/services/empleado.service'

import TablaAmortizacion from '@/componentes/tablaAmortizacion'

export default {
  components: {
    TablaAmortizacion
  },
  data () {
    return {
      idCredito: 0,
      montoDeudaTotal: 0,
      proximaFecha: '',
      user: {},
      txtBuscar: '',
      tablaAmortizacionBandera: false,
      headers: [{
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'nombreCompleto'
      },
      {
        text: '# Pago',
        align: 'center',
        sortable: false,
        value: 'numPago'
      },
      {
        text: '# Total de Pagos',
        align: 'center',
        sortable: false,
        value: 'numPagos'
      },
      {
        text: 'Monto a Pagar Mes',
        align: 'center',
        value: 'cuota'
      },
      {
        text: 'Monto Prestamo',
        align: 'center',
        value: 'pagoTotal'
      },
      {
        text: 'Maximo Autorizado',
        align: 'center',
        value: 'montoMaximoPrestamo'
      },
      {
        text: 'Proximo Pago',
        value: 'fechaPago'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
      ],
      empleados: []
    }
  },
  computed: {
    currentUser () {
      const user = this.$store.state.auth.user
      return user
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    this.user = this.currentUser
    //this.proximaFecha = this.obtenerFechaProximoPago(new Date())
    //mes va de 0 a 11 donde 0 es =al mes 1 (enero) y 11 es igualo al mes 12(diciembre)
    this.obtenerFechaProximoPago(new Date(2023, 11, 1))
    setTimeout(() => {
      this.cargaInicial()
    }, 500)
  },
  methods: {
    cargaInicial () {
      EmpleadoService.getEmpleadosByIdClienteSeguimiento(this.user.info.clienteSelect.idCliente, this.proximaFecha).then(resp => {
        this.empleados = resp.data.body.empleados
        this.montoDeudaTotal = resp.data.body.montoDeudaTotal
      }).catch()
    },
    obtenerFechaProximoPago (fechaActual) {
      const anio = fechaActual.getFullYear()
      const mes = fechaActual.getMonth() + 1
      const obtenerDia = fechaActual.getDate()
      const diasMes = new Date(anio, mes, 0).getDate()
      if (obtenerDia < 15) {
        return '15-' + mes + '-' + anio
      } else {
        return diasMes + '-' + mes + '-' + anio
      }
    },
    verTablaAmortizacion (item) {
      this.idCredito = item.idCredito
      this.tablaAmortizacionBandera = true
    }
  }
}
</script>
