<script setup>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
</script>

<template>
  <div class="flex flex-col w-full items-center justify-center pt-16">
    <div style="height: 250px" class="flex" v-if="isLoading">
      <clip-loader class="m-auto" size="40px"></clip-loader>
    </div>
    <div v-else>
      <div v-if="error" class="bg-gray-200 flex flex-col items-center justify-center p-8 rounded">
        <div class="text-2xl leading-7">{{ error }}</div>
        <router-link
          :to="{name: 'integrationList'}"
          type="button"
          class="mt-8 inline-flex items-center bg-blue-500 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-md shadow-sm text-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Go back to integrations
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { integrationApi } from '@/api/integration'
import { slackApi } from '@/api/slack'

export default {
  data() {
    return {
      isLoading: false,
      error: null,
    }
  },
  mounted() {
    if (!this.$route.query.code) {
      this.error = "Failed to connect to Slack"
      return
    }

    this.isLoading = true
    slackApi.obtainOauthAccess(this.$route.query.code)
      .then((response) => response.data)
      .then((data) => {
        this.isLoading = false

        let integration = {
          kind: 'slack',
          slack_bot_token: data.access_token,
          slack_incoming_webhook: data.incoming_webhook.url,
          slack_channel: data.incoming_webhook.channel,
          slack_team_name: data.team.name,
        }
        integrationApi.createIntegration(integration)
          .then(() => {
            this.$router.push({ name: 'integrationList' })
          })
          .catch(error => {
            if (error.response.status != 403) {
              alert(error)
            }
          })
      })
      .catch((error) => {
        this.isLoading = false
        console.log("Error", error)
      })
  }
}
</script>
