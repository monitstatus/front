import { createRouter, createWebHistory } from 'vue-router'

import ListBase from '../views/ListBase.vue'
import OnCallBase from '../views/oncall/OnCallBase.vue'
import store from '@/store'


const routes = [
  {
    path: '/',
    redirect: '/monitors',
  },
  {
    path: '/monitors',
    name: 'MonitorList',
    component: ListBase,
    children: [
      { path: '',  name: 'monitorList', component: () => import('../views/monitors/MonitorList.vue') },
      { path: ':id', name: 'monitorDetail', component: () => import('../views/monitors/MonitorDetail.vue') },
      { path: ':id/edit', name: 'monitorEdit', component: () => import('../views/monitors/EditMonitor.vue') },
      { path: 'new', name: 'addMonitor', component: () => import('../views/monitors/NewMonitor.vue') }
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/oncall',
    component: OnCallBase,
    children: [
      { path: '', redirect: {name: 'onCallSchedules'} },
      {
        path: 'schedules',
        children: [
          {path: '', name: 'onCallSchedules', component: () => import('../views/oncall/Schedules.vue') },
          { path: ':id/edit', name: 'scheduleEdit', component: () => import('../views/oncall/EditSchedule.vue') },
          { path: 'new', name: 'addSchedule', component: () => import('../views/oncall/NewSchedule.vue') },
        ]
      },
      {
        path: 'users',
        children: [
          { path: '', name: 'onCallUsers', component: () => import('../views/oncall/Members.vue') },
          { path: 'add', name: 'addOnCallUsers', component: () => import('../views/oncall/InviteMembers.vue') },
        ]
      },
      { path: 'escalation', name: 'onCallEscalation', component: () => import('../views/oncall/EscalationPolicies.vue')},
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/incidents',
    name: 'Incidents',
    component: ListBase,
    children: [
      { path: '', name: 'incidentList', component: () => import('../views/incidents/Incidents.vue') },
      { path: ':id', name: 'incidentDetail', component: () => import('../views/incidents/IncidentDetail.vue') },
      { path: 'new', name: 'addIncident', component: () => import('../views/incidents/NewIncident.vue') },
      { path: ':id/acknowledge', name: 'acknowledgeIncident', component: () => import('../views/incidents/AcknowledgeIncident.vue')},
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/integrations',
    name: 'Integrations',
    component: ListBase,
    children: [
      { path: '', name: 'integrationList', component: () => import('../views/integrations/Integrations.vue') },
      { path: 'slack', name: 'slackIntegration', component: () => import('../views/integrations/Slack.vue') },
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/statuspages',
    name: 'StatusPages',
    meta: {
      requiresAuth: true
    },
    component: ListBase,
    children: [
      { path: '', name: 'statusPagesList', component: () => import('../views/statuspages/StatusPages.vue')},
      { path: 'new', name: 'addStatusPage', component: () => import('../views/statuspages/NewStatusPage.vue')},
      { path: ':id/edit', name: 'statusPageEdit', component: () => import('../views/statuspages/EditStatusPage.vue')},
    ]
  },
  {
    path: '/user/sign-in',
    name: 'SignIn',
    component: () => import('../views/user/SignIn.vue')
  },
  {
    path: '/user/sign-up',
    name: 'SignUp',
    component: () => import('../views/user/SignUp.vue')
  },
  {
    path: '/user/verification',
    name: 'UserVerification',
    component: () => import('../views/user/UserVerification.vue')
  },
  {
    path: '/user',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/user/UserDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.state.token == null) {
      next({ name: 'SignIn' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
