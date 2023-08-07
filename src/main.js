import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';


const app = createApp(App)
app.use(router)
const pinia = createPinia()
app.use(pinia)
app.use(ToastPlugin)


app.mount('#app')
