import Vue from 'vue'
import CONFIG from '@/config/defaultSettings'

var websock = null
// 初始化weosocket
function initWebSocket(_url, callback) {
  var ws = 'ws://' + process.env.VUE_APP_GATEWAY + _url    // + '?token=' + Vue.ls.get(ACCESS_TOKEN) // ws地址请求路径
  websock = new WebSocket(ws)
  websock.onmessage = function (e) {
    callback(e.data)
  }
  websock.onclose = function (e) {
  }
  websock.onopen = function () {
  }
  // 连接发生错误的回调方法
  websock.onerror = function () {
    // console.log('WebSocket连接发生错误')
  }
  return websock
}
export {
  initWebSocket
}