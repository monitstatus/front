<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue'
  import { ExclamationCircleIcon, ArrowPathIcon, TrashIcon, CogIcon } from '@heroicons/vue/24/outline'

  import MonitorDetailHeader from '@/components/MonitorDetailHeader.vue'
  import BreadCrumb from '@/components/BreadCrumb.vue'
  import UptimeGraph from '@/components/UptimeGraph.vue'
  import Results from '@/components/Results.vue'
</script>

<template>
  <Dialog :open="isModalOpen" @close="setIsOpen(false)" class="relative z-50">
    <div class="fixed inset-0 flex items-center justify-center">
      <DialogPanel class="w-full max-w-sm rounded bg-white p-8">
        <DialogTitle class="text-xl">Delete monitor</DialogTitle>

        <p class="my-3">
          Are you sure you want to delete the monitor?
        </p>

        <button type="button" @click="setIsOpen(false)" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2">Cancel</button>
        <button type="button" @click="deleteMonitor" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">Delete</button>
      </DialogPanel>
    </div>
  </Dialog>

  <div class="md:w-5/6 lg:w-2/3 md:mx-auto">
    <BreadCrumb :url="{name: 'monitorList'}" header="Monitors"></BreadCrumb>
    <MonitorDetailHeader :monitorId="$route.params.id" />

    <div class="flex flex-col">
      <div class="flex flex-col lg:flex-row lg:items-center mt-5">
        <div class="flex">
          <router-link
            :to="{name: 'incidentList', query: {monitor: $route.params.id}}"
            class="flex text-gray-500 cursor-pointer sm:mr-2 p-2 hover:bg-gray-200"
          >
            <ExclamationCircleIcon class="h-6 w-6 pr-1" />
            Incidents
          </router-link>
          <div class="flex text-gray-500 cursor-pointer sm:mr-2 p-2 hover:bg-gray-200" @click="setIsOpen(true)">
            <TrashIcon class="h-6 w-6 pr-1" />
            Delete
          </div>
          <div class="flex text-gray-500 cursor-pointer sm:mr-2 p-2 hover:bg-gray-200" @click="refresh">
            <ArrowPathIcon class="h-6 w-6 pr-1" />
            Refresh
          </div>
          <router-link
            :to="{name: 'monitorEdit', params: {id: $route.params.id}}"
            class="flex text-gray-500 cursor-pointer p-2 hover:bg-gray-200"
          >
            <CogIcon class="h-6 w-6 pr-1" />
            Edit
          </router-link>
        </div>
        <div class="ml-auto">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              @click="range = 'day'"
              :class="[range === 'day' ? 'bg-gray-100 z-10 ring-2 ring-gray-300' : 'bg-white']"
              class="py-1 px-3 text-sm font-medium text-gray-900 rounded-l-md border border-gray-200 hover:bg-gray-100">
                Day
            </button>
            <button
              type="button"
              @click="range = 'week'"
              :class="[range === 'week' ? 'bg-gray-100 z-10 ring-2 ring-gray-300' : 'bg-white']"
              class="py-1 px-3 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100">
                Week
            </button>
            <button
              disabled
              type="button"
              class="opacity-75 cursor-not-allowed py-1 px-3 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover: focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                Month
            </button>
          </div>
        </div>
      </div>
      <div class="mt-3 rounded-md bg-white p-4 shadow-md outline outline-gray-100 outline-4">
        <UptimeGraph :monitorId="parseInt($route.params.id)" :range="range" showHeader />
      </div>
      <Results :monitorId="$route.params.id" :range="range" />
    </div>
  </div>
</template>

<script>
import { monitorApi } from '@/api/monitor'

export default {
  data() {
    return {
      range: 'day',
      isModalOpen: false,
    }
  },
  methods: {
    refresh() {
      location.reload()
    },
    setIsOpen(value) {
      this.isModalOpen = value
    },
    deleteMonitor() {
      monitorApi.deleteMonitor(this.$route.params.id)
        .then(response => response.data)
        .then(() => {
          this.$router.push({name: 'monitorList'});
        })
        .catch(error => {
          alert(error)
        })
    },
  }
}
</script>
