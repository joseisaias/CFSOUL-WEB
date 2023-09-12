import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

// Translation provided by Vuetify (javascript)
import esd from 'vuetify/es5/locale/es'
Vue.use(Vuetify)

export default new Vuetify({

  icons: {
    iconfont: 'mdi' // default - only for display purposes
  },
  lang: {
    locales: { esd },
    current: 'esd'
  }
})
