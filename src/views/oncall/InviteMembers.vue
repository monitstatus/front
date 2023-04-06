<template>
  <Head>
    <title>Invite members | Monitstatus</title>
  </Head>

  <BreadCrumb :url="{name: 'onCallUsers'}" header="Members" />
  <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate pb-8">
    Invite Members
  </h2>

  <form @submit.prevent="onSubmit" class="flex flex-col space-y-4 mt-10">
    <label class="flex flex-col text-center">
      <div class="font-bold text-lg">
        Email addresses where to send invitations
      </div>
      <div class="font-light">
        Invite new members by email to join your organization.
      </div>
    </label>
    <div class="lg:w-1/2 lg:mx-auto">
      <input v-model="form.emails" class="p-2 w-full rounded" placeholder="Enter one or more emails">
      <div class="text-sm text-red-600 mt-1" v-for="error of v$.form.emails.$errors" :key="error.$uid">
        <div>{{ error.$message }}</div>
      </div>
    </div>
    <div class="flex justify-center">
      <button class="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
        Send invitations
      </button>
    </div>
  </form>
</template>

<script>
import { Head } from '@vueuse/head'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import BreadCrumb from '@/components/BreadCrumb.vue'
import { userApi } from '@/api/user'


export default {
  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {
      form: {
        emails: '',
      }
    }
  },

  validations() {
    const emailOrListOfEmails = value => {
      if (typeof value === 'undefined' || value === null || value === '') {
        return true
      }
      return /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/.test(value)
    }
    return {
      form: {
        emails: {
          required: helpers.withMessage("An email or a comma sepparated list of emails is required.", required),
          emailOrListOfEmails: helpers.withMessage("This must be an email or a comma separated list of emails.", emailOrListOfEmails),
        }
      }
    }
  },

  methods: {
    async onSubmit() {
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      const emails = this.form.emails.split(',').map(e => e.trim())
      userApi.sendInvitations(emails)
        .then(response => response.data)
        .then(data => {
          console.log("Ok send")
          console.log(data)
          this.$router.push({name: 'onCallUsers'})
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    }
  },

  components: { BreadCrumb, Head },
}
</script>
