// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// Vuex
import store from '@/store'

import tableComponent from '@/components/Table'

Vue.use(ElementUI)
Vue.component('table-component', tableComponent)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

store.dispatch('common/updateHeight', document.documentElement['clientHeight'])
window.onresize = () => {
  store.dispatch('common/updateHeight', document.documentElement['clientHeight'])
}
