export default function authHeader () {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    return { 'Access-Control-Allow-Origin': '*', Accept: 'application/json, text/plain, */*', Authorization: 'Bearer ' + user.token }
  } else {
    return {}
  }
}
