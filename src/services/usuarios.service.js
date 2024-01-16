
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/usuario/'
class UsuariosService {
  getListUsuarios (item) {
    return axios.get(API_URL + 'getListUsuarios', { headers: authHeader() })
  }

  borradoLogico (item) {
    return axios.post(API_URL + 'borradoLogico', item, { headers: authHeader() })
  }

  getClientes () {
    return axios.get(API_URL + 'getClientes', { headers: authHeader() })
  }

  getUsuarioById (item) {
    return axios.post(API_URL + 'getUsuarioById', item, { headers: authHeader() })
  }

  nuevoUsuario (item) {
    return axios.post(API_URL + 'nuevoUsuario', item, { headers: authHeader() })
  }

  borradoLogico (item) {
    return axios.post(API_URL + 'borradoLogico', item, { headers: authHeader() })
  }
}

export default new UsuariosService()
