
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User from '@/models/user';
import router from '@/router';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { io, Socket } from 'socket.io-client'




export interface State {
  validated: boolean
  user: User
  socket: Socket | null
  friendsList: User[] | null
  NrMessages: number
  NrFriendRequests: number
  chatRequest: boolean
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
  {validated: true, user: user, socket: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, chatRequest: false}:
  {validated: false, user: null,  socket: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, chatRequest: false};

export default createStore<State>({

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
    },
    getFriends(state) {      
      return state.friendsList
    } 
  },
  mutations: {
    logOut(state) {
      state.validated = false;
    },
    logIn(state, user) {
      console.log("logIn");
      
      state.validated = true;
      state.user = user;
      state.socket = io(API_URL, {
          auth: {
              id: document.cookie
          }
      });
      console.log(document.cookie);
      state.socket.on('message',() => {
        state.NrMessages++
      })
      state.socket.on('friendRequest',() => {
        state.NrFriendRequests++
      })
      state.socket.on('chatRequest',() => {
        state.chatRequest = true;
      })
    },
    changeUserName(state, username) {
      state.user.username = username;
    },
    setTwoFa(state, enable) {
      state.user.isTwoFactorAuthenticationEnabled = enable;
    },
    resetAvatar(state) {
      state.user.avatar_url = state.user.avatar_url_42intra;
    },
    setFriendsList(state, friendsList) {
      state.friendsList = friendsList;
    },
    addFriend(state, user) {
      state.friendsList?.push(user)
    },
    removeFriend(state, id) { //todo make better
      const index = state.friendsList?.findIndex(element => element._id == id)
      if (index != -1)
        state.friendsList?.splice(state.friendsList?.findIndex(element => element._id == id) , 1)
    }
  },
  actions: {
    logOut({ commit }) {
      commit('logOut');
      document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
      console.log(router.currentRoute.value.path)
      if (router.currentRoute.value.path != '/login/tfa')
        router.push("/login");
    },
    logIn({ commit }, user) {
      commit('logIn', user);
      localStorage.setItem('user', JSON.stringify(user));
    },
    getFriendsList({ commit }) {
      VueAxios({
        url: '/users/friends',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
      .then(response => { commit('setFriendsList', response.data)})
      .catch()
    }
  },
  modules: {
  }
})

