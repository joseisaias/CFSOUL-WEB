/* eslint-disable */
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
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
import * as VueGoogleMaps from 'vue2-google-maps'

library.add(faHome, faUser, faUsers, faUserPlus, faSignInAlt, faSignOutAlt)

Vue.config.productionTip = false

Vue.use(VeeValidate)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vuex)
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
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.prototype.$ROL =
{
  ROLE_ADMIN:'ROLE_ADMIN',
};

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
