
import axios from 'axios'
import authHeader from './auth-header'

import { URL } from './URL_SERVICIOS'

const API_URL = URL.URL_API + '/api/empleado/'
class EmpleadoService {
  saveEmpleado (item) {
    return axios.post(API_URL + 'saveEmpleado', item, { headers: authHeader() })
  }

  guardarEmpleadosExcel (items) {
    return axios.post(API_URL + 'guardarEmpleadosExcel', items, { headers: authHeader() })
  }

  activaInactivaEmpleado (idEmpleado) {
    return axios.get(API_URL + idEmpleado + '/activaInactivaEmpleado', { headers: authHeader() })
  }

  getEmpleadosByIdCliente (idCliente) {
    return axios.get(API_URL + idCliente + '/getEmpleadosByIdCliente', { headers: authHeader() })
  }

  getEmpleadosByIdClienteSeguimiento (idCliente, fechaPago) {
    return axios.get(API_URL + idCliente + '/' + fechaPago + '/getEmpleadosByIdClienteSeguimiento', { headers: authHeader() })
  }

  getCreditosByEmpleado (idEmpleado) {
    return axios.get(API_URL + idEmpleado + '/getCreditosByEmpleado', { headers: authHeader() })
  }

  getTablaAmortizacion (idCredito) {
    return axios.get(API_URL + idCredito + '/getTablaAmortizacion', { headers: authHeader() })
  }

  getEmpleadoById (idEmpleado) {
    return axios.get(API_URL + idEmpleado + '/getEmpleadoById', { headers: authHeader() })
  }
}

export default new EmpleadoService()
