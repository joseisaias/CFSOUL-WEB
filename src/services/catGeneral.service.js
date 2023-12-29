
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/catalogo/'
class CatGeneralService {
  getCatSelect (claveMaestro) {
    return axios.get(API_URL + claveMaestro + '/getCatSelect', { headers: authHeader() })
  }

  getCatSelectIdCatPadre (claveMaestro, idCatPadre) {
    return axios.get(API_URL + claveMaestro + '/' + idCatPadre + '/getCatSelectIdCatPadre', { headers: authHeader() })
  }

  getCatDomicilioByCp (cp) {
    return axios.get(API_URL + cp + '/getCatDomicilioByCp', { headers: authHeader() })
  }

  getCatDetalleByClave (clave) {
    return axios.get(API_URL + clave + '/getCatDetalleByClave', { headers: authHeader() })
  }

  getCatRol (claveMaestro) {
    return axios.get(API_URL + claveMaestro + '/getCatRol', { headers: authHeader() })
  }
}

export default new CatGeneralService()
