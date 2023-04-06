<script setup>
import { Head } from '@vueuse/head'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import SlackCard from '@/components/integrations/SlackCard.vue'
import TelegramCard from '@/components/integrations/TelegramCard.vue'
</script>

<template>
  <Head>
    <title>Integrations | Monitstatus</title>
  </Head>
  <div class="md:w-5/6 lg:w-2/3 md:mx-auto pt-10">
    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
      Integrations
    </h2>
    <div class="mt-6">
      <TabGroup :selectedIndex="selectedIndex" @change="changeTab">
        <TabList class="tabber">
          <Tab v-slot="{ selected }">
            <div class="tabSelector" :class="selected ? 'active' : ''">
              Your integrations
            </div>
          </Tab>
          <Tab v-slot="{ selected }">
            <div class="tabSelector" :class="selected ? 'active' : ''">
              Outgoing
            </div>
          </Tab>
          <Tab v-slot="{ selected }">
            <div class="tabSelector" :class="selected ? 'active' : ''">
              Incoming
            </div>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div v-if="slackIntegrations.length > 0" class="flex shadow bg-white rounded p-5">
              <div class="flex-col w-full">
                <SlackCard :alreadyExistIntegrations="true" />
                <div class="flex-col mt-4">
                  <div class="flex px-4 py-2 text-sm bg-gray-100 text-gray-500" v-for="integration in slackIntegrations" :key="integration.id">
                    <div>{{ integration.slack_team_name }}</div>
                    <div class="flex-grow"></div>
                    <div>{{ integration.slack_channel }}</div>
                    <div @click="deleteIntegration(integration.id)" class="pl-4 text-red-400 font-semibold cursor-pointer">Revoke</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="telegramIntegrations.length > 0" class="flex shadow bg-white rounded p-5" :class="slackIntegrations.length > 0 ? 'mt-2' : ''">
              <div class="flex-col w-full">
                <TelegramCard :alreadyExistIntegrations="true" />
                <div class="flex-col mt-4">
                  <div class="flex px-4 py-2 text-sm bg-gray-100 text-gray-500" v-for="integration in telegramIntegrations" :key="integration.id">
                    <div>{{ integration.telegram_random_string ? integration.telegram_random_string : integration.telegram_chat_name }}</div>
                    <div class="flex-grow"></div>
                    <a :href="'https://t.me/MonitStatus_bot?start=' + integration.telegram_random_string" v-if="integration.telegram_chat_id == null" class="pl-4 text-green-500 font-semibold cursor-pointer">Activate</a>
                    <div @click="deleteIntegration(integration.id)" class="pl-4 text-red-400 font-semibold cursor-pointer">Delete</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="slackIntegrations.length == 0 && telegramIntegrations.length == 0">
              You have not yet configured any integration.
            </div>
          </TabPanel>
          <TabPanel>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex shadow bg-white rounded p-5">
                <SlackCard :alreadyExistIntegrations="slackIntegrations.length > 0" />
              </div>
              <div class="flex shadow bg-white rounded p-5">
                <TelegramCard :alreadyExistIntegrations="telegramIntegrations.length > 0"  />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            We haven't implemented any integration to receive data or incidents from other services.
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/tab.css'
import { integrationApi } from '@/api/integration'

export default {
  data() {
    return {
      isLoading: true,
      integrations: [],
      selectedIndex: 1,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    changeTab(index) {
      this.selectedIndex = index
    },
    fetchData() {
      this.isLoading = true
      integrationApi.getIntegrations()
        .then((response) => {
          this.integrations = response.data
          if (this.slackIntegrations.length != 0 || this.telegramIntegrations.length != 0) {
            this.selectedIndex = 0
          }
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    deleteIntegration(integrationId) {
      integrationApi.deleteIntegration(integrationId)
        .then(response => response.data)
        .then(() => {
          this.fetchData()
        })
        .catch(error => {
          alert(error)
        })
    }
  },
  computed: {
    slackIntegrations() {
      return this.integrations.filter(i => i.kind == 'slack')
    },
    telegramIntegrations() {
      return this.integrations.filter(i => i.kind == 'telegram')
    },
  }
}
</script>
