# Vue.js JWT Authentication with Vuex and Vue Router

For more detail, please visit:
> [Vue.js JWT Authentication with Vuex and Vue Router](https://bezkoder.com/jwt-vue-vuex-authentication/)

> [Using Typescript](https://bezkoder.com/vuex-typescript-jwt-auth/)

Fullstack with Spring Boot Back-end:
> [Spring Boot + Vue.js: Authentication with JWT & Spring Security Example](https://bezkoder.com/spring-boot-vue-js-authentication-jwt-spring-security/)

Fullstack with Node.js Express Back-end:
> [Node.js Express + Vue.js: JWT Authentication & Authorization example](https://bezkoder.com/node-express-vue-jwt-auth/)

Fullstack CRUD:
> [Vue.js + Node.js + Express + MySQL example](https://bezkoder.com/vue-js-node-js-express-mysql-crud-example/)

> [Vue.js + Node.js + Express + PostgreSQL example](https://bezkoder.com/vue-node-express-postgresql/)

> [Vue.js + Node.js + Express + MongoDB example](https://bezkoder.com/vue-node-express-mongodb-mevn-crud/)

> [Vue.js + Spring Boot + MySQL/PostgreSQL example](https://bezkoder.com/spring-boot-vue-js-crud-example/)

> [Vue.js + Spring Boot + MongoDB example](https://bezkoder.com/spring-boot-vue-mongodb/)

> [Vue.js + Django example](https://bezkoder.com/django-vue-js-rest-framework/)

## Note:
Open `src/services/auth-header.js` and modify `return` statement for appropriate back-end.

```js
export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.accessTotokenken }; // for Spring Boot back-end
    // return { 'x-access-token': user.token };       // for Node.js Express back-end
  } else {
    return {};
  }
}
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### npm install vuejs-datepicker --save


### documentacion vue-owl-carousel2
### <carousel></carousel>
[ vue-owl-carousel ](https://www.npmjs.com/package/vue-owl-carousel2)

### documentacion carousel-3d
### <carousel-3d></carousel-3d>
[ vue-carousel-3d ](https://madewithvuejs.com/vue-carousel-3d)
[ github.com/wlada/vue-carousel-3d ](https://github.com/wlada/vue-carousel-3d)
[ examples ](https://wlada.github.io/vue-carousel-3d/examples/)


### Color Picker
See [ EXAPLE ](https://parzibyte.me/blog/2021/06/27/selector-color-vue-color-picker/)



### google
See [ Documentacion ](https://www.npmjs.com/package/@googlemaps/js-api-loader)
https://es.vuejs.org/v2/cookbook/practical-use-of-scoped-slots.html



npm install xlsx

https://www.npmjs.com/package/xlsx