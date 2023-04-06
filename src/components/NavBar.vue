<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

import NavLink from './NavLink.vue'
</script>

<template>
  <Disclosure as="nav" class="border-b border-gray-300" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center md:invisible sm:visible">
          <!-- Mobile menu button-->
          <DisclosureButton class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
          <a href="/monitors" class="shrink-0 flex items-center">
            <img class="h-8 w-auto" src="@/assets/monitstatus.svg" alt="Monitstatus" />
          </a>
          <div v-if="isLoggedIn" class="hidden md:block md:ml-6">
            <div class="flex space-x-4">
              <router-link
                :to="{name: 'monitorList'}"
                custom
                v-slot="{ href, navigate, isActive }"
              >
                <NavLink text="Monitors" :href="href" :navigate="navigate"  :isActive="isActive" />
              </router-link>
              <router-link
                :to="{name: 'incidentList'}"
                custom
                v-slot="{ href, navigate, isActive }"
              >
                <NavLink text="Incidents" :href="href" :navigate="navigate"  :isActive="isActive" />
              </router-link>
              <router-link
                to="/oncall"
                custom
                v-slot="{ href, navigate, isActive }"
              >
                <NavLink text="On Call" :href="href" :navigate="navigate"  :isActive="isActive" />
              </router-link>
              <router-link
                to="/integrations"
                custom
                v-slot="{ href, navigate, isActive }"
              >
                <NavLink text="Integrations" :href="href" :navigate="navigate"  :isActive="isActive" />
              </router-link>
              <router-link
                to="/statuspages"
                custom
                v-slot="{ href, navigate, isActive }"
              >
                <NavLink text="Status pages" :href="href" :navigate="navigate"  :isActive="isActive" />
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="isLoggedIn" class="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
          <button type="button" class="p-1 rounded-full text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-200">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="avatarImage" alt="" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="z-50 origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <router-link
                    to="/user"
                    custom
                    v-slot="{ href, navigate }"
                  >
                    <a :href="href" @click="navigate" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">User profile</a>
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="#" @click="$store.commit('logout')" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <div v-else>
          <div as="div" class="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
            <router-link
              :to="{name: 'SignIn'}"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a key="signin" :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
                :class="[isActive ? 'bg-gray-200' : '', 'hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium']">
                Sign In
              </a>
            </router-link>
            <router-link
              :to="{name: 'SignUp'}"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a key="signup" :href="href" @click="navigate"  :aria-current="isActive ? 'page' : undefined"
              :class="[isActive ? 'bg-gray-200' : 'text-gray-600 hover:bg-gray-300', 'px-3 py-2 rounded-md text-sm font-medium']">
                Sign Up
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <DisclosurePanel v-if="open" class="md:invisible sm:visible">
      <div class="px-2 pt-2 pb-3 space-y-2 flex flex-col">
        <router-link
          :to="{name: 'monitorList'}"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <NavLink text="Monitors" :href="href" :navigate="navigate"  :isActive="isActive" />
        </router-link>
        <router-link
          to="/incidents"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <NavLink text="Incidents" :href="href" :navigate="navigate"  :isActive="isActive" />
        </router-link>
        <router-link
          to="/oncall"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <NavLink text="On Call" :href="href" :navigate="navigate"  :isActive="isActive" />
        </router-link>
        <router-link
          to="/integrations"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <NavLink text="Integrations" :href="href" :navigate="navigate"  :isActive="isActive" />
        </router-link>
        <router-link
          to="/statuspages"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <NavLink text="Status pages" :href="href" :navigate="navigate"  :isActive="isActive" />
        </router-link>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import md5 from 'md5'

export default {
  computed: {
    isLoggedIn() {
      return this.$store.state.token !== null
    },
    avatarImage() {
      const fullName = this.$store.state.user.full_name ? this.$store.state.user.full_name.replace(/\s/g, '+') : 'Random User'
      const address = this.$store.state.user.email.trim().toLowerCase()
      const hashedAddress = md5(address)
      return `https://www.gravatar.com/avatar/${hashedAddress}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${fullName}/48/0D8ABC/fff`
    }
  },
}
</script>
