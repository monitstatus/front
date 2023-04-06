<template>
  <Head>
    <title>Edit monitor | Monitstatus</title>
  </Head>

  <div class="lg:w-2/3 lg:mx-auto">
    <BreadCrumb :url="{name: 'monitorDetail', params: {id: $route.params.id}}" :header="initialName"></BreadCrumb>
    <MonitorForm :editing="true" :initialForm="form" @submit="updateMonitor"/>
  </div>
</template>

<script>
import { Head } from '@vueuse/head'
import BreadCrumb from '@/components/BreadCrumb.vue'
import MonitorForm from '@/components/forms/MonitorForm.vue'
import { defaultMonitorForm } from '@/components/forms/default.js'

import { monitorApi } from '@/api/monitor'

export default {
  data() {
    return {
      initialName: '',
      form: defaultMonitorForm,
    }
  },

  components: {
    Head,
    BreadCrumb,
    MonitorForm,
  },

  methods: {
    async fetchData() {
      monitorApi.getMonitorDetail(this.$route.params.id)
        .then(response => response.data)
        .then(json => {
          this.initialName = json.name
          this.form.monitorType = json.monitor_type
          this.form.name = json.name
          this.form.url = json.monitor_type == 'http' ? json.endpoint : 'https://'
          this.form.endpoint = json.monitor_type != 'http' ? json.endpoint : ''
          this.form.alertType = json.alert_type
          this.form.keyword = json.keyword
          this.form.periodicity = json.periodicity
          this.form.method = json.http_method
          this.form.requestTimeout = json.request_timeout
          this.form.requestBody = json.request_body
          this.form.numPings = json.num_pings
          this.form.port = json.port
          this.form.data = json.data
          this.form.requestHeaders = Object.keys(json.request_headers).length === 0
            ? [{name: '', value: ''}]
            : Object.entries(
                json.request_headers).map(([k, v]) => {return {name: k, value: v}}
              )
          this.form.verifySsl = json.verify_ssl
          this.form.sslCheckExpiration = json.ssl_check_expiration
          this.form.requestFollowRedirects = json.follow_redirects
          this.form.requestKeepCookiesRedirecting = json.keep_cookies_between_redirects
          this.form.basicAuth = {
            user: json.auth_user,
            pass: json.auth_pass,
          }
          this.form.alertSendEmail = json.send_email
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    async updateMonitor() {
      let monitor = monitorApi.helpers.mapFormFieldsToMonitorPayloadData(this.form)

      monitorApi.updateMonitor(this.$route.params.id, monitor)
        .then(response => response.data)
        .then(json => {
          this.$router.push({ name: 'monitorDetail', params: { id: json.id } })
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
