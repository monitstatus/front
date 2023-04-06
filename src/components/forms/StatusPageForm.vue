<template>
  <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate pb-8">
    {{ editing ? 'Edit' : 'Create' }} Status page
  </h2>

  <form @submit.prevent="onSubmit">
    <Disclosure :defaultOpen="true" v-slot="{ open }">
      <DisclosureButton>
        <StepHeader :open="open" msg="Define basic settings" :number="1" />
      </DisclosureButton>
      <DisclosurePanel class="ml-5 pl-16 my-1 pt-2 pb-5 border-l-4 border-blue-400">
        <div class="grid grid-cols-6 lg:grid-cols-12 gap-4">
          <div class="col-span-6">
            <label class="text-sm text-gray-500" for="companyName">
              Company Name
            </label>
            <input
              id="companyName"
              placeholder="Your Company"
              v-model="form.companyName"
              @blur="v$.form.companyName.$touch"
              :class="v$.form.companyName.$error ? 'border-red-500 border-8' : ''"
              class="apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.companyName.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="col-span-6">
            <label class="text-sm text-gray-500" for="companyWebsite">
              Company Website
            </label>
            <input
              id="companyWebsite"
              placeholder="http://"
              v-model="form.companyWebsite"
              @blur="v$.form.companyWebsite.$touch"
              :class="v$.form.companyWebsite.$error ? 'border-red-500 border-8' : ''"
              class="apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.companyWebsite.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="col-span-6">
            <label class="text-sm text-gray-500" for="subdomain">
              Status page URL
            </label>
            <div class="flex items-center">
              <div class="flex mr-1 text-gray-500">{{ baseUrl }}/</div>
              <input
                id="subdomain"
                placeholder=""
                v-model="form.subdomain"
                @blur="v$.form.subdomain.$touch"
                :class="v$.form.subdomain.$error ? 'border-red-500 border-8' : ''"
                class="flex-auto apperance-none cursor-pointer border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
                type="text"
              >
            </div>
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.subdomain.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <Disclosure :defaultOpen="true" v-slot="{ open }">
      <DisclosureButton>
        <StepHeader :open="open" msg="Select monitors" :number="2" />
      </DisclosureButton>
      <DisclosurePanel class="ml-5 pl-16 my-1 pt-2 pb-5">
    <div style="height: 100px" class="flex" v-if="isLoading">
      <clip-loader class="m-auto" size="40px"></clip-loader>
    </div>
        <div v-else>
          <div class="text-sm text-red-600 mb-2" v-for="error of v$.form.monitor_ids.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
          <div v-if="monitors.length > 0" class="grid grid-cols-3 gap-4">
            <div
              v-for="m in monitors" :key="m.id"
              :class="form.monitor_ids.includes(m.id) ? 'border-blue-400 hover:border-gray-300' : 'border-gray-300 hover:border-blue-400'"
              class="flex cursor-pointer rounded-md border-4 items-center p-3 col-span-3 md:col-span-1"
              @click="toogleMonitor(m.id)"
            >
              <div class="flex-auto flex-col">
                <div class="flex items-center">
                  <div
                    class="status rounded-full w-2 h-2 items-center rounded-full mr-1.5"
                    :class="m.up ? 'bg-green-500' : 'bg-red-500'" />
                  <div>{{ m.name }}</div>
                </div>
                <div class="text-sm">{{ m.endpoint }}</div>
              </div>
              <div class="flex">
                <CheckCircleIcon class="h-8 w-8" :class="form.monitor_ids.includes(m.id) ? 'text-blue-400' : 'text-gray-300'" />
              </div>
            </div>
          </div>
          <div v-else>
            <WarningCard>
              You should <router-link :to="{name: 'addMonitor'}"><span class="underline px-1">create your first monitor</span></router-link> first!
            </WarningCard>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <div class="flex justify-end mt-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
        {{ editing ? 'Save' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

import useVuelidate from "@vuelidate/core"
import { alphaNum, required, url, helpers } from '@vuelidate/validators'

import StepHeader from './StepHeader.vue'
import WarningCard from '../WarningCard.vue'
import { monitorApi } from '@/api/monitor'
import { STATUS_PAGES_URL } from '@/config'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: {
    editing: { type: Boolean, default: false },
    initialForm: { type: Object }
  },
  data() {
    return {
      form: {
        companyName: null,
        subdomain: null,
        companyWebsite: null,
        monitor_ids: [],
      },
      isLoading: false,
      monitors: [],
    }
  },
  validations() {
    return {
      form: {
        companyName: { required },
        subdomain: { required, alphaNum },
        companyWebsite: { required, url },
        monitor_ids: { required: helpers.withMessage('You need to select at least a monitor', required) },
      }
    }
  },
  components: {
    CheckCircleIcon,
    ClipLoader,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    StepHeader,
    WarningCard
  },
  mounted() {
    this.fetchMonitors()
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      this.$emit('submit')
    },
    fetchMonitors() {
      this.isLoading = true
      monitorApi.getMonitors()
        .then((response) => {
          this.monitors = response.data
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    toogleMonitor(monitor_id) {
      if (this.form.monitor_ids.includes(monitor_id)) {
        this.form.monitor_ids.splice(this.form.monitor_ids.indexOf(monitor_id), 1)
      } else {
        this.form.monitor_ids.push(monitor_id)
      }
    }
  },
  computed: {
    baseUrl() {
      return STATUS_PAGES_URL
    }
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
