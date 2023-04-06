<template>
  <Head>
    <title>New monitor | Monitstatus</title>
  </Head>

  <div class="lg:w-2/3 lg:mx-auto">
    <BreadCrumb :url="{name: 'monitorList'}" header="Monitors"></BreadCrumb>
    <MonitorForm :initialForm="form" @submit="createMonitor" />
  </div>
</template>

<script>
import { Head } from '@vueuse/head'
import BreadCrumb from '@/components/BreadCrumb.vue'
import MonitorForm from '@/components/forms/MonitorForm.vue'
import { defaultMonitorForm } from '@/components/forms/default.js'

import { monitorApi } from '@/api/monitor.js'

export default {
  data() {
    return {
      form: defaultMonitorForm,
    }
  },

  components: {
    Head,
    BreadCrumb,
    MonitorForm,
  },

  methods: {
    createMonitor() {
      let monitor = monitorApi.helpers.mapFormFieldsToMonitorPayloadData(this.form)

      console.log("onSubmit")
      console.log(monitor)

      monitorApi.createMonitor(monitor)
        .then(response => response.data)
        .then(json => {
          this.$router.push({ name: 'monitorDetail', params: { id: json.id } })
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
  }
}
</script>
