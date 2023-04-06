
<template>
  <Head>
    <title>New schedule | Monitstatus</title>
  </Head>

  <BreadCrumb :url="{name: 'onCallSchedules'}" header="Schedules" />
  <ScheduleForm :initialForm="form" @submit="createSchedule" />
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
    createSchedule() {
      let schedule = scheduleApi.helpers.mapFormFieldsToSchedulePayload(this.form)

      scheduleApi.createSchedule(schedule)
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
  }
}
</script>
