<script setup>
import { Head } from '@vueuse/head'

import BreadCrumb from '@/components/BreadCrumb.vue'
import StatusPageForm from '@/components/forms/StatusPageForm.vue'
</script>

<template>
  <Head>
    <title>New status page | Monitstatus</title>
  </Head>

  <div class="lg:w-2/3 lg:mx-auto pt-10">
    <BreadCrumb :url="{name: 'statusPagesList'}" header="Status pages"></BreadCrumb>
    <StatusPageForm :initialForm="form" @submit="createStatusPage" />
  </div>
</template>

<script>
import { statusPageApi } from '@/api/statuspage'

export default {
  data() {
    return {
      form: {
        companyName: null,
        subdomain: null,
        companyWebsite: null,
        monitor_ids: [],
      },
    }
  },
  methods: {
    createStatusPage() {
      let statuspage = {
        company_name: this.form.companyName,
        subdomain: this.form.subdomain,
        company_website: this.form.companyWebsite,
        monitor_ids: this.form.monitor_ids,
      }
      statusPageApi.create(statuspage)
        .then(response => response.data)
        .then(json => {
          this.$router.push({ name: 'statusPagesList' })
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status != 403) {
            alert(error)
          }
        })
    }
  }
}
</script>
