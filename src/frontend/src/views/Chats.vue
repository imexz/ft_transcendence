<template>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      @send-message="sendMessage($event.detail[0])"
      @add-room="makePopup()"
      @room-action-handler="roomActionHandler($event.detail[0])"
      @typing-message="emitTyping($event.detail[0])"
      @fetch-messages="updateMessages($event.detail[0])"
    />
    <creatRoomPopup
      v-if="popupTrigger"
      :TogglePopup="() => makePopup()" >
      <h2>Creat Room</h2>
    </creatRoomPopup>
  </template>
  
  <script >
  import { register } from 'vue-advanced-chat'
  import { io } from 'socket.io-client';
  import { ref } from 'vue';
  import VueAxios from 'axios';
  import { API_URL } from '@/defines';
  import creatRoomPopup from '@/components/Chat/creatRoomPopup.vue';


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
          socket: io,
          popupTrigger: ref(false)
        }
      },
      components:{
        creatRoomPopup,
      },
      methods: {
        async updateMessages(room) {
          console.log("updateMessages");
          this.socket.emit('findAllMessages', {roomId: room.roomId}, (response) => {
            console.log(response);
            this.messages = response;
          })
        },
        sendMessage(message) {
          console.log("sendMessage");
          this.socket.emit('createMessage', { roomId: message.roomId, content: message.content}, (response) =>
          {
            console.log(response);
            // this.messages.push(response)
            
          })
        },
        makePopup() {
          console.log("makePopup");
          this.popupTrigger = !this.popupTrigger
          if (this.popupTrigger == false) {
            this.getRooms()
          }
          console.log(this.popupTrigger);
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
      
        emitTyping(roomId) {
          this.socket.emit('typing', {isTyping: true, roomId: roomId});
          this.timeout = setTimeout(() => {
            this.socket.emit('typing', { isTyping: false, roomId: roomId});
          }, 2000);
          console.log("emit typing ");
          console.log(roomId);
          
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
        this.currentUserId = this.$store.getters.getUser.id;
        this.initSocket();
        console.log("mounted CHAT");
        console.log(this.$store.getters.getUser.id)
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