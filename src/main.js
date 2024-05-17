import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const app = createApp(App)
const pinia = createPinia()
app.component('QuillEditor', QuillEditor)

app.use(router)
app.use(pinia)

app.mount('#app')
