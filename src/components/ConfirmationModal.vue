<script setup>
  import {
    Dialog, DialogPanel, DialogTitle,
  } from '@headlessui/vue'
</script>

<template>
  <Dialog :open="isOpen" @close="$emit('cancel')" class="relative z-50 items-center">
    <div class="fixed inset-0 flex items-center justify-center p-4">

    <DialogPanel class="relative z-10 bg-white rounded-md max-w-sm mx-auto p-8">
      <DialogTitle class="text-xl">{{ title }}</DialogTitle>

      <p class="my-3">
        {{ description }}
      </p>

      <button type="button" @click="$emit('cancel')" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2">Cancel</button>
      <button type="button" @click="$emit('confirm')" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">
        {{ confirmMsg }}
      </button>
    </DialogPanel>
    </div>
  </Dialog>
</template>

<script>
export default {
  emits: ['cancel', 'confirm'],
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String 
    },
    description: {
      type: String,
    },
    confirmMsg: {
      type: String,
      default: "Delete",
    }
  },
}
</script>
