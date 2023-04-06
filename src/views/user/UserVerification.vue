<script setup>
import { Head } from '@vueuse/head'
</script>

<template>
  <Head>
     <title>User activation | Monitstatus</title>
  </Head>
  <div>
    <div v-if="showErrorMsg">
      It seems that your token expired.
    </div>
    <div v-else>
      Keep calm while we verify the provided activation token!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showErrorMsg: false,
    }
  },
  mounted() {
    this.$store.dispatch('verifyUser', { token: this.$route.query.token })
      .then(() => {
        this.$router.push({name: 'monitorList'});
      })
      .catch((error) => {
        if (error.response.status == 403) {
          this.showErrorMsg = true
        } else {
          console.log("In the after dispatch catch for register action")
          alert(error)
        }
      })
  }
}
</script>
