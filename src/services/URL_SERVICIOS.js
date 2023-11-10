/* eslint-disable */
const URL_API = new Map()
const URLdomain = window.location.host
//URL_API.set('localhost:8080', 'http://localhost:8081')
URL_API.set('localhost:8082', 'https://cfsoul-api-dev.azurewebsites.net')
URL_API.set('cfsoul-dev.azurewebsites.net', 'https://cfsoul-api-dev.azurewebsites.net')
URL_API.set('qa', 'http://localhost:8081')
URL_API.set('prod', 'http://localhost:8081')

console.log('url: ' + URLdomain + '\n controller: ' + URL_API.get(URLdomain));
export const URL = { URL_API: URL_API.get(URLdomain) }
