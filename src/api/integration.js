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


export const integrationApi = {
  async getIntegrations() {
    return axios.get(`${API_URL}/integrations`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async createIntegration(integration) {
    return axios.post(`${API_URL}/integrations`, JSON.stringify(integration), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`, 
        'Content-Type': 'application/json',
      }
    })
  },
  async deleteIntegration(integrationId) {
    return axios.delete(`${API_URL}/integrations/${integrationId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
}
