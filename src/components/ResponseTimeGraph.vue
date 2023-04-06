<template>
  <Line
    :chart-data="chartData"
    :chart-options="chartOptions"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, Tooltip, LineController, LineElement, PointElement, TimeScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-date-fns'
import {enUS} from 'date-fns/locale'

Chart.register(Tooltip, LineController, LineElement, PointElement, TimeScale, LinearScale);

export default {
  name: 'ResponseTimeGraph',
  props: {
    minDate: Date,
    height: {
      type: Number,
      default: 400
    },
    results: {
      type: Array,
      required: true,
    }
  },
  components: {
    Line
  },
  computed: {
    chartData() {
      return {
        datasets: [{
          data: this.results.map((o) => { return {x: new Date(o.monitored_at), y: o.response_time == 0 ? null : o.response_time * 1000} }),
        }],
      }
    },
    chartOptions() {
      return {
        canvas: {
          parentNode: {
            height: this.height + 'px',
          }
        },
        maintainAspectRatio: false,
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 0.65,
        elements:{
          point:{
            borderWidth: 0,
            radius: 10,
            backgroundColor: 'rgba(0,0,0,0)'
          }
        },
        spanGaps: false,
        scales: {
          y: {
            beginAtZero: true,
            // ticks: {
            //   callback: function(value, index, ticks) { return value / 1000 }
            // }
          },
          x: {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'd/MMM HH'
              }
            },
            min: this.minDate,
            grid: {
              display: false,
            },
            adapters: {
              date: {
                locale: enUS
              }
            }
          }
        },
        responsive: true,
      }
    },
  }
}
</script>
