<template>
  <div id="home">
    <div class="head row"  style="height: 100px; padding-left: 40px; padding-top: 5px;background: rgb(26 58 103)">
      <div class="col-2">
        <img src="https://portal.cfsoul.com/images/icono_amarillo.png" height="80px">
      </div>
      <div class="col-8" style="padding-top: 50px;">
            <center>
              <span style="color: white; font-size: 38px;"> CAPITAL & FINANCIAL SOUL </span>
            </center>
        </div>
        <div class="col-2">
          <router-link to="/datosPersona">
            <v-img src="./assets/img/avatar-icon-person-icons.webp" style="width: 25px; float: right;"></v-img>
            <h3 style="float: right;color: white; padding-left: 5px; padding-right: 5px;">{{ currentUser.info.persona.nombre }}</h3>
          </router-link>
          <br/><br/>
          <span style="float: right;color: white; padding-left: 5px; padding-right: 5px;"><a @click.prevent="cerrarSesion()">Cerrar Sesión</a></span>
      </div>
    </div>
    <div class="row" :style="{ height: maxHeight - 100 + 'px' }">
      <menuUsuario :maxHeight="maxHeight" @selectMenu="selectMenu = $event; subSelect = ''"></menuUsuario>
      <div id="content" class="col-5 col-sm-7 col-md-8 col-lg-9 col-xl-10">
        <v-card>
          <clientesApi v-if="selectMenu == 'cliente' && subSelect == ''" @subSelect="subSelectCliente($event)">
          </clientesApi>
          <empleadoCliente v-if="selectMenu == 'cliente' && subSelect == 'empleado'" :cliente="cliente"
            @subSelect="idCliente = null; subSelect = ''"></empleadoCliente>

          <solicitudCredito v-if="selectMenu == 'solicitudCredito' && subSelect == ''" @subSelect="subSelectCliente($event)">
          </solicitudCredito>
          <seguimientoCliente v-if="selectMenu == 'seguimiento' && subSelect == ''" @subSelect="subSelectCliente($event)"></seguimientoCliente>
          <conciliacionApp v-if="selectMenu == 'conciliacion' && subSelect == ''" @subSelect="subSelectCliente($event)"/>
          <estadoCuenta v-if="selectMenu == 'estadoCuenta' && subSelect == ''" @subSelect="subSelectCliente($event)"/>
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
import seguimientoCliente from '@/componentes/seguimientoCliente'
import conciliacionApp from '@/componentes/conciliacion'
import estadoCuenta from '@/componentes/estadoCuenta'

const $ = require('jquery');
const jQuery = require('jquery');


export default {
  name: 'Home',
  components: { menuUsuario, clientesApi, empleadoCliente, solicitudCredito, seguimientoCliente, conciliacionApp, estadoCuenta },
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
      idCliente: null,
      maxHeight: document.documentElement.clientHeight
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }else if(this.currentUser.claveEstatusUsuario == 'EST_US_NUEVO'){
      this.$router.push('/datosPersona')
    }
    if (this.$route.params.menu !== undefined) {
      this.selectMenu = this.$route.params.menu
    }
    window.onresize = () => {
      this.maxHeight = document.getElementById('content').clientHeight
      //document.documentElement.clientHeight;
            //this.autoResize();
    }
  },
  methods: {
    subSelectCliente(event) {
      this.cliente = event.cliente;
      this.subSelect = event.subSelect;
    },
    cerrarSesion() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
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
