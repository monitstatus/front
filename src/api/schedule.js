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

export const scheduleApi = {
  async getSchedules() {
    return axios.get(`${API_URL}/schedules`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async getScheduleDetail(scheduleId) {
    return axios.get(`${API_URL}/schedules/${scheduleId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async updateSchedule(scheduleId, schedule) {
    return axios.put(`${API_URL}/schedules/${scheduleId}`, JSON.stringify(schedule), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async deleteSchedule(scheduleId) {
    return axios.delete(`${API_URL}/schedules/${scheduleId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async createSchedule(schedule) {
    return axios.post(`${API_URL}/schedules`, JSON.stringify(schedule), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`, 
        'Content-Type': 'application/json',
      }
    })
  },

  helpers: {
    mapLayerPayloadToFields(layer) {
      const timeStrToDict = (str) => ({ "hours": str.slice(0, 2), "minutes": str.slice(3, 5) })
      console.log("mapLayerPayloadToFields", layer)
      return {
        name: layer.name,
        start: new Date(layer.start_time),
        rotation: layer.rotation_type,
        users: layer.users,
        handoffTime: layer.handoff_time
          ? timeStrToDict(layer.handoff_time)
          : { "hours": 0, "minutes": 0 },
        restrictionDay: {
          from: layer.restriction_day_start
            ? timeStrToDict(layer.restriction_day_start)
            : { "hours": 12 , "minutes": 0 },
          to: layer.restriction_day_end
            ? timeStrToDict(layer.restriction_day_end)
            : { "hours": 12, "minutes": 0 },
        },
        // TODO not hardcoded but from the backend
        restrictionWeek: {
          from: '',
          to: '',
        }
      }
    },
    mapLayerFieldsToPayload(layer) {
      console.log("mapLayerFieldsToPayload", layer)
      return {
        name: layer.name,
        start_time: layer.start,
        rotation_type: layer.rotation,
        handoff_time: `${layer.handoffTime.hours}:${layer.handoffTime.minutes}`,
        restriction_day_start: `${layer.restrictionDay.from.hours}:${layer.restrictionDay.from.minutes}`,
        restriction_day_end: `${layer.restrictionDay.to.hours}:${layer.restrictionDay.to.minutes}`,
        // TODO to api payload the datetime :/
        restriction_week_start: null,
        restriction_week_end: null,
        users: layer.users.map((user) => user.id),
      }
    },
    mapFormFieldsToSchedulePayload(form) {
      return {
        name: form.name,
        layers: form.layers.map(this.mapLayerFieldsToPayload),
      }
    }
  }
}
