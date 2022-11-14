import { API_URL } from '@/defines';
import { changedRoom } from '@/store';
import { io, Socket } from 'socket.io-client';
import Message from './message';
import Room, { Access } from './room';
import User from './user';
import VueAxios from 'axios';
import room from './room';
import { ref }  from 'vue';


export default class Chat{
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
            if (room)
            {
              ++room.unreadCount
              console.log(data.roomId, data.message, room.unreadCount)
              room.messages = [...room.messages, new Message(data.message)]
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
            console.log("enum test", changedRoom.complet, changedRoom.user);

            let room = this.rooms?.value?.find(elem => elem.roomId == obj.roomId)
            if (room) {
              console.log("room found");
              switch (obj.change) {
                case changedRoom.complet:
                  room = new Room(obj.data)
                  console.log("room now", room);
                  this.rooms.value = [...this.rooms.value, room]
                  console.log("complet", room);
                  break;
                case changedRoom.user:
                  console.log("user");
                  room.users.push(obj.data as unknown as User)
                  break;
                case changedRoom.admin:
                  console.log("admin");
                  room.admins.push(obj.data as unknown as User)
                  break;
                case changedRoom.access:
                  console.log("access");
                  room.access = obj.data as unknown as Access
                  break;
                default:
                  break;
              }
            }

            // if (room && room.access != Access.private)
            //   room = new Room(data)
            // else if (room)
            //   room = undefined
          })

    }

      socketChat: Socket | null
      NrMessages=ref<number>(0)
      rooms = ref<Room[]>([])


      setRooms(rooms: any) {
        const room = [] as Room[]
        for (let i = 0; i < rooms.length; ++i) {
          room[i] = new Room(rooms[i])
        }
        this.rooms.value = room
        console.log("ROOMS: ", rooms, rooms[0] instanceof Room)
        console.log("this.ROOMS: ", this.rooms, this.rooms[0] instanceof Room)
      }

      addRoom(room: any) {
        // this.rooms[this.rooms.length] = new Room(room)
        this.rooms.value = [...this.rooms.value, new Room(room)]
        // this.rooms.$set(this.rooms, this.rooms.length, new Room(room))
        console.log("ROOM: ", room, room instanceof Room)
        console.log("this.ROOMS: ", this.rooms, this.rooms[0] instanceof Room)
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
        return this.rooms?.value?.find(elem => elem.roomId == roomId)
      }

      getMessages(roomId: number): Message[]{
        return this.getRoomInfo(roomId)?.messages
      }

}