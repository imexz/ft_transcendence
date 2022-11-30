
import { createStore } from 'vuex'
import User from '@/models/user';
import router from '@/router';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { io, Socket } from 'socket.io-client'
import Chat from '@/models/chat';
import GameRequest from '@/models/GameRequest';
import { Status } from '@/enums/models/ResponseEnum';


export enum changedRoom {
  complet,
  user,
  admin,
  owner,
  access
}

export interface State {
  validated: boolean
  user: User | null
  socket: Socket | null
  friendsList: User[] | null
  NrMessages: number
  NrFriendRequests: number
  gameRequest: GameRequest | null
  chat: Chat | null

  toastShow: boolean
  toastMode: string
  toastMsg: string
}

const storage = localStorage.getItem('user');
const user = storage?JSON.parse(storage):null;
const initialState = {
  validated: false,
  user: null,
  socket: null,
  socketChat: null,
  socketGame: null,
  friendsList: null,
  NrMessages: 0,
  NrFriendRequests: 0,
  gameRequest: null,
  chat: null,
  toastShow: false,
  toastMode: "",
  toastMsg: "",
}
if (user != null) {
  initialState.user = user;
  initialState.validated = true;
}

export default createStore<State>({

  state: initialState,
  getters: {

  },
  mutations: {
    logOut(state) {
      state.validated = false;
      console.log("store logOut()");
      // state.socketGame.emit('leaveGame')
      if (state.socket != null && state.socket != undefined) {
        state?.socket.disconnect();
        router.push('/login')
      }
    },
    logIn(state, user) {
      state.validated = true;
      state.user = user;
      state.socket = io(API_URL, {
          auth: {
              id: document.cookie
          }
      })

      console.log("socketGame established");

      if (state.chat === null) {
        state.chat = new Chat()
      }

      // console.log("game socket init");
      console.log(document.cookie);

      state.socket.on('GameRequestFrontend',function (data, ack) {
        console.log("GameRequestFrontend", data, ack);
        state.gameRequest = new GameRequest()

        state.gameRequest.user = data.user;
        state.gameRequest.settings = data.settings;
        state.gameRequest.response = ack

        console.log("receive askformatch");
        // ack({data: "weil"})
        // state.showGame = true;
      })
      state.socket.on('resetRequester', () => {
        console.log("receive resetRequester");
        state.gameRequest = null;
      })
      state.socket.on('NowInGame', () => {
        console.log("receive NowInGame");
          router.push('/')
      })
      state.socket.on('Request',(data) => {
        state.friendsList?.push(data)
        state.NrFriendRequests++
        console.log("receive  request");
      })
      state.socket.on('updateFriend', (data) => {
        console.log("updateFriend", data);
        console.log(state.friendsList);
        let user = state.friendsList?.find(elem => elem.id == data.id)

        if (user != undefined && user != null)
        {
          console.log(user);
          if (data.status != Status.denied)
            user.friendStatus = data.status
          else
            state.friendsList?.splice(state.friendsList?.findIndex(elem => elem.id == user?.id), 1)
        }

      })
    },
    changeUserName(state, username) {
      if (state.user?.username)
        state.user.username = username;
    },
    setTwoFa(state, enable) {
      if (state.user?.isTwoFactorAuthenticationEnabled)
        state.user.isTwoFactorAuthenticationEnabled = enable;
    },
    setFriendsList(state, friendsList) {
      state.friendsList = friendsList;
    },
    addFriend(state, user) {
      user.friendStatus = Status.pending
      state.friendsList?.push(user)
    },
    removeFriend(state, id) { //todo make better
      const index = state.friendsList?.findIndex(element => element.id == id)
      if (index != -1)
        state.friendsList?.splice(state.friendsList?.findIndex(element => element.id == id) , 1)
    },
    changeToast(state, toastObj: {show: boolean, mode: string, msg: string}) {
      state.toastShow = toastObj.show;
      state.toastMode = toastObj.mode;
      state.toastMsg = toastObj.msg;
    },
  },
  actions: {
    logOut({ commit }) {
      commit('logOut');
      document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
      this.state.user = null;
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
          this.dispatch('triggerToast', {mode: 'error', show: true, msg: 'Could not validate user'})
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
      .catch(error =>  this.dispatch('triggerToast', {mode: 'error', show: true, msg: 'Could not load Friendlist'}))
    },
    triggerToast({commit}, toastObj:{show: boolean, mode: string, msg: string}) {
      commit('changeToast', toastObj);
      const toastReset = {
        show: false,
        mode: "",
        msg: ""
      }
      setTimeout(() => this.commit('changeToast', toastReset), 2200)
    }
  },
})
