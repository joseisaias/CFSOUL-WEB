<template>
  <div>
    <v-card>
      <v-card-title>
        Estado de Cuenta
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headerCreditos" :items="creditos">
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
      </v-card-text>
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
        <TablaAmortizacion :idCredito="idCredito" />
      </v-card>
    </v-dialog>
    <span style="display: none;">{{ actualiza }}</span>
  </div>
</template>
<script>
/* eslint-disable */
import EmpleadoService from '@/services/empleado.service'
import TablaAmortizacion from '@/componentes/tablaAmortizacion'
export default {
  props: {
    idEmpleadoProps: Number
  },
  components: {
    TablaAmortizacion
  },
  data() {
    return {
      idEmpleado: null,
      user: {},
      idCredito: 0,
      tablaAmortizacionBandera: false,
      creditos: [],
      headerCreditos: [
        {
          text: 'Total',
          align: 'center',
          sortable: false,
          value: 'totalCredito'
        },
        {
          text: 'Solicitado',
          align: 'center',
          sortable: false,
          value: 'montoSolicitado'
        },
        {
          text: 'Total Pagos',
          align: 'center',
          sortable: false,
          value: 'totalPagos'
        },
        {
          text: 'Fecha Inicio',
          align: 'center',
          sortable: false,
          value: 'fechaPrimerPago'
        },
        {
          text: 'Fecha Fin',
          align: 'center',
          sortable: false,
          value: 'fechaUltimoPago'
        },
        {
          text: 'Acciones',
          value: "actions",
          sortable: false
        }
      ]
    }
  },
  computed: {
    currentUser() {
      const user = this.$store.state.auth.user
      return user
    },
    actualiza () {
      this.idEmpleado = this.idEmpleadoProps
      this.cargaInicial()
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login')
    }
    if(this.idEmpleadoProps != undefined && this.idEmpleadoProps != null && this.idEmpleadoProps > 0){
      this.idEmpleado = this.idEmpleadoProps
    } else {
      this.idEmpleado = this.user.info.empleadoSelect.idEmpleado;
    }

    this.user = this.currentUser
    this.cargaInicial()
  },
  methods: {
    cargaInicial() {
      EmpleadoService.getCreditosByEmpleado(this.idEmpleado).then(resp => {
        this.creditos = resp.data.body
      }).catch()
    },
    verTablaAmortizacion(item) {
      this.idCredito = item.idCredito
      this.tablaAmortizacionBandera = true
    }
  }
}
</script>
