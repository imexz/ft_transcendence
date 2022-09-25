import { createStore, storeKey } from 'vuex'
import VueAxios from 'axios';

import User from '../models/user';
import { hostURL } from '@/models/host';


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
    setUser(user: User) {
      state.user = user
    }
    setValidate(validate: boolean) {
      state.validate = validate
    }
  },
  actions: {
    getUser(context) {
      console.log("test get User");
      
      VueAxios({
        url: '/users/validate',
        baseURL: hostURL + ':3000',
        method: 'GET',
        withCredentials: true,
      })
      .then(response => {
        context.state.validated = true,
        context.state.user = response.data})
      .catch(error => {
        context.state = false
        return false
      })
    }

  },
  modules: {
  }
})

