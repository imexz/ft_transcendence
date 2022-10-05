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
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import io from 'socket.io-client'

library.add(faMagnifyingGlass, faBars, faGear, faMessage)


const app = createApp(App)

// app.config.globalProperties.$socketio ;
// app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio;


app
  .use(router)
  .use(store)
  .component("fontAwesomeIcon", FontAwesomeIcon)
  .mount('#app')
