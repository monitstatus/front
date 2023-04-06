<script setup>
import { Head } from '@vueuse/head'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import EmptyListCTA from '@/components/EmptyListCTA.vue'
import StatusPagesHeader from '@/components/headers/StatusPagesHeader.vue'
import StatusPageListItem from '@/components/StatusPageListItem.vue'
</script>

<template>
  <Head>
    <title>Status pages | Monitstatus</title>
  </Head>

  <div class="md:w-5/6 lg:w-2/3 md:mx-auto pt-10">
    <StatusPagesHeader />
  </div>
  <div class="flex flex-col items-center">
    <div class="w-full md:w-5/6 lg:w-2/3 flex flex-col items-center h-64">
      <div class="w-full p-2 md:p-0">
        <div class="flex pt-7 sm:pt-14" v-if="isLoading">
          <clip-loader class="mx-auto" size="40px"></clip-loader>
        </div>
        <div v-else class="flex flex-col pt-5 sm:pt-12">
          <div v-if="statuspages.length === 0">
            <EmptyListCTA itemName="status page" ctaLinkRouteName="addStatusPage" />
          </div>
          <div v-else class="grid grid-cols-1">
            <StatusPageListItem v-for="statuspage in statuspages" :key="statuspage.id" :statuspage="statuspage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statusPageApi } from '@/api/statuspage'

export default {
  name: 'StatusPages',
  data() {
    return {
      isLoading: false,
      statuspages: [],
    }
  },
  mounted() {
    this.isLoading = true
    statusPageApi.list()
      .then((response) => {
        this.statuspages = response.data
        this.isLoading = false
      })
      .catch(error => {
        this.isLoading = false
        if (error.response && error.response.status != 403) {
          alert(error)
        }
      })
  },
}
</script>
