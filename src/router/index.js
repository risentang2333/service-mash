import Vue from 'vue'
import Router from 'vue-router'
import ServiceEditor from '@/pages/index/ServiceEditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServiceEditor',
      component: ServiceEditor
    }
  ]
})
