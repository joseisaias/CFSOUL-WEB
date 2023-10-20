import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import DatosPersonales from '@/views/datosPersonales.vue'
import RecuperaPassword from '@/views/RecuperaPassword.vue'

Vue.use(Router)

export const router = new Router({
  routes: [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'home',
    component: Home
  },
  {
    path: '/profile/:menu',
    name: 'home/menu',
    component: Home
  },
  {
    path: '/:idUsuarioB/RecuperaPassword/:tokenPassword/:usuario',
    component: RecuperaPassword
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/datosPersona',
    component: DatosPersonales
  }
  ]
})
