import axios from 'axios'
import { URL } from './URL_SERVICIOS'

const API_URL = URL.ZOEITAPI + '/api/login/'

class AuthService {
  login (user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response.data
      })
  }

  logout () {
    localStorage.removeItem('user')
  }

  register (user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    })
  }

  selectRol (usuario) {
    return axios.post(API_URL + 'rolSeleccionado', usuario)
  }

  breadCrumb (breadCrumb) {
    return axios.post(API_URL + 'breadCrumb', breadCrumb)
  }
}

export default new AuthService()
