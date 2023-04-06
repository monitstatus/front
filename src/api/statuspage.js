import axios from 'axios'

import { API_URL } from '@/config'
import store from '@/store'


export const statusPageApi = {
  async list() {
    return axios.get(`${API_URL}/statuspages`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async get(id) {
    return axios.get(`${API_URL}/statuspages/${id}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async create(statuspage) {
    return axios.post(`${API_URL}/statuspages`, JSON.stringify(statuspage), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async update(id, statuspage) {
    return axios.put(`${API_URL}/statuspages/${id}`, JSON.stringify(statuspage), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async delete(id) {
    return axios.delete(`${API_URL}/statuspages/${id}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
}
