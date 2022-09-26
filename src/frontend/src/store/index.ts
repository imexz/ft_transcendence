
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User from '@/models/user';


export interface validated {
  validated : boolean
}
export interface user {
  user : User
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
  {validated: true, user: user, socket: null}:
  {validated: false, user: null,  socket: null}

export default createStore({

  state: initialState,
  getters: {
    isLogged(state) {
      return state.validated
    },
    getUser(state) {
      return state.user
    },
    getSocket(state) {
      return state.socket
    }

  },
  mutations: {
    logOut(state) {
      state.validated = false;
    },
    logIn(state, user) {
      state.validated = true;
      state.user = user;
    },
    changeUserName(state, username) {
      state.user.unique_name = username;
    },
    resetAvatar(state) {
      state.user.avatar_url = state.user.avatar_url_42intra;
    }
  },
  actions: {
    logOut({ commit }) {
      commit('logOut');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
    },
    logIn({ commit }, user) {
      commit('logIn', user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  modules: {
  }
})

