/* eslint-disable */
const URL_ZOEITAPI = new Map()
const URLdomain = window.location.host

URL_ZOEITAPI.set('localhost:8080', 'http://localhost:8081')
URL_ZOEITAPI.set('dev', 'http://localhost:8081')
URL_ZOEITAPI.set('qa', 'http://localhost:8081')
URL_ZOEITAPI.set('prod', 'http://localhost:8081')

console.log('url: ' + URLdomain + '\n controller: ' + URL_ZOEITAPI.get(URLdomain));
export const URL = { ZOEITAPI: URL_ZOEITAPI.get(URLdomain) }
