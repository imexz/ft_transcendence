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
  faChevronUp,
  faGavel,
  faCommentSlash,
  faX,
  faCheck,
  faTrophy,
  faComment,

  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import io from 'socket.io-client'

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
  faChevronUp,
  faGavel,
  faCommentSlash,
  faX,
  faCheck,
  faTrophy,
  faComment,
)


const app = createApp(App)

// app.config.compilerOptions.isCustomElement = (tag) => {
//   return tag.startsWith('vue-advanced-')
// }

// app.config.globalProperties.$socketio =
// app.config.globalProperties.$socketgame = app.config.globalProperties.$socketchat = app.config.globalProperties.$socketio;


app
  .use(router)
  .use(store)
  .component("fontAwesomeIcon", FontAwesomeIcon)
  .mount('#app')

