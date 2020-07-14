// ie polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import config_ from '@/config/defaultSettings'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import 'ant-design-vue/dist/antd.less'
import i18n from './locales'
import './components/global.less'

// WebSocket封装方法
import * as socketApi from './utils/socket'
Vue.prototype.socketApi = socketApi

Vue.config.productionTip = false

Vue.prototype.CONFIG = config_

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
import axios from 'axios'
Vue.prototype.$axios=axios
new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
