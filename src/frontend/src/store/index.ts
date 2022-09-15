import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User from '../models/user';

export interface validated {
  validated : boolean
}
export interface user {
  user : User
}

export default createStore({
  state: {
    validated : false,
    user : null,
  },
  getters: {
    isValidated(state) {
      return state.validated
    },
    getUser(state) {
      return state.user
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
