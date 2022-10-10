import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMagnifyingGlass,
  faBars,
  faGear,
  faMessage,
  faEye,
  faUserPlus,
  faUserMinus,
  faQuestion,
  faTableTennisPaddleBall,
  faBan,
  faXmark,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import io from 'socket.io-client'
import { API_URL } from "./defines"

library.add(
  faMagnifyingGlass,
  faBars,
  faGear,
  faMessage,
  faEye,
  faUserPlus,
  faUserMinus,
  faQuestion,
  faBan,
  faTableTennisPaddleBall,
  faXmark,
)


const app = createApp(App)

app.config.globalProperties.$socketio = io(API_URL, {
    auth: {
        id: undefined
    }
});
// app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio;


app
  .use(router)
  .use(store)
  .component("fontAwesomeIcon", FontAwesomeIcon)
  .mount('#app')
