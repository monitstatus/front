<script setup>
import { Head } from '@vueuse/head'
import { DocumentCheckIcon, ServerIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BreadCrumb from '@/components/BreadCrumb.vue'
import IncidentEventsList from '@/components/IncidentEventsList.vue'
</script>

<template>
  <Head>
    <title>{{ monitorName ? monitorName : 'Incident detail' }} | Monitstatus</title>
  </Head>

  <div class="md:w-5/6 lg:w-2/3 md:mx-auto">
    <BreadCrumb :url="{name: 'incidentList'}" header="Incidents"></BreadCrumb>
    <div>
      <div class="flex flex-wrap items-center pl-2">
        <div :class="[endedAt !== null ? 'bg-green-600' : 'bg-red-600', 'w-6 h-6 rounded-full']"></div>
        <div class="pl-4 py-2">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ monitorName }}
          </h2>
          <div class="flex items-center">
            <div class="text-lg leading-5">
              <div v-if="endedAt !== null" class="text-green-600">Resolved</div>
              <div v-if="endedAt === null" class="text-red-600">Open</div>
            </div>
            <div class="px-2 text-gray-500 text-lg">
              |
            </div>
            <div class="text-gray-500">
              {{ new Date(startedAt).toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="flex ml-auto pr-4 items-center">
          <div class="flex text-gray-500 cursor-pointer mr-4 p-2 hover:bg-gray-200" @click="goToMonitorDetail">
            <ServerIcon class="h-6 w-6 pr-1" />
            Monitor
          </div>
          <div class="flex text-gray-500 cursor-pointer mr-4 p-2 hover:bg-gray-200" @click="deleteIncident">
            <TrashIcon class="h-6 w-6 pr-1" />
            Delete
          </div>
          <div v-if="acknowledgedAt" class="flex text-gray-500 p-2 text-sm" v-tooltip="getHumanTime(acknowledgedAt)" >
            Acknowledged by {{  userNameById(acknowledgedBy) }}
          </div>
          <div v-if="!acknowledgedAt && !endedAt" class="flex text-gray-500 cursor-pointer p-2 hover:bg-gray-200" @click="acknowledgeIncident">
            <DocumentCheckIcon class="h-6 w-6 pr-1" />
            Acknowledge
          </div>
          <div v-if="!acknowledgedAt && endedAt" class="flex text-gray-500 p-2 text-sm">
            Not acknowledged
          </div>
        </div>
      </div>

      <div class="pt-6">
        <div class="grid grid-cols-3 gap-4 h-32">
          <div class="flex flex-col rounded bg-white p-6 shadow-md outline outline-gray-100 outline-4">
            <div>Cause</div>
            <div class="pt-4 text-lg font-semibold">{{ cause }}</div>
          </div>
          <div class="flex flex-col rounded bg-white p-4 shadow-md outline outline-gray-100 outline-4">
            <div>Started at</div>
            <div class="pt-4 text-lg font-semibold">
              {{ getHumanDuration( new Date() - new Date(startedAt) ) }} ago
            </div>
          </div>
          <div class="flex flex-col rounded bg-white p-4 shadow-md outline outline-gray-100 outline-4">
            <div>Length</div>
            <div class="pt-4 text-lg font-semibold">
              <div v-if="endedAt">
                {{ getHumanDuration( new Date(endedAt) - new Date(startedAt) ) }}
              </div>
              <div v-else>-</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-3 rounded bg-white p-6 shadow-md outline outline-gray-100 outline-4">
          <div>Request</div>
          <pre class="bg-gray-200 p-3 mt-2">{{ request }}</pre>
          <div v-if="response" class="mt-3">Response</div>
          <pre v-if="response" class="bg-gray-200 p-3 mt-2 overflow-y-auto">{{ response }}</pre>
        </div>
        <div v-if="events.length > 0" class="mt-3 rounded bg-white p-6 shadow-md outline outline-gray-100 outline-4">
          <IncidentEventsList :events="events" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import humanizeDuration from 'humanize-duration'
import { monitorApi } from '@/api/monitor'

export default {
  name: 'IncidentDetail',
  data() {
    return {
      startedAt: null,
      endedAt: null,
      monitorId: null,
      monitorUrl: null,
      monitorName: null,
      acknowledgedBy: null,
      acknowledgedAt: null,
      cause: '',
      request: '',
      response: '',
      events: [],
    }
  },
  methods: {
    getHumanTime(datetime) {
      return format(new Date(datetime), 'yyyy/MM/dd HH:mm')
    },
    getHumanDuration(timestamp) {
      return humanizeDuration(timestamp, {units: ["d", "h", "m"], round: true})
    },
    goToMonitorDetail() {
      this.$router.push({ name: 'monitorDetail', params: { id: this.monitorId } })
    },
    deleteIncident() {
      alert('Not implemented')
    },
    acknowledgeIncident() {
      this.$router.push({ name: 'acknowledgeIncident', params: { id: this.$route.params.id } })
    },
    userNameById(id) {
      return this.$store.state.user.team.members.find(x => x.id === id).full_name
    },
    fetchData() {
      monitorApi.getIncidentDetail(this.$route.params.id)
        .then(response => response.data)
        .then(json => {
          this.startedAt = json.started_at
          this.endedAt = json.ended_at
          this.monitorId = json.monitor_id
          this.monitorUrl = json.monitor_url
          this.monitorName = json.monitor_name
          this.acknowledgedBy = json.acknowledged_by
          this.acknowledgedAt = json.acknowledged_at
          this.cause = json.cause
          this.request = json.request
          this.response = json.response
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
      monitorApi.getIncidentEvents(this.$route.params.id)
        .then(response => response.data)
        .then(json => {
          this.events = json
          console.log(json)
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
  },
}
</script>
