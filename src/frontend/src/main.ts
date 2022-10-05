import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'
import { API_URL } from "./defines"

const app = createApp(App)

app.config.globalProperties.$socketio = io(API_URL, {
    auth: {
        id: undefined
    }
});
// app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio;


app.use(router).use(store).mount('#app')
