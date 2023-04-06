<script setup>
  import {
    Dialog, DialogPanel, DialogTitle,
    Menu, MenuButton, MenuItems, MenuItem,
  } from '@headlessui/vue'
  import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <Dialog :open="isModalOpen" @close="setIsOpen(false)" class="flex items-center justify-center min-h-screen">
    <DialogPanel class="relative z-10 bg-white rounded-md max-w-sm mx-auto p-8">
      <DialogTitle class="text-xl">Delete status page</DialogTitle>

      <p class="my-3">
        Are you sure you want to delete the status page {{ statuspage.subdomain }}?
      </p>

      <button type="button" @click="setIsOpen(false)" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2">Cancel</button>
      <button type="button" @click="deleteStatusPage" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">Delete</button>
    </DialogPanel>
  </Dialog>

  <router-link
    :to="{name: 'statusPageEdit', params: {id: statuspage.id}}"
    custom
    v-slot="{ navigate }"
  >
  <div class="cursor-pointer rounded border shadow bg-white p-2" @click="navigate">
    <div class="flex items-center p-2">
      <div class="flex px-3">
        <div
          class="status w-4 h-4 justify-center items-center rounded-full mx-auto"
          :class="statuspage.up ? 'bg-green-600' : 'bg-red-600'" />
      </div>

      <a :href="url" @click.stop target="_blank" class="hover:bg-gray-100 rounded">
        <div class="flex items-center gap-1 p-2 rounded">
          <div>{{ statuspage.subdomain }}</div>
          <div class="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>
      </a>

      <div class="flex-grow"></div>

      <div class="flex">
        <Menu as="div" @click.stop>
          <MenuButton class="p-1 rounded hover:bg-gray-200">
            <EllipsisHorizontalIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
          </MenuButton>
          <MenuItems class="absolute w-24 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem @click.stop>
              <router-link
                :to="{name: 'statusPageEdit', params: {id: statuspage.id}}"
                tag="button" type="button" class="block px-4 py-2 text-sm text-gray-700">
                Edit
              </router-link>
            </MenuItem>
            <MenuItem @click.stop>
              <a :href="url" target="_blank" class="block px-4 py-2 text-sm text-gray-700">View</a>
            </MenuItem>
            <MenuItem @click.stop>
              <a @click="setIsOpen(true)" class="block px-4 py-2 text-sm text-gray-700">Delete</a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  </div>
  </router-link>
</template>

<script>
import { STATUS_PAGES_URL } from '@/config';
import { statusPageApi } from '@/api/statuspage'

export default {
  props: {
    statuspage: { type: Object },
  },
  data() {
    return {
      isModalOpen: false,
    }
  },
  methods: {
    setIsOpen(value) {
      this.isModalOpen = value
    },
    deleteStatusPage() {
      statusPageApi.delete(this.statuspage.id)
        .then(response => response.data)
        .then(() => {
          location.reload()
        })
        .catch(error => {
          alert(error)
        })
    },
  },
  computed: {
    url() {
      return STATUS_PAGES_URL + '/' + this.statuspage.subdomain
    }
  }
}
</script>
