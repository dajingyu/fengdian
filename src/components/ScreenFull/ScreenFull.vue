<template>
  <a-icon class="icon" :type="isFullscreen ? 'fullscreen' : 'fullscreen-exit'" @click="click" />

</template>

<script>
  import screenfull from 'screenfull'

  //    全屏功能使用:1.安装,npm install --save ScreenFull
  //             2.引入
  //             3.点击时判断浏览器是否可全屏,不可全屏给提示,可全屏执行screenfull.toggle()

  export default {
    name: 'ScreenFull',
    data() {
      return {
        isFullscreen: false
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      click() {

        console.log(screenfull)
        if (!screenfull.isEnabled) {
          this.$message({
            message: 'you browser can not work',
            type: 'warning'
          })
          return false
        }
        this.isFullscreen = ! this.isFullscreen
        screenfull.toggle()
      },
      change() {
        console.log(screenfull.isFullscreen)
        this.isFullscreen = screenfull.isFullscreen
      },
      init() {
        if (screenfull.enabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy() {
        if (screenfull.enabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
</script>
<style scoped>
.icon {
  font-size: 18px;
  margin: 0 20px;
}
</style>