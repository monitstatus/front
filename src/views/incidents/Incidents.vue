<script setup>
import { Head } from '@vueuse/head'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import BreadCrumb from '@/components/BreadCrumb.vue'
import IncidentListHeader from '@/components/headers/IncidentListHeader.vue'
import IncidentListItem from '@/components/IncidentListItem.vue'
import InformationCard from '@/components/InformationCard.vue'
import Paginator from '@/components/Paginator.vue'
</script>

<template>
  <Head>
    <title>Incidents | Monitstatus</title>
  </Head>

  <div :class="monitorFilter ? '' : 'pt-10'" class="md:w-5/6 lg:w-2/3 md:mx-auto">
    <div v-if="monitorFilter">
      <BreadCrumb :url="{name: 'monitorDetail', params: {id: monitorFilter}}" header="Monitor"></BreadCrumb>
    </div>
    <IncidentListHeader
      @search="(input) => search = input"
    />

    <div class="mt-6 flex tabber">
      <div class="tabSelector" :class="status == null ? 'active' : ''" @click="status = null">
        All
      </div>
      <div class="tabSelector" :class="status == 'open' ? 'active' : ''" @click="status = 'open'">
        Open
      </div>
      <div class="tabSelector" :class="status == 'resolved' ? 'active' : ''" @click="status = 'resolved'">
        Resolved
      </div>
    </div>

    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="flex pt-14" v-if="isLoading">
            <clip-loader class="mx-auto" size="40px"></clip-loader>
          </div>
          <div v-else class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div v-if="monitorIncidents.length == 0">
              <div class="bg-white h-96 flex flex-col items-center justify-center w-full">
                <div class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Congrats, you still have no downtime incidents registered.
                </div>
              </div>
            </div>
            <div v-else>
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monitor
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started at
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" class="relative">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="filteredIncidents.length > 0" class="bg-white divide-y divide-gray-200">
                  <IncidentListItem v-for="incident in filteredIncidents.slice(beginning - 1, end)" :key="incident.id" :incident="incident" />
                </tbody>
              </table>
              <div v-if="filteredIncidents.length === 0" class="mt-1">
                <InformationCard msg="No incidents found matching that search." />
              </div>
            </div>
          </div>
          <div v-if="filteredIncidents.length > 0" class="flex items-center mt-2">
            <div class="text-sm text-gray-700">
              Showing
              <span class="font-bold">{{ beginning }}</span>
              to
              <span class="font-bold">{{ end }}</span>
              of
              <span class="font-bold">{{ filteredIncidents.length }}</span>
              results
            </div>
            <Paginator :totalPages="totalPages" :activePage="activePage" @setActivePage="setActivePage" class="ml-auto"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import '@/assets/styles/tab.css'
import { monitorApi } from '@/api/monitor'
import { PAGINATOR_ROWS_PER_PAGE } from '@/config.js'


export default {
  name: 'Incidents',
  data() {
    return {
      activePage: 1,
      isLoading: false,
      search: '',
      monitorFilter: null,
      status: null,
      incidents: [],
    }
  },
  mounted() {
    this.isLoading = true
    if ("monitor" in this.$route.query) {
      this.monitorFilter = this.$route.query.monitor
    }

    monitorApi.getIncidents()
      .then(response => {
        this.isLoading = false
        return response.data
      })
      .then(json => {
        this.incidents = json
        console.log("Fetched incidents:", this.incidents)
      })
      .catch(error => {
        this.isLoading = false
        if (error.response.status != 403) {
          alert(error)
        }
      })
  },
  methods: {
    setActivePage(page) {
      console.log("set active page ", page)
      this.activePage = page
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredIncidents.length / PAGINATOR_ROWS_PER_PAGE)
    },
    beginning() {
      return this.activePage === 1 ? 1 : PAGINATOR_ROWS_PER_PAGE * (this.activePage - 1) + 1
    },
    end() {
      return this.activePage === this.totalPages ? this.filteredIncidents.length : this.activePage * PAGINATOR_ROWS_PER_PAGE
    },
    filteredIncidents() {
      if (this.search == '') {
        return this.statusIncidents
      }
      const lowerSearch = this.search.toLowerCase()
      return this.statusIncidents.filter(i => (i.monitor_url.toLowerCase().includes(lowerSearch) || (i.cause && i.cause.toLowerCase().includes(lowerSearch))))
    },
    statusIncidents() {
      if (this.status == null) {
        return this.monitorIncidents
      }
      if (this.status == 'open') {
        return this.monitorIncidents.filter(i => i.ended_at == null)
      }
      // else resolved
      return this.monitorIncidents.filter(i => i.ended_at != null)
    },
    monitorIncidents() {
      if (this.monitorFilter == null) {
        return this.incidents
      }
      return this.incidents.filter(v => v.monitor_id == this.monitorFilter)
    },
  }
}
</script>
