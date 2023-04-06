import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import FloatingVue from 'floating-vue'

import 'floating-vue/dist/style.css'
import './assets/tailwind.css'

import App from './App.vue'
import router from './router'
import store from './store'


const app = createApp(App)
const head = createHead()

app.use(store)
app.use(router)
app.use(head)
app.use(FloatingVue)


app.mount('#app')
