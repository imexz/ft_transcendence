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
  NrMessages=ref<number>(0)
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

          this.socketChat.on('message',() => {
            this.NrMessages.value++
          })

          this.socketChat.on('newMessage',(data) => {
            console.log("newMessage received:");

            let room = this.rooms.value?.find(elem => elem.roomId == data.roomId)
            console.log(room);

            if (room)
            {
              if (data.message.senderId != store.state.user.id)
              {
                ++room.unreadCount
              }
              //   store.state.rooms.find(elem => elem.roomId == room.roomId).unreadCount++

              console.log(data.roomId, data.message, room.unreadCount)
              room.messages = [...room.messages, new Message(data.message)]
              console.log("message was put to store");
            }
            else
              console.log("room for new Message not found");
          })

          this.socketChat.on('newRoom',(data) => {
            console.log('newRoom');
            // this.rooms[this.rooms.length] = new Room(data)
            this.addRoom(data)
            // console.log("newRoom received:", this.rooms[this.rooms.length - 1]);
            // this.dispatch('updateRooms', new Room(data))
          })

          this.socketChat.on('UpdateRoom',(obj: {change: changedRoom, roomId: number, data: any }) => {
            console.log("UpdateRoom received:", obj);
            // console.log("enum test", changedRoom.complet, changedRoom.user);

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
                  break;
                case changedRoom.admin:
                    console.log("admin");
                    this.UserToArray(obj.data, room.admins)
                  break;
                case changedRoom.access:
                  console.log("access");
                  console.log("access", room.users, store.state.user?.id);
                  if (obj.data == Access.private && room.users.findIndex(elem => elem.id == store.state.user?.id) == -1)
                  {
                    console.log("remove room");
                    
                    const index = this.rooms.value.indexOf(room)
                    if( -1 != index) {
                      this.rooms.value.splice(index, 1) //TB check if needs extra check if user is part of the room
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

    }

      UserToArray( user: User, users: User[]) {
        const index = users.findIndex(elem => elem.id == user.id)
        if (index == -1) {
          users.push(user)
        } else {
          users.splice(index, 1)
        }
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
        this.rooms.value = [...this.rooms.value, new Room(room)]
        // this.rooms.$set(this.rooms, this.rooms.length, new Room(room))
        // console.log("ROOM: ", room, room instanceof Room)
        // console.log("this.ROOMS: ", this.rooms, this.rooms[0] instanceof Room)
      }

      leaveRoom(roomId: number) {
        this.socketChat.emit('leave', roomId)
        let room : Room = this.getRoomInfo(roomId)
        if (room)
        {
          room.users = []
          room.admins = []
          room.owner = undefined
          room.messages = []
        }
      }

      getRoomInfo(roomId: number): room {
        const test: Room = this.help.rooms?.find(elem => elem.roomId == roomId)
        return test
      }

      getMessages(roomId: number): Message[]{
        return this.getRoomInfo(roomId)?.messages
      }

}