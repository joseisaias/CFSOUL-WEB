
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/cliente/'
class ClienteService {
  saveClient (item) {
    return axios.post(API_URL + 'guardarCliente', item, { headers: authHeader() })
  }

  borradoLogico (item) {
    return axios.post(API_URL + 'borradoLogico', item, { headers: authHeader() })
  }

  getClientes () {
    return axios.get(API_URL + 'getClientes', { headers: authHeader() })
  }

  getClienteById (item) {
    return axios.post(API_URL + 'getClienteById', item, { headers: authHeader() })
  }
}

export default new ClienteService()
