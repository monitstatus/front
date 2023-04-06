import axios from 'axios'
import qs from 'qs'

import {
  SLACK_CLIENT_ID, SLACK_CLIENT_SECRET
} from '@/config'


export const slackApi = {
  async obtainOauthAccess(code) {

    let formData = {
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code: code,
      redirect_uri: 'https://app.monitstatus.com/integrations/slack',
    }
    console.log("Requesting oauth token with data", formData)
    return axios.post('https://slack.com/api/oauth.v2.access', qs.stringify(formData), { headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }})
  },

  helpers: {
    authorizationUrl: 'https://slack.com/oauth/v2/authorize?scope=commands%2Cincoming-webhook%2Cusers%3Aread%2Cusers%3Aread.email&redirect_uri=https%3A%2F%2Fapp.monitstatus.com%2Fintegrations%2Fslack&client_id=' + SLACK_CLIENT_ID
  }
}
