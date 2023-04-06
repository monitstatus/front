<template></template>

<script>
import { monitorApi } from '@/api/monitor'

export default {
  mounted() {
    monitorApi.acknowledgeIncident(this.$route.params.id)
      .then(response => response.data)
      .then(json => {
        console.log(json)
        this.$router.push({ name: 'incidentDetail', params: { id: this.$route.params.id }})
      })
      .catch(error => {
        if (error.response.status != 403) {
          alert(error.response.data.detail)
        }
      })
  },
}
</script>
