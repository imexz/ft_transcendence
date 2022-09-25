import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'
import { hostURL } from './models/host'

const app = createApp(App)

app.config.globalProperties.$socketio = io(hostURL + ":3000", {
    auth: {
        token: ""
    },
    reconnectionDelayMax: 10000000,
    reconnectionDelay: 100000,
    reconnection: true
});
app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio 

// app.config.globalProperties.$socketgame = io(hostURL + ":3000" + "/game", {
//     withCredentials: true
//     // reconnectionDelayMax: 10000000,
//     // reconnectionDelay: 100000,
//     // reconnection: false,
//     // multiplex: true
    
    
// });
// app.config.globalProperties.$socketchat = io(hostURL + ":3000" + "/chat", {
//     withCredentials: true,
//     auth: {
//         token: ""
//     },
//     // reconnectionDelayMax: 10000000,
//     // reconnectionDelay: 100000,
//     // reconnection: false,
//     // multiplex: true


// });


app.use(router).use(store).mount('#app')