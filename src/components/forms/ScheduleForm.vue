<template>
  <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl pb-8">
    {{ editing ? 'Edit' : 'Create' }} Schedule
  </h2>
  <form @submit.prevent="onSubmit">
    <div class="flex items-center space-x-4">
      <label class="font-bold">Name:</label>
      <input
        v-model="form.name"
        placeholder="Give your schedule a name"
        class="apperance-none cursor-pointer hover:border-gray-300 border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
        type="text"
      >
    </div>

    <div class="mt-4">
      <div class="flex space-x-2 items-center">
        <div @click="addLayer" class="cursor-pointer hover:bg-gray-200 text-gray-700 px-2 py-1 flex items-center">
          <PlusIcon class="w-4 h-4 mr-1"></PlusIcon>
          Add Layer
        </div>
        <div @click="removeLayer" class="cursor-pointer hover:bg-red-500 hover:font-bold hover:text-white text-red-600 px-2 py-1">
          Delete
        </div>
        <div class="md:flex-grow"></div>
        <div class="flex">
          <div
            v-for="(layer, index) in form.layers" :key="index"
            class="px-4 py-2 cursor-pointer"
            :class="activeLayer == index ? 'border-b-4 border-blue-500 bg-blue-100 text-blue-500' : 'border-b-4 border-gray-200 hover:text-blue-400 hover:border-blue-400'"
            @click="activeLayer = index"
          >
            {{ layer.name }}
          </div>
        </div>
      </div>
      <div v-if="activeLayer < form.layers.length" class="">
        <ScheduleLayerForm
          v-model="form.layers[activeLayer]"
          :users="teamMembers"
        />
      </div>

      <InformationCard v-else msg="Add at least one layer to create your schedule."/>
    </div>

    <div class="mt-16">
      <SchedulePreview :layers="form.layers"/>
    </div>

    <div class="flex justify-end my-3">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded focus:outline-none focus:shadow-outline" type="submit">
        {{ editing ? 'Save' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/20/solid'
import useVuelidate from "@vuelidate/core"

import InformationCard from '@/components/InformationCard.vue'
import ScheduleLayerForm from './ScheduleLayerForm.vue'
import SchedulePreview from '@/components/oncall/SchedulePreview.vue'
import { baseLayer, defaultScheduleForm } from '@/components/forms/default.js'

import { scheduleApi } from '@/api/schedule.js'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: {
    editing: { type: Boolean, required: false },
    initialForm: { type: Object }
  },

  data() {
    return {
      activeLayer: 0,
      createdLayers: 1,
      form: defaultScheduleForm,
    }
  },

  methods: {
    addLayer() {
      let newLayer = Object.assign({}, baseLayer)
      newLayer.name = 'Layer ' + (this.createdLayers + 1)
      newLayer.users = []
      this.createdLayers++

      if (this.form.layers.length > 0) {
        this.activeLayer = this.form.layers.length
      }
      this.form.layers.push(newLayer)
    },

    removeLayer() {
      if(this.activeLayer >= 0) {
        this.form.layers.splice(this.activeLayer, 1)
        this.activeLayer = 0
      }
    },

    async onSubmit() {
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      this.$emit('submit')
    },
  },

  computed: {
    teamMembers() {
      return this.$store.state.user.team ? this.$store.state.user.team.members : []
    }
  },

  components: {
    InformationCard,
    PlusIcon,
    ScheduleLayerForm,
    SchedulePreview,
  },

  watch: {
    initialForm: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.form = newValue
      }
    }
  },
  emits: ['submit'],
}
</script>
