import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'
import Toast, { PluginOptions, POSITION } from "vue-toastification";

const app = createApp(App)

app.config.globalProperties.$socketio ;
app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio;

const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT
};

app.use(router).use(store).use(Toast, toastOptions).mount('#app')
