<template>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      @send-message="sendMessage($event.detail[0])"
      @add-room="creatRoom()"
      @room-action-handler="roomActionHandler($event.detail[0])"
      @typing-message="emitTyping()"
    />
    <CreatRoomPopup>
      
    </CreatRoomPopup>
  </template>
  
  <script >
  import { register } from 'vue-advanced-chat'
  import { io } from 'socket.io-client';
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';
  import { CreatRoomPopup } from '@/components/Chat/creatRoomPopup.vue';



  register()
  
    export default {
      data() {
        return {
          currentUserId: '1234',
          rooms: [],
          messages: [],
          roomActions: [
            { name: 'inviteUser', title: 'Invite User' },
            { name: 'removeUser', title: 'Remove User' },
            { name: 'deleteRoom', title: 'Delete Room' }
          ],
          socket: io
        }
      },
      components:{
        CreatRoomPopup,
      },
      methods: {
        async updateMessages() {
          this.socket.emit('findAllMessages', {room_name: this.room_name}, (response) => {
            console.log(response);
            this.messages = response;
          })
        },
        sendMessage(message) {
          console.log("sendMessage");
          this.socket.emit('createMessage', { room_name: message.roomId, content: message.content}, (response) =>
          {
            console.log(response);
            this.messages.push(response)
            
          })
        },
        creatRoom(){
            VueAxios({
                url: '/chatroom/creat',
                baseURL: API_URL,
                method: 'POST',
                withCredentials: true,
                data: { room_name: "test", access: "public"}
            })
                .then(response => {
                  console.log(response);
                  if(response != null) {
                    const rooms = []
                    for (let i = 0; i < response.length; i++) {
                      rooms.push(response)
                    }
                    this.rooms = rooms
                    this.$emit('success', 'creat Room')
                    console.log("succes");
                  }
                })
                .catch(error => { this.$emit('error') })
        },
      
        emitTyping() {
          this.socket.emit('typing', {isTyping: true, room_name: this.room_name});
          this.timeout = setTimeout(() => {
            this.socket.emit('typing', { isTyping: false, room_name: this.room_name});
          }, 2000);
          console.log("emit typing ");
          console.log(this.room_name);
          
        },
        getRooms(){
            VueAxios({
                url: '/chatroom/all',
                baseURL: API_URL,
                method: 'GET',
                withCredentials: true,
            })
                .then(response => {
                console.log(response.data);
                
                this.rooms = response.data
                })
                .catch()
        },
        initSocket(){
          this.socket = io(API_URL, {
            auth: (cb) => {
                    cb({ id: this.$store.getters.getUser.id })
                  }
                })
        },
        roomActionHandler(roomId, action) {
          console.log("roomActionHandler");
        }

      },
      mounted() {
        this.getRooms();
        this.initSocket();
        this.currentUserId = this.$store.getters.getUser.id;
        console.log("mounted CHAT");
      }      
    }
</script>

<!-- <script lang="ts">
    import { register } from 'vue-advanced-chat'
    
      export default {
        data() {
          return {
            register: register,
            currentUserId: '1234',
            rooms: [],
            messages: [],
            roomActions: [
              { name: 'inviteUser', title: 'Invite User' },
              { name: 'removeUser', title: 'Remove User' },
              { name: 'deleteRoom', title: 'Delete Room' }
            ]
          }
        }
      }
</script> -->