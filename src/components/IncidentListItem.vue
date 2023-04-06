<script setup>
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
  import { CheckBadgeIcon, EllipsisHorizontalIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <router-link
    :to="{ name: 'incidentDetail', params: { id: incident.id }}"
    custom
    v-slot="{ navigate }"
  >
  <tr class="cursor-pointer hover:bg-gray-100" @click="navigate" :key="incident.id">
    <td class="px-4 py-3 whitespace-nowrap">
      <div class="flex items-center">
        <div class="flex">
          <span :class="[incident.ended_at !== null ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'px-2 inline-flex text-sm leading-5 font-semibold rounded-full']">
            <div v-if="incident.ended_at !== null">
              <CheckBadgeIcon class="h-6 w-6" aria-hidden="true" />
            </div>
            <div v-else>
              <ExclamationTriangleIcon class="h-6 w-6" aria-hidden="true" />
            </div>
          </span>
        </div>
        <div class="ml-2">
          <div class="text-sm font-semibold">
            {{ incident.monitor_url }}
          </div>
          <div class="text-xs text-gray-500">
            {{ incident.cause }}
          </div>
        </div>
      </div>
    </td>
    <td class="px-4 py-3 whitespace-nowrap">
      <div class="text-xs text-gray-500">{{ new Date(incident.started_at).toLocaleString() }}</div>
    </td>
    <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
      <div v-if="incident.ended_at">{{ getHumanTime( new Date(incident.ended_at) - new Date(incident.started_at) ) }}</div>
      <div v-else>-</div>
    </td>
    <td class="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
      <Menu as="div" @click.stop>
        <MenuButton class="p-1 rounded hover:bg-gray-200">
          <EllipsisHorizontalIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
        </MenuButton>
        <MenuItems class="text-left absolute mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <MenuItem @click.stop>
            <a href="#" onclick="alert('Not implemented')" class="block px-4 py-2 text-sm text-gray-700">Acknowledge</a>
          </MenuItem>
          <MenuItem @click.stop>
            <a href="#" onclick="alert('Not implemented')" class="block px-4 py-2 text-sm text-gray-700">Delete</a>
          </MenuItem>
        </MenuItems>
      </Menu>
    </td>
  </tr>
  </router-link>
</template>

<script>
import humanizeDuration from 'humanize-duration'

export default {
  name: 'IncidentListItem',
  props: {
    incident: Object,
  },
  methods: {
    getHumanTime(timestamp) {
      return humanizeDuration(timestamp, {round: true})
    }
  }
}
</script>
