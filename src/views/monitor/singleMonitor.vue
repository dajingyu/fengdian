<template>
  <a-card :bordered="false">
  </a-card>
</template>

<script>

export default {
  name: 'singleMonitor',
  components: {},
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
    this.websocketRequest()
  },
  mounted() {},
  methods: {
    websocketRequest() {  //页面建立连接
        var that = this
        this.websock_1 = this.socketApi.initWebSocket('/ems/middleSocket/WF_All_Turbine', function(res){
          console.log(res)
          var res = JSON.parse(res)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
