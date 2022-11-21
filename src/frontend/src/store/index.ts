
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User, { UserStatus } from '@/models/user';
import router from '@/router';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { io, Socket } from 'socket.io-client'
import { RequestEnum } from '@/enums/models/RequestEnum';
import Game from '@/models/game';
import Room, { Access } from '@/models/room';
import Message from '@/models/message';
import Chat from '@/models/chat';
import { Settings } from '@/models/gameSettings';



export enum changedRoom {
  complet,
  user,
  admin,
  owner,
  access
}

export interface State {
  validated: boolean
  user: User
  socket: Socket | null
  friendsList: User[] | null
  NrFriendRequests: number
  requester: User | null
  // game: Game | null
  chat: Chat
  // customized: boolean
  // showGame: boolean
  // settings: Settings
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
{ validated: true, user: user, socket: null,  socketChat: null,  socketGame: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, requester: null, game: null, winner: null, loser: null, customized: false, showGame: false , chat: null, settings: new Settings()}:
{ validated: false, user: null,  socket: null,  socketChat: null,  socketGame: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, requester: null, game: null, winner: null, loser: null, customized: false, showGame: false , chat: null, settings: new Settings()};

export default createStore<State>({

  state: initialState,
  getters: {

  },
  mutations: {
    logOut(state) {
      state.validated = false;
      console.log("store logOut()");
      // state.socketGame.emit('leaveGame')
      state.socket.disconnect();
      router.push('/')
    },
    logIn(state, user) {

      // console.log("logIn");

      state.validated = true;
      state.user = user;
      console.log("logIn index", user);

      state.socket = io(API_URL, {
          auth: {
              id: document.cookie
          }
      })

      console.log("socketGame established");
      
      state.chat = new Chat()

      // console.log("game socket init");
      console.log(document.cookie);

	    // state.socketGame.on('disconnecting', () => {
		  //   console.log("game socket disconnecting");
		  //   console.log(state.socketGame);
	    // })

      state.socket.on('GameRequestFrontend',(user: User) => {
        console.log("GameRequestFrontend");
        
        state.requester = user;
        // state.showGame = true;
        console.log("receive askformatch");
      })
      state.socket.on('resetRequester', () => {
        console.log("receive resetRequester");
        state.requester = null;
      })
      state.socket.on('NowInGame', () => {
        console.log("receive NowInGame");
          router.push('/')
      })
      state.socket.on('Request',(data) => {
        state.friendsList.push(data)
        console.log("receive  request");
      })
    },
    changeUserName(state, username) {
      state.user.username = username;
    },
    setTwoFa(state, enable) {
      state.user.isTwoFactorAuthenticationEnabled = enable;
    },
    setFriendsList(state, friendsList) {
      // console.log(friendsList);
      state.friendsList = friendsList;
    },
    addFriend(state, user) {
      state.friendsList?.push(user)
    },
    removeFriend(state, id) { //todo make better
      const index = state.friendsList?.findIndex(element => element.id == id)
      if (index != -1)
        state.friendsList?.splice(state.friendsList?.findIndex(element => element.id == id) , 1)
    }

  },
  actions: {
    logOut({ commit }) {
      commit('logOut');
      document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
      this.state.user = null;
      // console.log(router.currentRoute.value.path)
      if (router.currentRoute.value.path != '/login/tfa')
        router.push("/login");
    },
    validateUser({ commit, dispatch }){
      return VueAxios({
        url: '/users/validate',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
      .then(response => {
        commit('logIn', response.data)
        localStorage.setItem('user', JSON.stringify(user));


          return true
        }
      )
      .catch(error => {
        // console.log(error);

          dispatch('logOut')
        }
      )
    },
    getFriendsList({ commit }) {
      VueAxios({
        url: 'friends',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
      .then(response => { commit('setFriendsList', response.data) } )
      .catch()
    },
    updateRooms({ commit }, room ) {
      console.log("index.rooms", room);
      commit('addRoom', room);
    },
    logIn({ commit }, user) {
      commit("logIn", user)
    }
  },

  modules: {
  }
})
