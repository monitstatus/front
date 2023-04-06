<script setup>
import { Head } from '@vueuse/head'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <Head>
    <title>Escalation policies | Monitstatus</title>
  </Head>

  <h2 class="font-bold text-gray-900 text-3xl">Escalation policies</h2>
  <div class="mt-8 space-y-3">
    <div class="text-lg border-b mb-2 p-4 hover:bg-gray-50">
      Default
    </div>
    <div class="pl-4 font-bold">Escalation Rules</div>
    <div class="pl-8 max-w-lg">
      <div>Notify when an incident is triggered</div>
      <Listbox as="div" v-model="selectedUsers" class="mt-2 relative flex flex-col" multiple>
        <ListboxButton>
        
          <input
            placeholder="Select members or schedules"
            :value="selectedUsers.map((user) => user.name).join(', ')"
            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >

        </ListboxButton>
        <ListboxOptions
          class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="user in users"
            :key="user.id"
            :value="user"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              {{ active }} {{ selected }}
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
                >{{ user.name }}</span
              >
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>

      <div class="mt-6">
        <div class="flex items-center">
          <input value="1" class="bg-white p-1 w-6">
          <div class="pl-2">minute after incident is triggered, notify:</div>
        </div>
        <input
            placeholder="Select members or schedules"
            class="mt-2 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teams: [{name: 'Ops'}, {name: 'Devs'}],
      users: [{id:1, name: 'User Name'}, {id: 2, name: 'Pep Mengano'}],
      selectedUsers: [],
    }
  }
}
</script>
