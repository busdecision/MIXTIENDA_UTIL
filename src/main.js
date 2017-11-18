import Vue from 'vue'
import App from './App.vue'
import Router from './routes.js'

import VueResource from 'vue-resource'
import Auth from './packages/auth/auth.js'
import VeeValidate from 'vee-validate';

Vue.use(VueResource)
Vue.use(Auth)
Vue.use(VeeValidate)

Vue.http.options.root = 'http://127.0.0.1:8000'

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', 'Bearer ' + Vue.auth.getToken())
  next()
})

Router.beforeEach(  
  (to, from, next) =>{    
    if(to.matched.some(record=> record.meta.forVisitors)){
      if(Vue.auth.isAuthenticated()){        
        next({
          //path : '/dashboard'
          path : '/colegio'
        })
      }else next()
    }
    else if(to.matched.some(record=> record.meta.forAuth)){
      if(! Vue.auth.isAuthenticated()){        
        next({
          path : '/login'
        })
      }else next()
    }
    else next()
  }
)

new Vue({
  el: '#app',
  render: h => h(App),
  router : Router,
})
