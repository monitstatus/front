<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
</script>


<template>
  <div class="bg-red-100 font-bold rounded px-2 py-3 text-lg flex items-center border-l-4 border-red-500">
    <ExclamationTriangleIcon class="h-7 w-7 mr-2 text-red-600" />
    <slot></slot>
  </div>
</template>
