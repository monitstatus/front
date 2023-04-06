<script setup>
import { PlusSmallIcon } from '@heroicons/vue/20/solid'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <h2 class="flex font-bold text-gray-900 text-3xl">
      {{ itemName }}s
    </h2>
    <div class="mt-5 flex flex-wrap lg:flex-nowrap lg:mt-0 lg:ml-4 md:items-center">
      <SearchBar v-if="showSearch" @search="(input) => $emit('search', input)"/>

      <div v-tooltip="disabledMsg" class="pl-0 md:pl-3 ml-auto mt-3 md:mt-0">
        <router-link
          :to="disabledMsg == '' ? {name: ctaLinkRouteName} : ''"
          tag="button" type="button"
          class="inline-flex whitespace-nowrap items-center bg-blue-500 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-md shadow-sm text-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusSmallIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add {{ itemName }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    itemName: {
      type: String,
    },
    ctaLinkRouteName: {
      type: String, 
    },
    disabledMsg: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['search'],
}
</script>
