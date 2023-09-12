import AuthService from '../services/auth.service'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null }

export const auth = {
  namespaced: true,
  state: initialState,
  breadCrumb: '',
  temporalLogin: {},
  actions: {
    rolSeleccionado ({ commit }, roleSeleccionado) {
      commit('rolSeleccionado', roleSeleccionado)
    },
    breadCrumb ({ commit }, breadCrumb) {
      commit('breadCrumb', breadCrumb)
    },
    login ({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          /// if (user.roles.length == 1) {
          user.rolSelect = user.roles[0]
          /* } else {
                        user.rolSelect = ['Seleccionar Rol'];
                    } */
          const aux = JSON.stringify(user)
          commit('loginSuccess', JSON.parse(aux))
          return Promise.resolve(JSON.parse(aux))
        },
        error => {
          commit('loginFailure')
          return Promise.reject(error)
        }
      )
    },
    registerUsuario ({ commit }, user) {
      const aux = JSON.stringify(user)
      commit('loginSuccess', JSON.parse(aux))
    },

    selectRol ({ commit }, user) {
      const aux = JSON.stringify(user)
      commit('loginSuccess', JSON.parse(aux))
    },

    logout ({ commit }) {
      AuthService.logout()
      commit('logout')
    },
    register ({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess')
          return Promise.resolve(response.data)
        },
        error => {
          commit('registerFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    loginSuccess (state, user) {
      state.status.loggedIn = true
      state.user = user
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    loginFailure (state) {
      state.status.loggedIn = false
      state.user = null
    },
    logout (state) {
      state.status.loggedIn = false
      state.user = null
    },
    registerSuccess (state) {
      state.status.loggedIn = false
    },
    registerFailure (state) {
      state.status.loggedIn = false
    },
    rolSeleccionado (state, roleSeleccionado) {
      state.user.rolSelect = [roleSeleccionado]
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  }
}
