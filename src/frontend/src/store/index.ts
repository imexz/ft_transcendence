
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User from '@/models/user';
import router from '@/router';
import VueAxios from 'axios';
import { API_URL } from '@/defines';



export interface State {
  validated: boolean
  user: User
  socket: null
  friendsList: User[] | null
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
  {validated: true, user: user, socket: null, friendsList: null}:
  {validated: false, user: null,  socket: null, friendsList: null};

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
      state.validated = true;
      state.user = user;
    },
    changeUserName(state, username) {
      state.user.username = username;
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
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
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

