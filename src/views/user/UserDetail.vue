<template>
   <Head>
      <title>User | Monitstatus</title>
   </Head>

  <Dialog :open="isModalOpen" @close="setIsOpen(false)" class="flex items-center justify-center min-h-screen">
    <DialogPanel class="relative z-10 bg-white rounded-md max-w-sm mx-auto p-8">
      <DialogTitle class="text-xl font-bold">Delete user</DialogTitle>

      <p class="my-3">
        Are you sure you want to permanently delete your user? <span class="font-bold">This action cannot be undone</span>.
      </p>

      <button type="button" @click="setIsOpen(false)" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2">Cancel</button>
      <button type="button" @click="onDelete" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">Delete</button>
    </DialogPanel>
  </Dialog>

  <div class="md:wf-5/6 lg:w-2/3 md:mx-auto pt-10">
    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
      User Profile
    </h2>
    <div v-if="msg" class="mt-10">
      <InformationCard :msg="msg" />
    </div>
    <form @submit.prevent="onSubmit" class="flex flex-col mt-8">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-xl font-medium leading-7 text-gray-900">Personal information</h3>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2 bg-white rounded p-8 grid grid-cols-6 gap-6">
          <div class="col-span-6">
            <label class="text-sm text-gray-500" for="name">
            Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              @blur="v$.form.name.$touch"
              :class="v$.form.name.$error ? 'border-red-500 border-8' : ''"
              class="mt-1 apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.name.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="col-span-6">
            <label class="text-sm text-gray-500" for="email">
            Email
            </label>
            <input
              id="email"
              v-model="form.email"
              @blur="v$.form.email.$touch"
              :class="v$.form.email.$error ? 'border-red-500 border-8' : ''"
              class="mt-1 apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              type="text"
            >
            <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.email.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="col-span-3">
            <label class="text-sm text-gray-500" for="timezone">
            Timezone
            </label>
            <select disabled id="timezone" name="timezone" autocomplete="timezone" class="mt-1 block w-full py-2 px-3 text-gray-700 border bg-white rounded-md shadow-sm focus:shadow-outline focus:border-neutral-500">
              <option>Europe/Madrid</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>
      </div>

      <div class="hidden sm:block" aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <div class="mt-10 sm:mt-0">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
              <h3 class="text-xl font-medium leading-7 text-gray-900">Password</h3>
              <p class="mt-1 text-sm text-gray-600">Change your password</p>
            </div>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-2 bg-white rounded p-8 grid grid-cols-6 gap-6">
            <div class="col-span-6 md:col-span-3">
              <label class="text-sm text-gray-500" for="newPassword">
              New password
              </label>
              <input
                id="newPassword"
                type="password"
                v-model="form.password"
                @blur="v$.form.password.$touch"
                :class="v$.form.password.$error ? 'border-red-500 border-8' : ''"
                class="mt-1 apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              >
              <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.password.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </div>
            <div class="col-span-6 md:col-span-3">
              <label class="text-sm text-gray-500" for="confirmPassword">
              Repeat new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                v-model="form.confirmPassword"
                @blur="v$.form.confirmPassword.$touch"
                :class="v$.form.confirmPassword.$error ? 'border-red-500 border-8' : ''"
                class="mt-1 apperance-none cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              >
              <div class="text-sm text-red-600 mt-2" v-for="error of v$.form.confirmPassword.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden sm:block" aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <div class="mt-10 sm:mt-0">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
              <h3 class="text-xl font-medium leading-7 text-gray-900">Team</h3>
            </div>
          </div>

          <div class="mt-5 md:mt-0 md:col-span-2 bg-white rounded p-8">
            <div v-if="form.team" class="col-span-6 md:col-span-3">
              <label class="text-sm text-gray-500" for="teamName">
              Team name
              </label>
              <input
                id="teamName"
                type="text"
                disabled
                v-model="form.team.name"
                class="mt-1 apperance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline focus:border-neutral-500"
              >
            </div>
            <div v-else>
              <button
                @click.prevent="notImplemented"
                class="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold">
                Create team
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden sm:block" aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <div class="mt-10 sm:mt-0">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
              <h3 class="text-xl font-medium leading-7 text-gray-900">Delete user</h3>
              <p class="mt-1 text-sm text-gray-600">Permanently delete your user and all your data. All data will be lost and can not be recovered.</p>
            </div>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-2 bg-white rounded p-8">
            <button @click.prevent="setIsOpen(true)" class="px-6 py-3 bg-red-500 hover:bg-red-600 rounded text-white font-bold">
              Delete account
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-8">
         <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
           {{ isUpdating ? 'Saving' : 'Save' }}
         </button>
      </div>
    </form>
   </div>
</template>

<script>
import { Head } from '@vueuse/head'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

import useVuelidate from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators'

import { userApi } from '@/api/user'
import InformationCard from '@/components/InformationCard.vue'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    Head,
    Dialog, DialogPanel, DialogTitle,
    InformationCard,
  },
  data() {
    return {
      isModalOpen: false,
      isUpdating: false,
      msg: null,
      form: {
        name: this.$store.state.user.full_name,
        email: this.$store.state.user.email,
        team: this.$store.state.user.team,
        password: null,
        confirmPassword: null,
      }
    }
  },
  validations() {
    return {
      form: {
        name: {
          required: helpers.withMessage('This field cannot be empty', required),
        },
        email: {
          email,
          required: helpers.withMessage('This field cannot be empty', required),
        },
        password: {
          minLength: minLength(8)
        },
        confirmPassword: {
          sameAsPassword: sameAs(this.form.password)
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

      let user = {
        full_name: this.form.name,
        email: this.form.email,
      }

      if (this.form.password) {
        user['password'] = this.form.password
      }

      this.isUpdating = true
      userApi.updateUser(user)
        .then(response => response.data)
        .then(user => {
          this.isUpdating = false
          this.$store.commit('setUser', user)
          this.msg = 'Account updated successfully'
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    onDelete() {
      this.setIsOpen(false)

      userApi.deleteUser()
        .then(response => response.data)
        .then(() => {
          this.$store.commit('logout')
          this.$router.push({name: 'SignUp'})
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    setIsOpen(value) {
      this.isModalOpen = value
    },
    notImplemented() {
      alert('Not implemented')
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
}
</script>
