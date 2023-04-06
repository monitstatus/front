import axios from 'axios'

import { API_URL } from '@/config'
import store from '@/store'
import router from '@/router'


axios.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    console.log("In interceptor", err)
    const statusCode = err.response.status
    if (statusCode === 403) {
      console.log("Intercepted 403 status code, redirecting to SignIn")
      store.commit('logout')
      router.push({name: 'SignIn'})
      console.log("After push to signin")
    }

    return Promise.reject(err)
  }
)


export const userApi = {
  async loginGetToken(username, password) {
    let data = new FormData()
    data.append('username', username)
    data.append('password', password)

    const requestOptions = {
      method: 'POST',
      body: data,
    }

    return fetch(`${API_URL}/login/access-token`, requestOptions)
  },
  async createUser(fullName, email, password, invitation) {
    let userData = {
      'full_name': fullName,
      'email': email,
      'password': password,
    }
    if (invitation !== undefined) {
      userData['invitation'] = invitation
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }

    return fetch(`${API_URL}/users`, requestOptions)
  },
  async getUser(token) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }

    return fetch(`${API_URL}/login/test-token`, requestOptions)
  },
  async verifyUser(token) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }

    return fetch(`${API_URL}/users/verify`, requestOptions)
  },
  async updateUser(user) {
    return axios.put(`${API_URL}/users`, JSON.stringify(user), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async deleteUser() {
    return axios.delete(`${API_URL}/users`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async sendInvitations(emails) {
    return axios.post(`${API_URL}/users/invitations`, JSON.stringify(emails), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async listInvitations() {
    return axios.get(`${API_URL}/users/invitations`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async deleteInvitation(invitationId) {
    return axios.delete(`${API_URL}/users/invitations/${invitationId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async deleteUserFromTeam(userId) {
    return axios.delete(`${API_URL}/users/team/${userId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  }
}
