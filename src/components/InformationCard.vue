<script setup>
  import { InformationCircleIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="bg-blue-100 font-bold rounded px-2 py-3 text-lg flex items-center border-l-4 border-indigo-500">
    <InformationCircleIcon class="h-7 w-7 mr-2" />
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'InformationCard',
  props: ['msg']
}
</script>
