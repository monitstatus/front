<script setup>
  import { CheckIcon, ChatBubbleLeftIcon, TagIcon, EnvelopeIcon, ExclamationTriangleIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <ol class="relative border-l border-gray-200 mt-3 ml-3">
    <li v-for="(e, index) in events" :key="index" class="ml-6" :class="index != (Object.keys(events).length - 1) ? 'mb-5' : ''">
      <span
        class="flex absolute -left-3 justify-center items-center w-6 h-6 rounded-full ring-8 ring-white"
        :class="e.type == 'monitoring_success' ? 'bg-green-50' : (e.type == 'monitoring_failure' ? 'bg-red-50' : 'bg-white')"
      >
        <CheckIcon v-if="e.type == 'monitoring_success'" class="w-3 h-3 text-green-600" />
        <ExclamationTriangleIcon v-if="e.type == 'monitoring_failure'" class="w-4 h-4 text-red-600" />
        <EnvelopeIcon v-if="e.type == 'alert_sent' && e.field == 'email'" class="w-4 h-4" />
        <PaperAirplaneIcon v-if="e.type == 'alert_sent' && e.field == 'telegram'" class="w-4 h-4" />
        <ChatBubbleLeftIcon v-if="e.type == 'alert_sent' && e.field == 'slack'" class="w-4 h-4" />
        <TagIcon v-if="e.type == 'acknowledged'" class="w-4 h-4" />
      </span>
      <div class="mb-1 text-gray-900">
        <div v-if="e.type == 'monitoring_success'">
          Monitoring success
          <span class="ml-2 border p-1 rounded-md bg-gray-100">{{ e.extra_field }}</span>
        </div>
        <div v-if="e.type == 'monitoring_failure'">
          Monitoring failure, cause
          <span class="underline">{{ e.field }}</span>
          <span class="ml-2 border p-1 rounded-md bg-gray-100">{{ e.extra_field }}</span>
        </div>
        <div v-if="e.type == 'alert_sent'">
          Notification sent via {{ e.field }} to
          <span class="underline">{{ e.extra_field }}</span>
        </div>
        <div v-if="e.type == 'acknowledged'">
          Acknowledged by {{ e.field }}
        </div>
      </div>
      <time class="block mb-2 text-sm font-normal leading-none text-gray-400">{{ new Date(e.created_at).toLocaleString() }}</time>
    </li>
  </ol>
</template>

<script>
export default {
  props: ['events'],
}
</script>
