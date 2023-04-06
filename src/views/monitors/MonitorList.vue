<script setup>
import { Head } from '@vueuse/head'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import EmptyListCTA from '@/components/EmptyListCTA.vue'
import MonitorListHeader from '@/components/headers/MonitorListHeader.vue'
import MonitorListItem from '@/components/MonitorListItem.vue'
import InformationCard from '@/components/InformationCard.vue'
</script>

<template>
  <Head>
    <title>Monitors | Monitstatus</title>
  </Head>

  <div class="md:w-5/6 lg:w-2/3 md:mx-auto pt-10">
    <MonitorListHeader
      @search="(input) => search = input"
    />
  </div>
  <div class="flex flex-col items-center">
    <div class="w-full md:w-5/6 lg:w-2/3 flex flex-col items-center h-64">
      <div class="w-full p-2 md:p-0">
        <div class="flex pt-7 sm:pt-14" v-if="isLoading">
          <clip-loader class="mx-auto" size="40px"></clip-loader>
        </div>
        <div v-else class="flex flex-col pt-5 sm:pt-12">
          <div v-if="monitors.length === 0">
            <EmptyListCTA itemName="monitor" ctaLinkRouteName="addMonitor" />
          </div>
          <div v-else>
            <div v-if="filteredMonitors.length === 0">
              <InformationCard msg="No monitors found matching that search." />
            </div>
            <div v-else>
              <MonitorListItem
                v-for="(monitor, index) in filteredMonitors"
                :key="monitor.id"
                :monitor="monitor"
                :extraClass="index === 0 ? 'rounded-t-md' : (index === (filteredMonitors.length - 1) ? 'rounded-b-md' : '' )"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { monitorApi } from '@/api/monitor'

export default {
  name: 'MonitorList',
  data() {
    return {
      search: '',
      isLoading: false,
      monitors: [],
    }
  },
  mounted() {
    this.isLoading = true
    monitorApi.getMonitors()
      .then((response) => {
        this.monitors = response.data
        // show monitors down first in the list
        this.monitors.sort((a, b) => a.up - b.up)
        this.isLoading = false
      })
      .catch(error => {
        this.isLoading = false
        if (error.response.status != 403) {
          alert(error)
        }
      })
  },
  computed: {
    filteredMonitors() {
      if (this.search == '') {
        return this.monitors
      }

      const lowerSearch = this.search.toLowerCase()
      return this.monitors.filter(m => m.endpoint.toLowerCase().includes(lowerSearch) || m.name.toLowerCase().includes(lowerSearch))
    },
  },
}
</script>