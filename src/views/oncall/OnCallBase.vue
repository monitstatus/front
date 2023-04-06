<script setup>
import { CalendarIcon, ChatBubbleLeftIcon, ExclamationCircleIcon, UsersIcon } from '@heroicons/vue/24/outline'
</script>

<template>
<div class="flex flex-col lg:flex-row h-full">
  <aside class="w-full lg:w-64" aria-label="Sidebar">
    <div class="overflow-y-auto bg-gray-50 h-full dark:bg-gray-800">
      <div class="text-md grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1">
        <router-link
          :to="{name: 'onCallSchedules'}"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
              @click="navigate"
              class="flex justify-center lg:justify-start items-center cursor-pointer py-3 px-4 text-gray-900 hover:text-blue-500"
              :class="isActive ? 'bg-blue-100 text-blue-500' : ''"
          >
            <CalendarIcon class="w-8 h-8" />
            <span class="ml-3">Schedules</span>
          </div>
        </router-link>
        <router-link
          :to="{name: 'onCallEscalation'}"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
            @click="navigate"
            class="flex justify-center lg:justify-start items-center cursor-pointer py-3 px-4 text-gray-900 hover:text-blue-500"
            :class="isActive ? 'bg-blue-100 text-blue-500' : ''"
          >
            <ExclamationCircleIcon class="w-8 h-8" />
            <span class="ml-3">Escalation policies</span>
          </div>
        </router-link>
        <router-link
          :to="{name: 'onCallUsers'}"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
              @click="navigate"
              class="flex justify-center lg:justify-start items-center cursor-pointer py-3 px-4 text-gray-900 hover:text-blue-500"
              :class="isActive ? 'bg-blue-100 text-blue-500' : ''"
          >
            <UsersIcon class="w-8 h-8" />
            <span class="ml-3">Members</span>
          </div>
        </router-link>
      </div>
      <div class="bg-lime-200 border-2 border-lime-500 font-bold text-lime-600 rounded p-4 m-5 flex space-x-5">
        <ChatBubbleLeftIcon class="w-6 h-6" />
        <div>On Call section is still a draft</div>
      </div>
    </div>
  </aside>

  <div class="flex flex-col w-full md:max-w-5xl p-10 pt-20">
    <router-view />
  </div>
</div>
</template>
