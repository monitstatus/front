<template>
  <Head>
    <title>Sign up | Monitstatus</title>
  </Head>

  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="showActivateAccountMsg" class="text-center space-y-8">
      <div class="text-3xl">Almost there!</div>
      <div>
        Go to your email inbox and <span class="font-semibold">activate your account</span> to proceed.
      </div>
      <div>Already confirmed? Then you can <a class="underline" href="/user/sign-in">sign in</a></div>.
    </div>
    <div v-else class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for free</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          {{ ' ' }}
          <router-link :to="{name: 'SignIn'}" class="font-medium text-blue-600 hover:text-blue-500">Sign in</router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" action @submit.prevent="register">
        <div v-if="errorMsg" class="bg-red-100 text-red-600 text-sm rounded font-medium p-4">
          {{ errorMsg }}
        </div>
        <div v-if="v$.$errors.length > 0" class="bg-red-100 text-red-600 text-sm rounded font-medium p-4">
          <div v-for="error of v$.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>

        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="fullName" class="sr-only">Full name</label>
            <input
              v-model="fullName"
              id="fullName"
              name="fullName"
              type="text"
              autocomplete="fullName"
              @blur="v$.fullName.$touch" :class="v$.fullName.$error ? 'border-red-500 text-red-500 border-4 z-50' : ''"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:shadow-outline focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Full name"
            />
          </div>
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              v-model="emailAddress"
              id="email"
              name="email"
              type="text"
              autocomplete="email"
              @blur="v$.emailAddress.$touch" :class="v$.emailAddress.$error ? 'border-red-500 text-red-500 border-4 z-50' : ''"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:shadow-outline focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              @blur="v$.password.$touch" :class="v$.password.$error ? 'border-red-500 text-red-500 border-4 z-50' : ''"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:shadow-outline focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label for="password2" class="sr-only">Repeat Password</label>
            <input
              v-model="password2"
              id="password2"
              name="password2"
              type="password"
              autocomplete="current-password"
              @blur="v$.password2.$touch" :class="v$.password2.$error ? 'border-red-500 text-red-500 border-4 z-50' : ''"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:shadow-outline focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Repeat password"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-blue-300 group-hover:text-blue-200" aria-hidden="true" />
            </span>
            Sign up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { Head } from '@vueuse/head'
import { LockClosedIcon } from '@heroicons/vue/20/solid'

import useVuelidate from '@vuelidate/core'
import { required, email, helpers, sameAs } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    fullName: "",
    emailAddress: "",
    password: "",
    password2: "",
    showActivateAccountMsg: false,
    errorMsg: null,
  }),
  validations() {
    return {
      fullName: {
        required: helpers.withMessage('Full name cannot be empty', required)
      },
      emailAddress: {
        email: helpers.withMessage('Email is not a valid address', email),
        required: helpers.withMessage('Email cannot be empty', required)
      },
      password: {
        required: helpers.withMessage('Password cannot be empty', required)
      },
      password2: {
        sameAsPassword: helpers.withMessage('Confirmation password should match password', sameAs(this.password)),
        required: helpers.withMessage('Confirmation password cannot be empty', required)
      },
    }
  },
  components: { Head, LockClosedIcon },
  methods: {
    async register() {
      console.log(this.$route.query.invitation)
      const result = await this.v$.$validate()
      if (!result) {
        // notify user form is invalid
        return
      }
      this.$store.dispatch('register', {
        fullName: this.fullName,
        username: this.emailAddress,
        password: this.password,
        invitation: this.$route.query.invitation,
      })
        .then(() => {
          if (this.$route.query.invitation !== undefined) {
            this.$router.push({name: 'monitorList'})
          }
          this.showActivateAccountMsg = true
        })
        .catch((error) => {
          if(error.response.status == 400) {
            error.response.json().then((json) => this.errorMsg = json.detail)
          } else {
            alert(error)
          }
        })
    }
  }
}
</script>
