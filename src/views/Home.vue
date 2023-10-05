<template>
  <div id="home">
    <div class="head row" style="height: 150px; padding-left: 15px; padding-top: 15px;background: rgb(26 58 103)">
      <div class="col-2">
        <img src="https://portal.cfsoul.com/images/icono_amarillo.png" width="100px">
      </div>
      <div class="col-10" style="padding-top: 50px;">
        <center>
          <span style="color: white; font-size: 38px;">CAPITAL & FINANCIAL SOUL</span>
        </center>
      </div>
    </div>
    <div class="row" style="height: calc(100vh - 150px);">
      <menuUsuario @selectMenu="selectMenu = $event; subSelect = ''"></menuUsuario>
      <div class="col-5 col-sm-7 col-md-8 col-lg-9 col-xl-10">
        <v-card>
          <clientesApi v-if="selectMenu == 'cliente' && subSelect == ''" @subSelect="subSelectCliente($event)">
          </clientesApi>
          <empleadoCliente v-if="selectMenu == 'cliente' && subSelect == 'empleado'" :cliente="cliente"
            @subSelect="idCliente = null; subSelect = ''"></empleadoCliente>

          <solicitudCredito v-if="selectMenu == 'solicitudCredito' && subSelect == ''" @subSelect="subSelectCliente($event)">
          </solicitudCredito>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import menuUsuario from '@/componentes/menu'
import clientesApi from '@/componentes/clientesApi'
import empleadoCliente from '@/componentes/empleadoCliente'
import solicitudCredito from '@/componentes/solicitudCredito'
const $ = require('jquery');
const jQuery = require('jquery');


export default {
  name: 'Home',
  components: { menuUsuario, clientesApi, empleadoCliente, solicitudCredito },
  computed: {
    currentUser() {
      const user = this.$store.state.auth.user
      return user
    }
  },
  data() {
    return {
      selectMenu: 'home',
      subSelect: '',
      idCliente: null
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    if (this.$route.params.menu !== undefined) {
      this.selectMenu = this.$route.params.menu
    }
  },
  methods: {
    subSelectCliente(event) {
      this.cliente = event.cliente;
      this.subSelect = event.subSelect;
    }
  }
};
</script>

<style scoped>
#home {
  /*background: rgb(26 58 103) !important;
    height: 100vh;*/
}
</style>
