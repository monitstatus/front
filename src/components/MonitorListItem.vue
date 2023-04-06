<script setup>
  import {
    Dialog, DialogPanel, DialogTitle,
    Menu, MenuButton, MenuItems, MenuItem,
  } from '@headlessui/vue'
  import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'
  import UptimeGraph from '@/components/UptimeGraph.vue'
</script>

<template>
  <Dialog :open="isModalOpen" @close="setIsOpen(false)" class="relative z-50">
    <div class="fixed inset-0 flex items-center justify-center">
      <DialogPanel class="w-full max-w-sm rounded bg-white p-8">
        <DialogTitle class="text-xl">Delete monitor</DialogTitle>

        <p class="my-3">
          Are you sure you want to delete the monitor {{ monitor.name }}?
        </p>

        <button type="button" @click="setIsOpen(false)" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2">Cancel</button>
        <button type="button" @click="deleteMonitor" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">Delete</button>
      </DialogPanel>
    </div>
  </Dialog>

  <div class="flex flex-col shadow bg-white hover:bg-gray-100 border cursor-pointer" :class="extraClass">
    <router-link
      :to="{ name: 'monitorDetail', params: { id: monitor.id }}"
      custom
      v-slot="{ navigate }"
    >
      <div class="grid grid-cols-12 items-center p-2 xl:pl-0 hover:border-teal-100" @click="navigate">
        <div class="col-span-1 hidden sm:flex">
          <div
            class="status w-4 h-4 xl:w-8 xl:h-8 mx-auto justify-center rounded-full"
            :class="{'bg-green-600': monitor.up, 'bg-red-600': monitor.up === false, 'bg-yellow-400': monitor.up === null }" />
        </div>
        <div class="col-span-10 sm:col-span-9 xl:col-span-2 text-sm flex flex-col">
          <div class="font-semibold truncate">{{ monitor.name }}</div>
          <div class="flex space-x-1 text-xs truncate">
            <div>
              <div v-if="monitor.up" class="text-green-600">Up</div>
              <div v-else-if="monitor.up === false" class="text-red-600">Down</div>
              <div v-else class="text-yellow-400">pending</div>
            </div>
            <div>·</div>
            <div>{{ getHumanTime( new Date() - new Date(monitor.status_since) ) }}</div>
          </div>
        </div>
        <div class="col-span-12 order-last mt-2 xl:mt-0 xl:col-span-8 xl:pr-2 xl:order-none">
          <UptimeGraph :monitorId="monitor.id" range="day" :numTicks="48" />
        </div>
        <div class="col-span-2 xl:col-span-1 flex justify-end items-center space-x-0 xl:space-x-2">
          <div class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
            <div v-if="monitor.alert_type == 'unavailable'">{{ monitor.monitor_type == 'http' ? 'http' : monitor.monitor_type }}</div>
            <div v-else-if="monitor.alert_type == 'contains_keyword'">keyword</div>
            <div v-else-if="monitor.alert_type == 'does_not_contain_keyword'">{{ monitor.monitor_type == 'http' ? 'not keyword' : monitor.monitor_type }}</div>
            <div v-else>{{ monitor.alert_type }}</div>
          </div>
          <Menu as="div" @click.stop>
            <MenuButton class="p-1 rounded hover:bg-gray-200">
              <EllipsisHorizontalIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
            </MenuButton>
            <MenuItems class="absolute w-30 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem @click.stop>
                <router-link
                  :to="{name: 'monitorEdit', params: { id: monitor.id}}"
                  tag="button" type="button" class="block px-4 py-2 text-sm text-gray-700">
                  Edit
                </router-link>
              </MenuItem>
              <MenuItem @click.stop>
                <router-link
                  :to="{name: 'incidentList', query: {monitor: monitor.id}}"
                  class="block px-4 py-2 text-sm text-gray-700"
                >
                  View incidents
                </router-link>
              </MenuItem>
              <MenuItem @click.stop>
                <a href="#" onclick="alert('Not implemented')" class="block px-4 py-2 text-sm text-gray-700">Pause</a>
              </MenuItem>
              <MenuItem @click.stop>
                <a @click="setIsOpen(true)" class="block px-4 py-2 text-sm text-gray-700">Delete</a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration'
import { monitorApi } from '@/api/monitor'

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
})

export default {
  name: 'MonitorListItem',
  props: {
    monitor: {
      type: Object,
      required: true,
    },
    extraClass: String,
  },
  data() {
    return {
      isModalOpen: false,
    }
  },
  methods: {
    setIsOpen(value) {
      this.isModalOpen = value
    },
    getHumanTime(timestamp) {
      return shortEnglishHumanizer(timestamp, {round: true, largest: 3})
    },
    deleteMonitor() {
      monitorApi.deleteMonitor(this.monitor.id)
        .then(response => response.data)
        .then(() => {
          location.reload()
        })
        .catch(error => {
          alert(error)
        })
    },
  }
}
</script>

<style scoped>
.status {
  width: 18px;
  height: 18px;
}
</style>