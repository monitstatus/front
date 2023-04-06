<script setup>
import { Head } from '@vueuse/head'
</script>

<template>
  <Head>
    <title>{{ name }} | Monitstatus</title>
  </Head>

  <div class="flex flex-col xl:flex-row flex-wrap items-center">
    <div class="flex items-center sm:pl-2">
      <div v-if="up !== null" class="hidden sm:block">
        <div :class="[up ? 'bg-green-600' : 'bg-red-600', 'w-6 h-6 rounded-full']"></div>
      </div>
      <div v-else class='bg-yellow-400 w-6 h-6 rounded-full hidden sm:block'></div>
      <div class="sm:pl-4 py-2">
        <h2 class="sm:text-2xl font-bold leading-7 text-gray-900 sm:text-3xl truncate">
          {{ endpoint }}
        </h2>
        <div class="flex items-center">
          <div>
            <div v-if="up" class="text-green-600 text-sm leading-5 font-semibold">Up</div>
            <div v-if="up === false" class="text-red-600 text-sm leading-5 font-semibold">Down</div>
            <div v-if="up === null" class="text-yellow-400 text-sm leading-5 font-semibold">Still not checked</div>
          </div>
          <div class="px-1 sm:px-2 text-gray-500 text-xl">
            |
          </div>
          <div class="flex text-gray-500">
            <div class="hidden sm:block pr-1">Checked every</div>
            <div>{{ periodicity / 60. }} minute<span v-if="periodicity > 60">s</span></div>
          </div>
          <div class="px-2 text-gray-500 text-xl">
            |
          </div>
          <div class="flex text-gray-500 items-center">
            <div class="hidden sm:block">Alert when</div>
            <div class="sm:ml-1 font-semibold bg-gray-200 px-1 rounded">{{ alertType }}</div>
          </div>
          <div class="px-2 text-gray-500 text-xl">
            |
          </div>
          <div class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {{ monitorType }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex xl:ml-auto">
      <div  v-if="up !== null" class="flex text-sm rounded bg-white px-3 py-1 shadow-sm outline outline-gray-50 outline-1">
        <div class="pr-1">
          {{ up ? 'Up' : 'Down'}} for
        </div>
        <div class="font-semibold">{{ statusSince }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration'
import { monitorApi } from '@/api/monitor'

export default {
  props: ['monitorId'],
  data() {
    return {
      name: '',
      endpoint: '',
      alertType: '',
      monitorType: null,
      keyword: '',
      up: null,
      statusSince: null,
      periodicity: 0,
      timer: "",
    }
  },
  methods: {
    humanizedStatusSince(since) {
      return humanizeDuration(
        ( new Date() - new Date(since) ),
        {round: true, largest: 3}
      )
    },
    fetchData() {
      monitorApi.getMonitorDetail(this.monitorId)
        .then(response => response.data)
        .then(json => {
          this.name = json.name
          this.monitorType = json.monitor_type
          this.endpoint = json.endpoint
          this.up = json.up
          this.statusSince = this.humanizedStatusSince(json.status_since)
          this.alertType = json.alert_type
          this.keyword = json.keyword
          this.periodicity = json.periodicity
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    }
  },
  mounted() {
    this.fetchData()
    this.timer = setInterval(this.fetchData, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
