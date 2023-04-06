import { startOfDay  } from 'date-fns'

export const baseLayer = {
  name: 'Layer 1',
  users: [],
  rotation: 'weekly',
  start: startOfDay(new Date()),
  handoffTime: { "hours": 0, "minutes": 0 },
  restrictionDay: {
    from: { "hours": 12, "minutes": 0 },
    to: { "hours": 12, "minutes": 0 },
  },
  restrictionWeek: {
    from: '',
    to: '',
  }
}

export const defaultScheduleForm = {
  name: '',
  layers: [baseLayer]
}

export const defaultMonitorForm = {
  monitorType: 'http',
  url: 'https://',
  endpoint: '',
  alertType: 'unavailable',
  keyword: '',
  periodicity: 120,
  name: '',
  method: 'GET',
  verifySsl: true,
  sslCheckExpiration: 30,
  domainExpiration: '0',
  recoveryPeriod: '0',
  confirmationPeriod: '0',
  requestTimeout: 30,
  requestBody: null,
  requestHeaders: [{name: '', value: ''}],
  requestFollowRedirects: true,
  requestKeepCookiesRedirecting: true,
  alertSendEmail: true,
  basicAuth: {
    user: '',
    pass: '',
  },
  numPings: 4,
  port: null,
  data: null,
}
