import { createStore } from 'vuex'
import { userApi } from './api/user'


export default createStore({
  state () {
    return {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user')) || {
        fullName: '',
        email: '',
        isAdmin: false,
      },
    }
  },
  mutations: {
    loginSuccess (state, token) {
      localStorage.setItem('token', token)
      state.token = token
    },
    setUser(state, user) {
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    logout (state) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.token = null
      state.user = {
        fullName: '',
        email: '',
        isAdmin: false,
      }
    }
  },
  actions: {
    getUser(context) {
      return new Promise((resolve, reject) => {
        userApi.getUser(context.state.token)
          .then(response => {
            if (!response.ok) {
              // create error object and reject if not a 2xx response code
              let err = new Error("HTTP status code: " + response.status)
              err.response = response
              err.status = response.status
              throw err
            }
            return response.json()
          })
          .then(user => {
            context.commit('setUser', user)
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    verifyUser(context, { token }) {
      return new Promise((resolve, reject) => {
        userApi.verifyUser(token)
          .then(response => {
            if (!response.ok) {
              // create error object and reject if not a 2xx response code
              let err = new Error("HTTP status code: " + response.status)
              err.response = response
              err.status = response.status
              throw err
            }
            return response.json()
          })
          .then(user => {
            context.commit('loginSuccess', token)
            context.commit('setUser', user)
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    login(context, { username, password }) {
      return new Promise((resolve, reject) => {
        userApi.loginGetToken(username, password)
          .then(response => {
            if (!response.ok) {
              // create error object and reject if not a 2xx response code
              let err = new Error("HTTP status code: " + response.status)
              err.response = response
              err.status = response.status
              throw err
            }
            return response.json()
          })
          .then(token => {
            context.commit('loginSuccess', token['access_token'])
            return context.dispatch('getUser')
              .then(user => resolve(user))
              .catch(error => {
                context.commit('logout')
                reject(error)
              })
          })
          .catch(error => {
            context.commit('logout')
            reject(error)
          })
      })
    },
    register(context, { fullName, username, password, invitation }) {
      return new Promise((resolve, reject) => {
        userApi.createUser(fullName, username, password, invitation)
          .then(response => {
            if (!response.ok) {
              // create error object and reject if not a 2xx response code
              let err = new Error("HTTP status code: " + response.status)
              err.response = response
              err.status = response.status
              throw err
            }
            return response.json()
          })
          .then(user => {
            if(invitation !== undefined) {
              context.commit('login', {username: username, password: password})
            }
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
})