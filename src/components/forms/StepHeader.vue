<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <h1 class="flex items-center cursor-pointer">
    <div class="border-4 border-blue-400 rounded-full w-10 h-10 text-lg text-center leading-8 text-blue-400">
      {{ number }}
    </div>
    <div class="pl-2">
      <ChevronRightIcon
        :class="open ? 'rotate-90 transform' : ''"
        class="h-5 w-5 text-gray-400"
      />
    </div>
    <div class="pl-2 font-light">{{ msg }}</div>
  </h1>
</template>

<script>
export default {
  props: {
    open: Boolean,
    number: Number,
    msg: String,
  }
}
</script>
