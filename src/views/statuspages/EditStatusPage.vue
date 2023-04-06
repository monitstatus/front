<template>
  <Head>
    <title>Edit status page | Monitstatus</title>
  </Head>

  <div class="lg:w-2/3 lg:mx-auto pt-10">
    <BreadCrumb :url="{name: 'statusPagesList'}" header="Back to status pages"></BreadCrumb>
    <StatusPageForm :editing="true" :initialForm="form" @submit="updateStatusPage" />
  </div>
</template>

<script>
import { Head } from '@vueuse/head'

import BreadCrumb from '@/components/BreadCrumb.vue'
import StatusPageForm from '@/components/forms/StatusPageForm.vue'
import { statusPageApi } from '@/api/statuspage'

export default {
  components: {
    Head, BreadCrumb, StatusPageForm,
  },

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

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      statusPageApi.get(this.$route.params.id)
        .then(response => response.data)
        .then(json => {
          this.form.companyName = json.company_name
          this.form.subdomain = json.subdomain
          this.form.companyWebsite = json.company_website
          this.form.monitor_ids = json.monitor_ids
        })
    },

    async updateStatusPage() {
      let statuspage = {
        company_name: this.form.companyName,
        subdomain: this.form.subdomain,
        company_website: this.form.companyWebsite,
        monitor_ids: this.form.monitor_ids,
      }

      statusPageApi.update(this.$route.params.id, statuspage)
        .then(response => response.data)
        .then(json => {
          this.$router.push({ name: 'statusPagesList' })
        })
        .catch(error => {
          if (error.response && error.response.status != 403) {
            alert(error)
          }
        })
    }
  }
}
</script>