import { API_URL } from '@/defines';
import { changedRoom } from '@/store';
import { io, Socket } from 'socket.io-client';
import Message from './message';
import Room, { Access } from './room';
import User from './user';
import VueAxios from 'axios';
import room from './room';
import { ref, reactive }  from 'vue';
import store from '../store/index'


export default class Chat{
[x: string]: any;

  socketChat: Socket | null
  rooms = ref<Room[]>([])
  help = reactive({rooms: this.rooms})

  constructor() {
    console.log("constructor Caht");

          VueAxios({
            url: 'chatroom/all',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true
          })
          .then(response => {
            this.setRooms(response.data)
          })

          this.socketChat = io(API_URL + "/chat", {
            auth: {
              id: document.cookie
            }
          })

          this.socketChat.on('newMessage',(data) => {
            console.log("newMessage received:");

            if (data.message.senderId != store.state.user.id)
            {
              if (store.state.NrMessages != undefined)
                store.state.NrMessages++
            }

            let room = this.rooms.value?.find(elem => elem.roomId == data.roomId)

            if (room)
            {
              if (data.message.senderId != store.state.user.id)
              {
                ++room.unreadCount
              }
              room.messages = [...room.messages, new Message(data.message)]
            }
            else
              console.log("room for new Message not found");
          })

          this.socketChat.on('newRoom',(data) => {
            console.log('newRoom');
            this.addRoom(data)
          })

          this.socketChat.on('UpdateRoom',(obj: {change: changedRoom, roomId: number, data: any }) => {
            console.log("UpdateRoom received:", obj);

            let room = this.rooms?.value?.find(elem => elem.roomId == obj.roomId)
            if (room) {
              console.log("room found");
              switch (obj.change) {
                case changedRoom.complet:
                  let roomIndex = this.rooms?.value?.findIndex(elem => elem.roomId == obj.roomId)
                  if (roomIndex != -1) {

                    this.rooms.value[roomIndex] = new Room(obj.data)
                  }
                  // console.log("room now", room);
                  // this.rooms.value.forEach(element => {
                    //   if (element.roomId == room.roomId)
                    //     element = room
                    // });
                    this.rooms.value = [...this.rooms.value]
                    console.log("over ride room", this.rooms.value);
                  // console.log("complet", room);
                  break;
                case changedRoom.user:
                  console.log("user");
                  this.UserToArray(obj.data, room.users)
                  if (room.admins.findIndex(elem => elem.id == obj.data.id) != -1)
                    this.removeUser(index, room.admins)
                  break ;
                case changedRoom.admin:
                  console.log("admin");
                  this.UserToArray(obj.data, room.admins)
                  var index = room.users.findIndex(elem => elem.id == obj.data.id)
                  if (index != -1)
                    this.removeUser(index, room.users)
                  break;
                case changedRoom.access:
                  console.log("access", room.users, store.state.user?.id);
                  if (obj.data == Access.private && room.users.findIndex(elem => elem.id == store.state.user?.id) == -1)
                  {
                    const index = this.rooms.value.indexOf(room)
                    if( -1 != index) {
                      this.rooms.value.splice(index, 1)
                    }
                  }
                  room.access = obj.data as unknown as Access
                  break;
                default:
                  break;
              }
            } else {
              if (changedRoom.complet == obj.change) {
                 this.addRoom(obj.data)
               }
             }

            // if (room && room.access != Access.private)
            //   room = new Room(data)
            // else if (room)
            //   room = undefined
          })

          this.socketChat.on("banned", (data: {roomId: number, roomName: string}) => {
            let room : Room = this.getRoomInfo(data.roomId)
            if (room)
            {
              room.users = []
              room.admins = []
              room.owner = undefined
              room.messages = []
            }

            let roomName = room.roomName
            const msg = "You are banned from " + roomName;
            store.dispatch('triggerToast', {show: true, mode: 'banned', msg: msg})
          })

    }

      UserToArray( user: User, users: User[]) {
        const index = users.findIndex(elem => elem.id == user.id)
        if (index == -1) {
          this.addUser(user, users)
        } else {
          this.removeUser(index, users)
        }
      }

      addUser(user: User, users: User[]) {
        users.push(new User(user))
      }

      removeUser(index: number, users: User[]) {
        users.splice(index, 1)
      }

      setRooms(rooms: any) {
        const room = [] as Room[]
        for (let i = 0; i < rooms.length; ++i) {
          room[i] = new Room(rooms[i])
        }
        this.rooms.value = room
        // console.log("ROOMS: ", rooms, rooms[0] instanceof Room)
        // console.log("this.ROOMS: ", this.rooms, this.rooms[0] instanceof Room)
      }

      addRoom(room: any) {
        // this.rooms[this.rooms.length] = new Room(room)
        console.log("adding room to store", room);

        this.rooms.value = [...this.rooms.value, new Room(room)]
        // this.rooms.$set(this.rooms, this.rooms.length, new Room(room))
        // console.log("ROOM: ", room, room instanceof Room)
        // console.log("this.ROOMS: ", this.rooms, this.rooms[0] instanceof Room)
      }

      leaveRoom(roomId: number) {
        this.socketChat.emit('leave', roomId, (response) => {
          let room : Room = this.getRoomInfo(roomId)
          console.log("RESPONSE HERE AFTER LEAVE", response);
          if (response == true) {
            if (room) {
              room.users = []
              room.admins = []
              room.owner = undefined
              room.messages = []
              store.dispatch('triggerToast', {show: true, mode: 'success', msg: "You left " + room.roomName})
            }
          }
          else {
            store.dispatch('triggerToast', {show: true, mode: 'error', msg: "You can not leave " + room.roomName})
          }
        })
      }

      getRoomInfo(roomId: number): room {
        const test: Room = this.help.rooms?.find(elem => elem.roomId == roomId)
        return test
      }

      getMessages(roomId: number): Message[]{
        return this.getRoomInfo(roomId)?.messages
      }

}