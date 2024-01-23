<template>
  <div>
    <v-card>
      <v-card-title>
        Estado de Cuenta 
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <a v-bind="attrs" v-on="on" @click="generarPDF"><v-icon x-large color="rgb(27, 85, 158)" dark>mdi mdi-file-pdf-box</v-icon></a>
            </template>
            <span>Descarga Estado de Cuenta</span>
          </v-tooltip>
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
import DomicilioApp from '@/componentes/domicilio'
import EstadoCuenta from '@/componentes/estadoCuenta'
import VuetifyMoney from '@/componentes/VuetifyMoney'
import EmpleadoService from '@/services/empleado.service'
import TablaAmortizacion from '@/componentes/tablaAmortizacion'
import jsPDF from 'jspdf';

export default {
  props: {
    cliente: {},
    idEmpleadoProps: Number
  },
  components: {
    TablaAmortizacion,
    DomicilioApp,
    VuetifyMoney,
    EstadoCuenta
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
      ],
      estadoDeCuenta: {
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
        }],
      },
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
    this.user = this.currentUser

    if(this.idEmpleadoProps != undefined && this.idEmpleadoProps != null && this.idEmpleadoProps > 0){
      this.idEmpleado = this.idEmpleadoProps
    } else {
      this.idEmpleado = this.user.info.empleadoSelect.idEmpleado;
    }

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
    },
    generarPDF() {
      // Código para generar el PDF
      const pdf = new jsPDF();
      
      // Título
      pdf.setFontSize(18);
      pdf.text('Estado de Cuenta', 20, 10);
    
      // Información del cliente
      pdf.setFontSize(14);
      pdf.text(`Cliente:`, 20, 20);

      // Saldo Total
      pdf.text(`Saldo Total:`, 20, 40);

      // Línea divisoria
      pdf.setLineWidth(0.5);
      pdf.line(20, 45, 190, 45);

      // Detalles de transacciones en una tabla
      let y = 50; // posición vertical inicial
      const columns = ['Fecha', 'Concepto', 'Monto'];
      pdf.setFontSize(12);
      pdf.text(columns.join('        '), 20, y);
      
      // Guarda o muestra el PDF, por ejemplo:
      pdf.save('estado_cuenta.pdf');
    }
  }
}
</script>
