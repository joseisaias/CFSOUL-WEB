import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Login
  },
  {
    path: '/profile',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    component: Login
  }
  ]
})
