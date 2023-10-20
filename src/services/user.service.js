import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/'

class UserService {
  recuperacontrasenia (mailDto) {
    return axios.post(API_URL + 'email/recuperacontrasenia', mailDto)
  }

  actualizaContrasenia (usuario) {
    return axios.post(API_URL + 'login/actualizaContrasenia', usuario)
  }

  obtenerPersona (usuario) {
    return axios.post(API_URL + 'persona/obtenerPersona', { idUsuario: usuario.id }, { headers: authHeader() })
  }

  completarDatosPersona (usuario) {
    return axios.post(API_URL + 'persona/guardarPersona', usuario, { headers: authHeader() })
  }

  cambiarPassword (usuario) {
    return axios.post(API_URL + 'persona/cambiarPassword', usuario, { headers: authHeader() })
  }

  getUsuarios () {
    return axios.get(API_URL + 'usuario/getUsuarios', { headers: authHeader() })
  }

  obtenerUsuarios () {
    return axios.get(API_URL + 'usuario/obtenerUsuarios', { headers: authHeader() })
  }

  obtenerUsuario (id) {
    return axios.get(API_URL + 'usuario/' + id + '/obtenerUsuario', { headers: authHeader() })
  }

  saveUsuario (persona) {
    return axios.post(API_URL + 'usuario/saveUsuario', persona, { headers: authHeader() })
  }

  editaUsuarioClientePass (usuario) {
    return axios.post(API_URL + 'usuario/editaUsuarioClientePass', usuario, { headers: authHeader() })
  }

  obtenerRoles () {
    return axios.get(API_URL + 'usuario/obtenerRoles', { headers: authHeader() })
  }

  obtenerEstatusUsuario () {
    return axios.get(API_URL + 'usuario/obtenerEstatusUsuario', { headers: authHeader() })
  }

  gurdarUsuarioNuevo (persona) {
    return axios.post(API_URL + 'usuario/gurdarUsuarioNuevo', persona, { headers: authHeader() })
  }
}
export default new UserService()
