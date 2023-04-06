<script setup>
import { Head } from '@vueuse/head'
import { EnvelopeIcon, PaperAirplaneIcon, TrashIcon } from '@heroicons/vue/24/outline'

import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Header from '@/components/headers/Header.vue'
</script>

<template>
  <Head>
    <title>Members | Monitstatus</title>
  </Head>

  <ConfirmationModal
    :isOpen="modal.isOpen"
    title="Delete user from team"
    :description="`Are you sure that you want to remove ${modal.payload.full_name ? modal.payload.full_name : 'the invitation'} from the team?`"
    @confirm="('is_active' in modal.payload) ? deleteUserFromTeam(modal.payload.id) : deleteInvitation(modal.payload.id); setIsOpen(false, {})"
    @cancel="setIsOpen(false, {})"
  />

  <Header
    itemName="Member"
    ctaLinkRouteName="addOnCallUsers"
    :showSearch="true"
    @search="(input) => $emit('search', input)"
  />

  <div class="border-2 rounded-lg mt-8">
    <div class="grid grid-cols-6 px-4 py-1 border-b-2 bg-gray-100 leading-8 text-gray-600">
      <div class="col-span-4">
        User
      </div>
      <div class="col-span-1">Role</div>
      <div class="col-span-1"></div>
    </div>

    <div
      v-for="(user, i) in members"
      :key="i"
      class="grid grid-cols-6 border-b bg-white py-2 px-4 items-center hover:bg-gray-50"
    >
      <div class="col-span-4">
        <div class="flex flex-col">
          <div class="text-gray-900 text-lg">{{ user.full_name }}</div>
          <div class="text-sm">{{ user.email }}</div>
        </div>
      </div>
      <div>
        <div v-if="user.is_active">
          {{ user.team_role.charAt(0).toUpperCase() + user.team_role.slice(1) }}
        </div>
        <div v-if="!('is_active' in user)" class="text-sm flex space-x-1 items-center">
          <EnvelopeIcon class="h-3 w-3" />
          <div>Invitation sent</div>
        </div>
      </div>
      <div class="flex justify-end">
        <div class="flex space-x-1">
          <div
            v-if="!('is_active' in user)"
            @click="notImplemented()"
            class="p-2 rounded hover:bg-gray-100"
            title="Resend invitation"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </div>
          <div
            v-if="user.team_role !== 'owner'"
            @click="setIsOpen(true, user)"
            class="p-2 rounded hover:bg-gray-100 cursor-pointer"
            title="Delete"
          >
            <TrashIcon class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { userApi } from '@/api/user'

export default {
  data() {
    return {
      invitations: {
        isLoading: false,
        payload: [],
      },
      modal: {
        isOpen: false,
        payload: {},
      }
    }
  },

  mounted() {
    this.fetchInvitations()
  },

  methods: {
    fetchInvitations() {
      this.invitations.isLoading = true
      userApi.listInvitations()
        .then((response) => {
          this.invitations.payload = response.data
          this.invitations.isLoading = false
        })
        .catch(error => {
          this.invitations.isLoading = false
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    deleteInvitation(invitationId) {
      userApi.deleteInvitation(invitationId)
        .then((response) => {
          this.fetchInvitations()
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    deleteUserFromTeam(userId) {
      userApi.deleteUserFromTeam(userId)
        .then((response) => {
          this.$store.state.user.team.members = this.$store.state.user.team.members.filter((u) => u.id !== userId)
        })
        .catch(error => {
          if (error.response.status != 403) {
            alert(error)
          }
        })
    },
    notImplemented() {
      alert('Not implemented')
    },
    setIsOpen(value, payload) {
      this.modal.isOpen = value
      this.modal.payload = payload
    }
  },

  computed: {
    members() {
      const teamMembers = this.$store.state.user.team ? this.$store.state.user.team.members : []
      return teamMembers.concat(this.invitations.payload)
    },
  }
}
</script>
