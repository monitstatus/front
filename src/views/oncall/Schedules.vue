<script setup>
import { Head } from '@vueuse/head'
import { TrashIcon } from '@heroicons/vue/24/outline'

import ConfirmationModal from '@/components/ConfirmationModal.vue'
import EmptyListCTA from '@/components/EmptyListCTA.vue'
import Header from '@/components/headers/Header.vue'
</script>

<template>
  <Head>
    <title>On Call Schedules | Monitstatus</title>
  </Head>

  <ConfirmationModal
    :isOpen="modal.isOpen"
    title="Delete schedule"
    :description="`This will permanently delete your schedule ${modal.scheduleName}. Are your sure? This action cannot be undone.`"
    @confirm="deleteSchedule(modal.scheduleId); hideDeleteModal()"
    @cancel="hideDeleteModal"
  />

  <Header
    itemName="Schedule"
    ctaLinkRouteName="addSchedule"
    :showSearch="true"
    @search="(input) => $emit('search', input)"
  />

  <div class="flex flex-col">
    <div v-if="schedules.length == 0" class="pt-5 sm:pt-12">
      <EmptyListCTA itemName="schedule" ctaLinkRouteName="addSchedule" />
    </div>
    <div v-else>
      <div class="border-2 rounded-lg mt-8">
        <div class="grid grid-cols-6 px-4 py-1 border-b-2 bg-gray-100 leading-8 text-gray-600">
          <div class="col-span-4">
            Name
          </div>
          <div class="col-span-2">On call</div>
        </div>
        <router-link
          :to="{ name: 'scheduleEdit', params: { id: schedule.id }}"
          v-for="schedule in schedules"
          :key="schedule.id"
          class="grid grid-cols-6 border-b bg-white py-2 px-4 items-center cursor-pointer hover:bg-gray-50"
        >
          <div class="col-span-4">{{ schedule.name }}</div>
          <div class="">User oncall?</div>
          <div class="flex justify-end">
            <div @click.prevent="showDeleteModal(schedule.name, schedule.id)" class="p-2 rounded hover:bg-gray-100">
              <TrashIcon class="h-5 w-5" />
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { scheduleApi } from '@/api/schedule'

export default {
  data() {
    return {
      schedules: [],
      isLoading: false,
      modal: {
        isOpen: false,
        scheduleName: null,
        scheduleId: null,
      }
    }
  },

  mounted() {
    this.fetchSchedules()
  },

  methods: {
    fetchSchedules() {
      this.isLoading = true
      scheduleApi.getSchedules()
        .then((response) => {
          this.schedules = response.data
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },

    deleteSchedule(scheduleId) {
      scheduleApi.deleteSchedule(scheduleId)
        .then((response) => {
          this.fetchSchedules()
        })
        .catch(error => {
          this.isLoading = false
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },

    showDeleteModal(scheduleName, scheduleId) {
      console.log("showdeletemodal")
      this.modal.isOpen = true
      this.modal.scheduleName = scheduleName
      this.modal.scheduleId = scheduleId
    },

    hideDeleteModal() {
      this.modal.isOpen = false
      this.modal.scheduleName = null
      this.modal.scheduleId = null
    }
  }
}
</script>
