<template>
  <div class="flex items-center w-full">
    <div class="w-8 h-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>
    </div>
    <div class="flex-col px-6">
      <div class="font-semibold">Slack</div>
      <div class="text-xs ">Post incident alerts to an Slack channel</div>
    </div>
    <div class="flex-grow"></div>
    <a :href="slackAuthorizationUrl" type="button">
      <div :class="alreadyExistIntegrations ? 'text-gray-600 bg-gray-200 hover:bg-gray-300' : 'text-white bg-blue-500 hover:bg-blue-700'" class="flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-md">
        {{ alreadyExistIntegrations ? 'Add another' : 'Connect' }} 
      </div>
    </a>
  </div>
</template>

<script>
import { slackApi } from '@/api/slack'

export default {
  props: {
    alreadyExistIntegrations: Boolean,
  },
  computed: {
    slackAuthorizationUrl() {
      return slackApi.helpers.authorizationUrl
    }
  }
}
</script>
