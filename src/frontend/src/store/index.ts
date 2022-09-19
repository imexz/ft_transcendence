import VueAxios from 'vue-axios';
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User from '../models/user';

export interface validated {
  validated : boolean
}
export interface user {
  user : User
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
  {validated: true, user: user}:
  {validated: false, user: null}

export default createStore({

  state: initialState,
  getters: {
    isLogged(state) {
      return state.validated
    },
    getUser(state) {
      return state.user
    }
  },
  mutations: {
    logOut(state) {
      state.validated = false;
    },
    logIn(state, user) {
      state.validated = true;
      state.user = user;
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
