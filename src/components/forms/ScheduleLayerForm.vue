<template>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4">
  <div class="grid grid-cols-2 gap-4 items-center">
    <label class="text-right font-bold">
      Name:
    </label>
    <input v-model="modelValue.name" @input="$emit('update:modelValue', modelValue)" class="p-2 w-full rounded border border-gray-200 cursor-pointer hover:border-gray-300" type="text">
  
    <label class="text-right font-bold">
      Rotation type:
    </label>
    <div class="flex relative">
      <select
        v-model="modelValue.rotation"
        class="appearance-none pr-6 p-2 w-full rounded bg-white border border-gray-200 cursor-pointer hover:border-gray-300"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="custom">Custom</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  
    <label class="text-right font-bold">
      Start time for this layer:
    </label>
    <Datepicker
      class=""
      :clearable="false"
      v-model="modelValue.start"
    />

    <label class="text-right font-bold">
      Handoff time:
    </label>
    <Datepicker
      :timePicker="true"
      :clearable="false"
      v-model="modelValue.handoffTime"
    />
  
    <label class="text-right font-bold">
      Restrict on-call shifts to specific times of the day:
    </label>
    <div class="flex items-center space-x-2">
      <Datepicker
        :timePicker="true"
        :clearable="false"
        minutesIncrement="5"
        v-model="modelValue.restrictionDay.from"
      />
      <div>to</div>
      <Datepicker
        :timePicker="true"
        :clearable="false"
        minutesIncrement="5"
        v-model="modelValue.restrictionDay.to"
      />
    </div>
  </div>

  <div class="">
    <label class="text-right font-bold self-start">
      Add users to rotation:
    </label>
    <div class="mt-1">
      <div v-if="modelValue.users.length > 0" class="">
        <ul>
          <li
            v-for="user in modelValue.users"
            :key="user.id"
            class="flex relative"
          >
            <div class="absolute top-2 left-3 h-16 border-l-4 border-blue-400"></div>
            <div class="pl-2 pt-2">
              <div class="rounded-full w-3 h-3 border-2 border-blue-400 bg-white absolute"></div>
            </div>

            <div class="pl-8 pb-3 w-full">
              <div class="flex">
                <div>
                  <div class="text-sm">{{ user.full_name }}</div>
                  <div class="text-xs">{{ user.email }}</div>
                </div>
                <div class="grow"></div>
                <div class="cursor-pointer" @click="removeUser(user.id)">
                  <TrashIcon class="h-4 w-4" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="flex items-center">
        <div class="mx-2 rounded-full w-3 h-3 border-2 border-blue-400 bg-white absolute"></div>
          <Listbox
            v-model="modelValue.users"
            multiple
            by="id"
            class="w-full pl-8"
          >
            <div class="relative">
              <ListboxButton
                class="relative w-full border border-gray-200 hover:border-gray-300 cursor-pointer rounded bg-white py-2 pl-3 pr-10 text-left">
                <span>Add a user</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </span>
              </ListboxButton>
              <ListboxOptions
                class="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ selected, active }"
                  v-for="person in users"
                  :key="person.id"
                  :value="person"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span>{{ person.full_name }}</span>
                    <span
                      v-if="(selected)"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { TrashIcon } from '@heroicons/vue/24/outline'

import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  emits: ['update:modelValue'],

  props: {
    modelValue: { type: Object },
    users: { type: Array },
  },

  methods: {
    removeUser(userId) {
      this.modelValue.users = this.modelValue.users.filter(u => u.id !== userId)
    }
  },

  components: {
    CheckIcon,
    ChevronDownIcon,
    Datepicker,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TrashIcon,
  }
}
</script>