import axios from 'axios'
import store from '@/store'


import {
  API_URL, FRONT_URL, SLACK_CLIENT_ID,
} from '@/config'


export const slackApi = {
  async obtainOauthAccess(code) {
    return axios.post(`${API_URL}/integrations/slackOauthAccess`, {}, {
      headers: { 'Authorization': `Bearer ${store.state.token}` },
      params: { code },
    })
  },

  helpers: {
    authorizationUrl: `https://slack.com/oauth/v2/authorize?scope=commands%2Cincoming-webhook%2Cusers%3Aread%2Cusers%3Aread.email&redirect_uri=${encodeURIComponent(FRONT_URL)}%2Fintegrations%2Fslack&client_id=${SLACK_CLIENT_ID}`
  }
}
