<template>
  <Head>
    <title>Edit schedule | Monitstatus</title>
  </Head>

  <BreadCrumb :url="{name: 'onCallSchedules'}" header="Schedules" />
  <ScheduleForm :editing="true" :initialForm="form" @submit="updateSchedule"/>
</template>

<script>
import { Head } from '@vueuse/head'

import BreadCrumb from '@/components/BreadCrumb.vue'
import ScheduleForm from '@/components/forms/ScheduleForm.vue'

import { defaultScheduleForm } from '@/components/forms/default.js'
import { scheduleApi } from '@/api/schedule.js'

export default {
  data() {
    return {
      form: defaultScheduleForm,
    }
  },

  components: {
    Head,
    BreadCrumb,
    ScheduleForm,
  },

  methods: {
    async fetchData() {
      scheduleApi.getScheduleDetail(this.$route.params.id)
        .then(response => response.data)
        .then(json => {
          console.log(json)
          this.form.name = json.name
          this.form.layers = json.layers.map(scheduleApi.helpers.mapLayerPayloadToFields)
        })
    },

    async updateSchedule() {
      let schedule = scheduleApi.helpers.mapFormFieldsToSchedulePayload(this.form)
      scheduleApi.updateSchedule(this.$route.params.id, schedule)
        .then(response => response.data)
        .then(json => {
          this.$router.push({ name: 'onCallSchedules' })
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
