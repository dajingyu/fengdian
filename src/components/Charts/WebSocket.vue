<template>
    <div></div>
</template>

<script>
  const str = '2|ems_10mAnd1m_data|'+ "F040"
  export default {
    name: 'websocket',
    created() {
      //页面刚进入时开启长连接
      this.initWebSocket()
    },
    destroyed: function() {
      //页面销毁时关闭长连接
      this.websocketclose()
    },
    mounted() {
      this.tableHeight = '330px !important'
    },
    methods: {
      initWebSocket() { //初始化weosocket
        console.log()
        //ws://172.172.32.155/socket.io
        //http://172.172.33.98:8001/ems/module/active
        const wsuri = 'ws://172.172.32.155/socket.io/?token=0A5E314FBDD741E1270FADB89B8031512FB8928994403F700862EEFC62DBB9E99975709615AB18EFA42C127AF24C75401CD8C56953BFEB99BF1AFD04916CBDEC4D52684E303DF5E86FB8CEFCC4C1A1432A716E2A118B2EFF117B6F59197152FC&EIO=3&transport=websocket'//ws地址
        this.websock = new WebSocket(wsuri)
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonopen(topic) {
        var topic = JSON.stringify({
          type: "ems_watcher",
          topic: str
        })
        this.websocketsend('42["subscribe",' + JSON.stringify(topic) + ']')
        // this.flag = false
      },
      websocketsend(Data) {//数据发送
        this.websock.send(Data)
      },
      websocketonmessage() { //数据接收
        this.websock.addEventListener('message', function(event) {
          var data = event.data
          var start = str.length
          var len = data.length - 1
          var res = JSON.parse(data.slice(6 + start, len))
          console.log(res)
          // this.lineChartData=res.data
          console.log(this.lineChartData)
          // this.lineChartData.targetgridPowerList = res.data.targetgridPowerList
          // this.lineChartData.timeList = res.data.timeList
          // this.lineChartData.algorithmPowerList = res.data.algorithmPowerList
        })
      },
      websocketonerror() {//连接建立失败重连
        this.initWebSocket()
      },
      websocketclose(e) { //关闭
        var topic = JSON.stringify({
          type: "ems_watcher",
          //  type : 'wf_watcher',
          topic: str + "F040"
        })
        this.websock.send('42["unSubscribe",' + JSON.stringify(topic) + ']')
        console.log('connection closed')
        // this.flag = true
      }
    }
  }
</script>

<style scoped>

</style>