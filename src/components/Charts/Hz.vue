<template>
  <!--全场有功功率图-->
  <div :class="className" :style="{height:height,width:width}">
  </div>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme

  export default {
    name: 'LineChart',
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
        console.log(this.chartData)
      },
      setOptions({ GridPower, GridRePower, IdealPower,Frequency, a, b, c, x, y, z } = {}) {//实际值 目标值 理论值 fact, target, theory
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
            left: '10%',
            right: '10%',
            bottom: '10%',
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
          legend: {
            // data: ['expected', 'actual', 'powerList']
            data: this.chartData.legend
          },
          yAxis: [
            // {
            //   name: this.chartData.legend[0],
            //   type: 'value'
            // },
            // {
            //   name: this.chartData.legend[1],
            //   type: 'value'
            // },
            {
              // name: this.chartData.legend,
              type: 'value',
              name: this.chartData.name[0],
              axisTick: {
                show: false
              }
            },
            {
              // name: this.chartData.legend[3],
              // nameLocation: 'start',
              type: 'value',
              name: this.chartData.name[1],
              axisTick: {
                show: false
              }
              // inverse: true
            }
          ],
          series: [
           /* {
              name: this.chartData.legend[0],
              type: 'line',
              animation: false,
              areaStyle: {},
              lineStyle: {
                width: 1
              },
              markArea: {
                silent: true,
                data: [[{
                  xAxis: '2009/9/12\n7:00'
                }, {
                  xAxis: '2009/9/22\n7:00'
                }]]
              },
              data: [
               10,20,30,10,10,10  ]
            },
            {
              name: this.chartData.legend[3],
              type: 'line',
              yAxisIndex: 1,
              animation: false,
              areaStyle: {},
              lineStyle: {
                width: 1
              },
              markArea: {
                silent: true,
                data: [
                  [{
                    xAxis: '2009/9/10\n7:00'
                  }, {
                    xAxis: '2009/9/20\n7:00'
                  }]
                ]
              },
              data: [
                10,20,20,30,10,10
                     ]
            },*/{
            name: this.chartData.legend[0],
            itemStyle: {
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
            data: GridPower,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }, {
            name: this.chartData.legend[1],
            itemStyle: {
              normal: {
                color: '#666',
                lineStyle: {
                  color: '#666',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: GridRePower,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
            {
              name: this.chartData.legend[2],
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#CCC4B9',
                  lineStyle: {
                    color: '#CCC4B9',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: IdealPower,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            {
              name: this.chartData.legend[3],
              smooth: true,
              type: 'line',
              yAxisIndex: 1,
              animation: false,
              itemStyle: {
                normal: {
                  color: '#CC65C2',
                  lineStyle: {
                    color: '#CC65C2',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              markArea: {
                silent: true
              },
              data: Frequency,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }
          ]
        })
      }
    }
  }
</script>
<style lang="less" scoped>

</style>