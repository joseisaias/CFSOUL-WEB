import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.ZOEITAPI + '/api/'

class UserService {
  obtenerPersona (usuario) {
    return axios.post(API_URL + 'persona/obtenerPersona', { idUsuario: usuario.id }, { headers: authHeader() })
  }

  completarDatosPersona (usuario) {
    return axios.post(API_URL + 'persona/guardarPersona', usuario, { headers: authHeader() })
  }

  cambiarPassword (usuario) {
    return axios.post(API_URL + 'persona/cambiarPassword', usuario, { headers: authHeader() })
  }

  editaUsuarioClientePass (usuario) {
    return axios.post(API_URL + 'usuario/editaUsuarioClientePass', usuario, { headers: authHeader() })
  }

  getUsuarios () {
    return axios.get(API_URL + 'usuario/getUsuarios', { headers: authHeader() })
  }

  obtenerUsuarios () {
    return axios.get(API_URL + 'usuario/obtenerUsuarios', { headers: authHeader() })
  }

  obtenerUsuario (id) {
    const usuarioDto = { idUsuario: id }
    return axios.post(API_URL + 'usuario/obtenerUsuario', { usuarioDto }, { headers: authHeader() })
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

  obtenerInstructores () {
    return axios.get(API_URL + 'usuario/obtenerInstructores', { headers: authHeader() })
  }

  obtenerAlumnosByCurso (idCurso) {
    return axios.post(API_URL + 'usuario/obtenerAlumnosByCurso', { idCurso: idCurso }, { headers: authHeader() })
  }
}
export default new UserService()
