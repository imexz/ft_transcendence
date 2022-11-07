
import { Vue } from 'vue-class-component'
import { createStore, storeKey } from 'vuex'
import User, { UserStatus } from '@/models/user';
import router from '@/router';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { io, Socket } from 'socket.io-client'
import { RequestEnum } from '@/enums/models/RequestEnum';
import Game from '@/models/game';
import Room from '@/models/room';




export interface State {
  validated: boolean
  user: User
  socket: Socket | null
  socketGame: Socket | null
  socketChat: Socket | null
  friendsList: User[] | null
  NrMessages: number
  NrFriendRequests: number
  gameRequest: User | null
  rooms: Room[]
  game: Game | null
  pendingRequest: boolean
  winner: User | null
}

const storage = localStorage.getItem('user')
const user = storage?JSON.parse(storage):null;
const initialState = user?
  {validated: true, user: user, socket: null,  socketChat: null,  socketGame: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, gameRequest: null, game: null, pendingRequest: false, winner: null}:
  {validated: false, user: null,  socket: null,  socketChat: null,  socketGame: null, friendsList: null, NrMessages: 0, NrFriendRequests: 0, gameRequest: null, game: null, pendingRequest: false, winner: null};

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
    },
    getRooms(state) {
      return state.rooms
    }
  },
  mutations: {
    logOut(state) {
      state.validated = false;
      state.socket.disconnect();
    },
    logIn(state, user) {
      // console.log("logIn");

      state.validated = true;
      state.user = user;
      state.socket = io(API_URL, {
          auth: {
              id: document.cookie
          }
      })
      // console.log("default socket init");

      state.socketChat = io(API_URL + "/chat", {
        auth: {
          id: document.cookie
        }
      })
      // console.log("chat socket init");
      state.socketGame = io(API_URL + "/game", {
        auth: {
          id: document.cookie
        }
      })

      console.log("game socket init");
      console.log(document.cookie);

	  state.socketGame.on('disconnecting', () => {
		console.log("game socket disconnecting");
		console.log(state.socketGame.rooms);
	  })

      state.socketChat.on('message',() => {
        state.NrMessages++
      })

      state.socketChat.on('newMessage',(data) => {
        console.log("newMessage received:");

        console.log(state.rooms[data.roomId]/* .messages.push(data.message) */)
      })


      state.socketGame.on('GameRequestFrontend',(user: User) => {
        state.gameRequest = user;
        console.log("receive askformatch");
      })
      state.socketGame.on('NowInGame', (cb) => {
        // state.game = game;
        console.log("receive NowInGame");
        if (cb) {
			state.pendingRequest = false;
			router.push('/play')
		}
        else {
          state.game = null;
          state.pendingRequest = false;
          router.push('/')
        }
      })
	  state.socketGame.on('canceled', () => {
		console.log("receive invite canceled");
		state.gameRequest = null;
		state.pendingRequest = false;
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
    },
    setRooms(state, rooms: any) {
      state.rooms = [] as Room[]
      // console.log(state.rooms instanceof Room);

      for (let i = 0; i < rooms.length; ++i)
      {
        state.rooms.push(new Room(rooms[i]))
      }
      // state.rooms = rooms
      console.log("ROOMS: ", rooms, rooms[0] instanceof Room)
      console.log("state.ROOMS: ", state.rooms, state.rooms[0] instanceof Room)
    },
  },
  actions: {
    logOut({ commit }) {
      commit('logOut');
      document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
      localStorage.removeItem('user');
      // console.log(router.currentRoute.value.path)
      if (router.currentRoute.value.path != '/login/tfa')
        router.push("/login");
    },
    logIn({ commit }, user) {
      commit('logIn', user);
      localStorage.setItem('user', JSON.stringify(user));
      VueAxios({
        url: 'chatroom/all',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true
      })
      .then(response => { commit('setRooms', response.data); console.log("rooms after api call: ", response.data);
      })
    },
    getFriendsList({ commit }) {
      VueAxios({
        url: 'friends',
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
