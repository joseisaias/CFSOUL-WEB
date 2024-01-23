/* eslint-disable */
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import store from './store';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import axios from 'axios';
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core'
import { Finance } from 'financejs'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUser,
  faUsers,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import VueConfirmDialog from 'vue-confirm-dialog'
import VueMyToasts from 'vue-my-toasts'
import 'vue-my-toasts/dist/vue-my-toasts.css'
import BootstrapComponent from 'vue-my-toasts/src/components/toasts/BootstrapComponent'
import Carousel3d from 'vue-carousel-3d';
import 'animate.css';

library.add(faHome, faUser, faUsers, faUserPlus, faSignInAlt, faSignOutAlt)

Vue.config.productionTip = false

Vue.use(VeeValidate)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vuex)
Vue.use(VueAxios, axios);
Vue.use(Carousel3d);

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.use(BootstrapVue)

Vue.use(VueMyToasts, {
  component: BootstrapComponent,
  options: {
    width: '400px',
    position: 'top-right',
    padding: '1rem'
  }
})

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('currency', function (value) {
  const val = (value / 1).toFixed(2).replace(',', '.')
  return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('currencyredondeo', function(value) {
  if (!value) {
      return "$0.0";
  }

  let val = (value / 1).toFixed(0).replace(',', '.');
  var lastDigit = val.toString().slice(-1);
  let cambioACero = val - parseInt(lastDigit);
  return "$" + cambioACero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
});
Vue.filter('formatoPorcentaje', function (value) {
  return (value).toFixed(2) + '%';
})

Vue.prototype.$ROL =
{
  ROLE_ADMIN:'ROLE_ADMIN',
  ROL_EMPL: 'ROL_EMPL',
  ROL_CLIE: 'ROL_CLIE',
  ROL_CFSOUL: 'ROL_CFSOUL',
  ROL_PROM: 'ROL_PROM'
};

Vue.prototype.$EST_US =
{
  EST_US_ACTIVO:'EST_US_ACTIVO',
  EST_US_NUEVO:'EST_US_NUEVO',
  EST_US_INACTIVO:'EST_US_INACTIVO',
  EST_US_BLOQUEADO:'EST_US_BLOQUEADO',
};

Vue.prototype.$CAT_MAES =
{
  EST_US: 'EST_US',
  TIP_SOC: 'TIP_SOC',
  TIP_ACT: 'TIP_ACT',
  TIP_PER: 'TIP_PER',
  TIP_ESTAB: 'TIP_ESTAB',
  TIP_GIRO: 'TIP_GIRO',
};

Vue.prototype.$CAT_DET =
{
  TIP_DOM_FIS: 'TIP_DOM_FIS',
  TIP_DOM_COM: 'TIP_DOM_COM',
  VAR_CREDITO_MONTO_MIN: 'VAR_CREDITO_MONTO_MIN',
  VAR_CREDITO_STEP_MONTO: 'VAR_CREDITO_STEP_MONTO',
  VAR_CREDITO_MIN_PERIODO: 'VAR_CREDITO_MIN_PERIODO',
  VAR_CREDITO_MAX_PERIODO: 'VAR_CREDITO_MAX_PERIODO',
  VAR_TASA_INTERES_ANUAL: 'VAR_TASA_INTERES_ANUAL',
  VAR_TASA_INTERES_APLICABLE: 'VAR_TASA_INTERES_APLICABLE',
  VAR_AUX: 'VAR_AUX',
  ESTATUS_POR_PAGAR:'ESTATUS_POR_PAGAR',
  ESTATUS_BIT_ADEUDO:'ESTATUS_BIT_ADEUDO',
  TIPO_PAGO_QUINCENAL:'TIPO_PAGO_QUINCENAL',


};

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
