import { createStore, storeKey } from 'vuex'
import VueAxios from 'axios';
import io from 'socket.io-client'
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
    socket : io,

  },
  getters: {
    isValidated(state) {
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
        context.state.user = response.data
        context.state.socket = io(hostURL + ":3000", {
              auth: {
                  token: context.state.user.id
              },
              reconnectionDelayMax: 10000000,
              reconnectionDelay: 100000,
              reconnection: true
          })
          console.log("test");
      })
      .catch(error => {
        context.state.validated = false
        return false
      })
    }

  },
  modules: {
  }
})

