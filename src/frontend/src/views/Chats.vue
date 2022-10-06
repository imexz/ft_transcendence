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
          currentUserId: '',
          rooms: [],
          messages: [],
          roomActions: [
            { name: 'join', title: 'join Room' },
            { name: 'leave', title: 'leave Room' },
            { name: 'deleteRoom', title: 'Delete Room' }
          ],
          // socket: io,
          popupTrigger: ref(false),
          timeout: 0

        }
      },
      components:{
        creatRoomPopup,
      },
      methods: {
        async updateMessages(room) {
          console.log("updateMessages");
          console.log(room.room.roomId);
          this.$socketio.emit('findAllMessages', {roomId: room.room.roomId}, (response) => {
            console.log(response);
            this.messages = response;
          })
        },
        sendMessage({ roomId, content, files, replyMessage, usersTag }) {
          console.log("createMessage");
          this.$socketio.emit('createMessage', { roomId: roomId, content: content}, (response) =>
          {
            console.log("createMessage response");
            console.log(response);
            this.addMessage(response)
          })
        },
        makePopup() {
          console.log("makePopup");
          this.popupTrigger = !this.popupTrigger
          if (this.popupTrigger == false) {
            this.getRooms()
            this.initSocket()
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
      
        emitTyping({ roomId, message }) {
          // console.log(message);
          // this.$socketio.emit('typing', {isTyping: true, roomId: roomId});
          // this.timeout = setTimeout(() => {
          //   this.$socketio.emit('typing', { isTyping: false, roomId: roomId.roomId});
          // }, 2000);
          // console.log("emit typing ");
          // console.log("roomId");
          // console.log(roomId.roomId);
          
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
          // this.socket = io(API_URL, {
          //   auth: (cb) => {
          //           cb({ id: this.$store.getters.getUser._id })
          //         }
          //       })
          this.$socketio.auth.id = this.$store.getters.getUser._id;
          console.log("initSocket");
          console.log(this.$store.getters.getUser._id);
          this.$socketio.disconnect().connect()
        },
        roomActionHandler({ roomId, action }) {
          console.log("roomActionHandler");
          console.log(action);
          console.log(roomId);
          this.$socketio.emit(action.name, roomId)
        },
        addMessage(message) {
          console.log("addMessage");
          console.log(this.messages.length);
          const messages = []
          for (let i = 0; i < this.messages.length; i++) {
            messages.push(this.messages[i])
          }
          messages.push(message)
          this.messages = messages
        }

      },
      created() {
        console.log("created");
        this.initSocket();
      },
      beforeMount() {
        console.log("beforeMount");
      },
      mounted() {
       
        this.$socketio.on('typing',({ userId, isTyping , roomId}) => {
          console.log('typing');
          const room = this.rooms.find((room) => {
            return room.roomId === roomId
          })
          if(isTyping) {
            room.typingUsers = [...room.typingUsers, userId]
          } else {
            const index = room.typingUsers.indexOf(userId)
            typingUsers = []
            for (let i = 0; i < room.typingUsers.length; i++) {
              if (room.typingUsers[i] != userId)
                typingUsers.push(room.typingUsers[i])
            }
            room.typingUsers = typingUsers
          }
        });

        this.$socketio.on('message',(message) => {
          console.log('message');
          console.log(message);
          this.addMessage(message)
        });
        this.getRooms();
        this.currentUserId = this.$store.getters.getUser._id;

        console.log("mounted CHAT");
        // console.log(this.currentUserId)
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