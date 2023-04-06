<template>
  <div>
    <div v-if="showHeader" class="flex items-center mb-2">
      <h3 class="font-bold">
        Uptime
      </h3>
      <div class="flex-grow"></div>
      <div v-if="availability !== null" class="text-gray-500">{{ (availability*100).toFixed(2) }}%</div>
    </div>
    <div class="flex flex-col md:flex-row h-10 px-2">
      <div class="grid gap-0.5 xl:gap-1 md:w-1/2 h-full" :class="numTicks == 96 ? 'grid-cols-48' : 'grid-cols-24'">
        <div
          v-for="(d, index) in uptime.slice(0, uptime.length/2)"
          :key="index"
          class="rounded"
          v-tooltip="tooltipContent(uptime_starting_periods[index], d)"
          :class="classByUptime(d)"
        >
        </div>
      </div>
      <div class="grid gap-0.5 xl:gap-1 md:ml-0.5 xl:ml-1 mt-1 md:mt-0 md:w-1/2 h-full" :class="numTicks == 96 ? 'grid-cols-48' : 'grid-cols-24'">
        <div
          v-for="(d, index) in uptime.slice(uptime.length/2, uptime.length)"
          :key="index"
          class="rounded"
          v-tooltip="tooltipContent(uptime_starting_periods[index+uptime.length/2], d)"
          :class="classByUptime(d)"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { monitorApi } from '../api/monitor'

export default {
  props: {
    monitorId: Number,
    range: String,
    showHeader: Boolean,
    numTicks: {
      type: Number,
      default: 96,
    }
  },
  data() {
    return {
      uptime_starting_periods: new Array(this.numTicks).fill('Unknown'),
      uptime: new Array(this.numTicks).fill(-1),
      availability: null,
      timer: "",
    }
  },
  mounted() {
    this.fetch()
    this.timer = setInterval(this.fetch, 5000)
  },
  methods: {
    fetch() {
      let startDate = new Date()
      let interval = 24*60 / this.numTicks
      if (this.range == 'day') {
        startDate.setDate(startDate.getDate() - 1)
      } else if (this.range == 'week') {
        startDate.setDate(startDate.getDate() - 7)
        interval = (7*24*60) / this.numTicks
      } else {
        alert("Unknown range", this.range)
      }

      monitorApi.getMonitorStatus(this.monitorId, startDate, interval)
        .then(response => response.data)
        .then(data => {
          this.uptime = data.uptimes
          this.uptime_starting_periods = data.starting_intervals
          this.availability = data.availability
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    classByUptime(uptime) {
      if (uptime === 1) {
        return 'bg-green-500 hover:bg-green-400'
      }
      if (uptime < 0) {
        return 'bg-gray-500 hover:bg-gray-400'
      }
      if (uptime === 0) {
        return 'bg-red-500 hover:bg-red-400'
      }
      if (uptime > 0 && uptime < 0.5) {
        return 'bg-yellow-500 hover:bg-yellow-400'
      }
      if (uptime >= 0.5 && uptime < 0.8) {
        return 'bg-yellow-400 hover:bg-yellow-300'
      }
      return 'bg-green-300 hover:bg-green-200'
    },
    tooltipContent(label, uptime) {
      return {
        content: '<div class="text-xs">' + label + '</div><div class="text-center">' + (uptime < 0 ? 'No data' : uptime.toFixed(2)*100 + '%</div>'),
        html: true,
      }
    }
  },
  watch: {
    range: {
      handler(newValue, oldValue) {
        // Note: `newValue` will be equal to `oldValue` here
        // on nested mutations as long as the object itself
        // hasn't been replaced.
        console.log("Changed range", newValue, oldValue)
        this.fetch()
      },
      deep: true
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
