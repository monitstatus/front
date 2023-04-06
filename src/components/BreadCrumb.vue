<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex">
    <router-link
      :to="url"
      custom
      v-slot="{ navigate }"
    >
      <div @click="navigate" class="flex items-center py-2 pr-2 cursor-pointer hover:bg-gray-200">
        <ChevronLeftIcon class="h-6 w-6 text-gray-500" aria-hidden="true" />
        <div class="text-lg text-gray-500">{{ header }}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['url', 'header'],
}
</script>
