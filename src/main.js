import Vue from 'vue'
import App from './modules/App'
import Docs from './modules/Docs'
import 'bootstrap-sass'
import pp from '../package.json'

import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const routemaps = {
  '/': function () {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      template: '<Docs/>',
      components: { Docs }
    })
  }
}

const prefix = pp.name
var route = ''
if (window.location.pathname.indexOf(prefix)) {
  route = window.location.pathname.replace('/' + prefix, '')
} else {
  route = window.location.pathname
}
const app = routemaps[route]
app && app()
