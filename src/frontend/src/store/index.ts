import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'


export default createStore({
  state: {
    validated : false,
    user : null
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
