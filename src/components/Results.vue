<script setup>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import ResponseTimeGraph from '@/components/ResponseTimeGraph.vue'
</script>

<template>
  <figure class="rounded-md bg-white p-4 shadow-md outline outline-gray-100 outline-4 mt-3">
    <h3 class="font-bold">
      Response times (ms)
    </h3>
    <div style="height: 400px" class="flex" v-if="isLoading">
      <clip-loader class="m-auto" size="40px"></clip-loader>
    </div>
    <div v-else class="mt-3">
      <ResponseTimeGraph :results="results" :minDate="getSinceDate" />
    </div>
  </figure>
</template>

<script>
import { monitorApi } from '@/api/monitor'

export default {
  name: 'Results',
  props: ['monitorId', 'range'],
  data() {
    return {
      isLoading: true,
      results: [],
      timer: "",
    }
  },
  mounted() {
    this.fetchResults(true)
    this.timer = setInterval(this.fetchResults, 5000)
  },
  methods: {
    fetchResults(showLoader=false) {
      if (showLoader) {
        this.isLoading = true
      }
      monitorApi.getMonitorResults(this.monitorId, this.getSinceDate)
        .then(response => {
          return response.data
        })
        .then(json => {
          this.results = json
          if (showLoader) { this.isLoading = false }
        })
        .catch(error => {
          if (showLoader) { this.isLoading = false }
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
  },
  computed: {
    getSinceDate() {
      let since = new Date()
      if (this.range === 'day') {
          since.setDate(since.getDate()-1)
      }
      if (this.range === 'week') {
          since.setDate(since.getDate()-7)
      }
      return since
    }
  },
  watch: {
    range: {
      handler(newValue, oldValue) {
        // Note: `newValue` will be equal to `oldValue` here
        // on nested mutations as long as the object itself
        // hasn't been replaced.
        console.log("Changed range", newValue, oldValue)
        this.fetchResults()
      },
      deep: true
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>