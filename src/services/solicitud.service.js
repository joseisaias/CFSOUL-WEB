
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/solicitud/'
class SolicitudService {
  guardarSolicitud (item) {
    return axios.post(API_URL + 'guardarSolicitud', item, { headers: authHeader() })
  }
}

export default new SolicitudService()
