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


export const monitorApi = {
  async getMonitors() {
    return axios.get(`${API_URL}/monitors`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async getMonitorDetail(monitorId) {
    return axios.get(`${API_URL}/monitors/${monitorId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async updateMonitor(monitorId, monitor) {
    return axios.put(`${API_URL}/monitors/${monitorId}`, JSON.stringify(monitor), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
      }
    })
  },
  async deleteMonitor(monitorId) {
    return axios.delete(`${API_URL}/monitors/${monitorId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async getMonitorResults(monitorId, sinceDate) {
    return axios.get(`${API_URL}/monitors/${monitorId}/results`, {
      params: {since: sinceDate.toISOString()}, 
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
      },
    })
  },
  async getMonitorStatus(monitorId, startDate, interval) {
    return axios.get(`${API_URL}/monitors/${monitorId}/status`, {
      headers: {'Authorization': `Bearer ${store.state.token}`},
      params: { start_date: startDate, interval: interval },
    })
  },
  async createMonitor(monitor) {
    return axios.post(`${API_URL}/monitors`, JSON.stringify(monitor), {
      headers: {
        'Authorization': `Bearer ${store.state.token}`, 
        'Content-Type': 'application/json',
      }
    })
  },
  async getIncidents() {
    return axios.get(`${API_URL}/incidents`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async getIncidentDetail(incidentId) {
    return axios.get(`${API_URL}/incidents/${incidentId}`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async getIncidentEvents(incidentId) {
    return axios.get(`${API_URL}/incidents/${incidentId}/events`, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },
  async acknowledgeIncident(incidentId) {
    return axios.post(`${API_URL}/incidents/${incidentId}/acknowledge`, null, {
      headers: {'Authorization': `Bearer ${store.state.token}`}
    })
  },

  helpers: {
    mapFormFieldsToMonitorPayloadData(form) {
      return {
        name: form.name,
        monitor_type: form.monitorType,
        endpoint: form.monitorType == 'http' ? form.url : form.endpoint,
        alert_type: form.alertType,
        keyword: form.keyword,
        periodicity: form.periodicity,
        http_method: form.method,
        request_timeout: form.requestTimeout,
        request_body: form.requestBody,
        // convert from list of {name:, value:} to dict
        request_headers: Object.assign(
          {},
          ...form.requestHeaders.filter(x => x.name != '').map((x) => ({[x.name]: x.value}))
        ),
        verify_ssl: form.verifySsl,
        ssl_check_expiration: form.sslCheckExpiration,
        follow_redirects: form.requestFollowRedirects,
        keep_cookies_between_redirects: form.requestKeepCookiesRedirecting,
        auth_user: form.basicAuth.user,
        auth_pass: form.basicAuth.pass,
        send_email: form.alertSendEmail,
        num_pings: form.numPings,
        port: form.port,
        data: form.data,
        // recovery_period: this.form.recoveryPeriod,
        // confirmation_period: this.form.confirmationPeriod,
        // domain_expiration: this.form.domainExpiration,
      }
    },
  },
}
