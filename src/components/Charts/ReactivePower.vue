<template>
  <!--全场无功功率图-->
<div :class="className" :style="{height:height,width:width}">
</div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ gridPowerList, targetgridPowerList } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.timeList ? this.chartData.timeList : [],
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: '12%',
          right: '12%',
          bottom: '12%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true
          }
        ],
        grid: {
          left: '12%',
          right: '14%',
          bottom: '12%',
          containLabel: true
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [{
          name: 'expected', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: gridPowerList,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: targetgridPowerList,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
