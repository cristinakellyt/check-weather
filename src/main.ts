import './assets/tailwind.css'

import BaseModal from '@/components/common/BaseModal.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('base-modal', BaseModal)
app.mount('#app')
