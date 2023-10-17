
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/conciliacion/'
class ConciliacionService {
  getConciliacion (fechaPago) {
    return axios.get(API_URL + fechaPago + '/getConciliacion', { headers: authHeader() })
  }

  ConciliaPago (list) {
    return axios.post(API_URL + 'conciliaPago', list, { headers: authHeader() })
  }
}

export default new ConciliacionService()
