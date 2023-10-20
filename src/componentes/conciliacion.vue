<template>
  <div>
    <v-card>
      <div class="ml-2 mr-2">
        <v-card-title>
          Conciliación
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-btn class="mb-5" color="rgb(27, 85, 158)" dark @click="conciliar()" :disabled="selectedList.length == 0">
            Conciliar
          </v-btn>
          <v-data-table v-model="selectedList" :headers="headers" item-key="idCliente" :items="clientes" :search="txtBuscar" show-select
             @toggle-select-all="selectAllToggle">

            <template v-slot:[`item.data-table-select`]="{ isSelected, select, item }">
              <v-simple-checkbox
                :value="isSelected"
                :disabled="item.idConciliacion > 0"
                @input="select($event)"
              ></v-simple-checkbox>
            </template>

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
            <template v-slot:[`item.monto`]="{ item }">
              {{ item.monto | currency }}
            </template>
          </v-data-table>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>
<script>
/* eslint-disable */
import ConciliacionService from '@/services/conciliacion.service'
export default {
  name: 'ConciliacionApp',
  data() {
    return {
      disabledCount: 0,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'nombreCompleto'
        },
        {
          text: 'Monto',
          align: 'start',
          sortable: false,
          value: 'monto'
        },
        {
          text: 'Total Credito',
          align: 'start',
          sortable: false,
          value: 'totalCredito'
        },
        {
          text: 'Fecha Pago',
          align: 'start',
          sortable: false,
          value: 'fechaPago'
        },
        {
          text: 'Estatus',
          align: 'start',
          sortable: false,
          value: 'status'
        }
      ],
      txtBuscar: '',
      clientes: [],
      selectedList: []
    }
  },
  mounted() {
    this.cargaInicial(this.obtenerFechaProximoPago(new Date()))
    //this.cargaInicial(this.obtenerFechaProximoPago(new Date(2023, 11, 15)))
  },
  methods: {
    cargaInicial(fecha) {
      this.fecha = fecha;
      ConciliacionService.getConciliacion(fecha).then(resp => {
        this.clientes = resp.data.body
        const self = this;
        this.clientes.map(item => {
          if (item.idConciliacion>0) self.disabledCount += 1
        })
      }).catch(error => {
        console.error(error)
      })
    },
    obtenerFechaProximoPago(fecha) {
      const anio = fecha.getFullYear()
      const mes = fecha.getMonth() +1
      const obtenerDia = fecha.getDate()
      let diasMes = new Date(anio, mes, 0).getDate()
      if (obtenerDia >= 15) {
        return '15-' + mes + '-' + anio
      } else {
        let obtenerMes = fecha.getMonth()
        if(obtenerMes < 0){
          diasMes = new Date(anio - 1, 11, 0).getDate()
        } else {
          diasMes = new Date(anio, obtenerMes , 0).getDate()
        }
        return diasMes + '-' + obtenerMes + '-' + anio
      }
    },
    conciliar() {
      ConciliacionService.ConciliaPago(this.selectedList).then(resp => {
        this.cargaInicial(this.fecha)
        this.selectedList = []
        this.$toasts.push({ type: 'info', message: 'Conciliación exitosa.' })
      }).catch(error => {
        console.error(error)
      })
    },

    selectAllToggle(props) {
       if(this.selectedList.length != this.clientes.length  - this.disabledCount) {
         this.selectedList = [];
         const self = this;
         props.items.forEach(item => {
           if(item.idConciliacion != undefined && item.idConciliacion == 0) {
             self.selectedList.push(item);
           }
         });
       } else this.selectedList = [];
     }
  }
}
</script>
